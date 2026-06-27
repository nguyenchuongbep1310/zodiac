// Package service contains the application use-case layer.
// Services orchestrate domain objects and repositories, enforcing business rules
// without coupling to any transport (HTTP, gRPC, etc.).
package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
	"golang.org/x/crypto/argon2"

	"github.com/zodiac/backend/internal/adapter/middleware"
	"github.com/zodiac/backend/internal/config"
	"github.com/zodiac/backend/internal/domain"
	domrepo "github.com/zodiac/backend/internal/domain/repository"
)

const (
	// Argon2id parameters — tuned for ~200 ms on a modern server.
	argonTime    = 2
	argonMemory  = 64 * 1024 // 64 MiB
	argonThreads = 4
	argonKeyLen  = 32

	argonSaltLen = 16

	// Refresh token byte length before base64 encoding.
	refreshTokenBytes = 32

	// Redis key prefix for refresh tokens.
	refreshTokenPrefix = "refresh:"
)

// AuthService handles all authentication use-cases.
type AuthService struct {
	userRepo domrepo.UserRepository
	cfg      *config.Config
	redis    *redis.Client
	log      *zap.Logger
}

// NewAuthService constructs a ready-to-use AuthService.
func NewAuthService(
	userRepo domrepo.UserRepository,
	cfg *config.Config,
	redisClient *redis.Client,
	log *zap.Logger,
) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		cfg:      cfg,
		redis:    redisClient,
		log:      log,
	}
}

// RegisterResult carries the output of a successful registration.
type RegisterResult struct {
	User      *domain.User
	TokenPair TokenPairResult
}

// TokenPairResult carries access + refresh tokens plus metadata.
type TokenPairResult struct {
	AccessToken  string
	RefreshToken string
	ExpiresIn    int64 // seconds until access token expiry
}

// Register creates a new user account with an Argon2id-hashed password.
// Returns ErrConflict if the email is already registered.
func (s *AuthService) Register(ctx context.Context, email, password string) (*RegisterResult, error) {
	exists, err := s.userRepo.ExistsByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("authService.Register check email: %w", err)
	}
	if exists {
		return nil, domain.ErrConflict("user")
	}

	hash, err := hashPassword(password)
	if err != nil {
		return nil, fmt.Errorf("authService.Register hash password: %w", err)
	}

	user := &domain.User{
		ID:           uuid.New(),
		Email:        email,
		PasswordHash: hash,
		Status:       domain.UserStatusActive,
		Role: domain.Role{
			// Default role: the seed migration must insert a "user" role.
			// We look it up by name in a real system; here we rely on the DB default.
			Name: "user",
		},
	}

	// Persist — the repository fills in CreatedAt/UpdatedAt from RETURNING.
	saved, err := s.userRepo.Create(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("authService.Register persist: %w", err)
	}

	// Re-fetch to pick up the role FK (Create only returns scalar timestamps).
	saved, err = s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("authService.Register re-fetch: %w", err)
	}

	pair, err := s.issueTokenPair(ctx, saved)
	if err != nil {
		return nil, err
	}

	saved.Sanitize()
	return &RegisterResult{User: saved, TokenPair: pair}, nil
}

// Login validates credentials and issues a fresh token pair on success.
func (s *AuthService) Login(ctx context.Context, email, password string) (*TokenPairResult, error) {
	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		if errors.As(err, new(*domain.AppError)) {
			// Mask the distinction between "not found" and "wrong password".
			return nil, domain.ErrUnauthorized("invalid email or password")
		}
		return nil, fmt.Errorf("authService.Login lookup: %w", err)
	}

	if !user.IsActive() {
		return nil, domain.ErrUnauthorized("account is not active")
	}

	if !verifyPassword(password, user.PasswordHash) {
		return nil, domain.ErrUnauthorized("invalid email or password")
	}

	pair, err := s.issueTokenPair(ctx, user)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	user.LastLoginAt = &now
	if _, err := s.userRepo.Update(ctx, user); err != nil {
		// Non-fatal: log and continue.
		s.log.Warn("authService.Login: failed to update last_login_at",
			zap.String("user_id", user.ID.String()),
			zap.Error(err),
		)
	}

	return &pair, nil
}

// RefreshTokens validates a refresh token and rotates both tokens.
func (s *AuthService) RefreshTokens(ctx context.Context, rawRefreshToken string) (*TokenPairResult, error) {
	key := refreshTokenPrefix + rawRefreshToken

	userIDStr, err := s.redis.Get(ctx, key).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return nil, domain.ErrUnauthorized("refresh token is invalid or expired")
		}
		return nil, fmt.Errorf("authService.RefreshTokens redis get: %w", err)
	}

	// Immediately revoke to enforce single-use (rotation).
	if err := s.redis.Del(ctx, key).Err(); err != nil {
		s.log.Warn("authService.RefreshTokens: failed to delete refresh token", zap.Error(err))
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return nil, domain.ErrUnauthorized("refresh token payload is corrupt")
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("authService.RefreshTokens user lookup: %w", err)
	}

	if !user.IsActive() {
		return nil, domain.ErrUnauthorized("account is not active")
	}

	pair, err := s.issueTokenPair(ctx, user)
	if err != nil {
		return nil, err
	}

	return &pair, nil
}

// ForgotPassword initiates the password reset process for a user.
// It generates a secure, single-use token, saves its hash to the database,
// and simulates sending the raw token to the user's email.
// It does not return an error if the user is not found to prevent email enumeration.
func (s *AuthService) ForgotPassword(ctx context.Context, email string) error {
	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		// Do not reveal if user exists or not.
		// Log the error for debugging and return success to the caller.
		s.log.Debug("authService.ForgotPassword: user not found, but not returning error", zap.String("email", email))
		return nil
	}

	// Generate a cryptographically random token.
	rawToken := make([]byte, 32)
	if _, err := rand.Read(rawToken); err != nil {
		return fmt.Errorf("authService.ForgotPassword: failed to generate token: %w", err)
	}
	encodedToken := base64.URLEncoding.EncodeToString(rawToken)

	// Hash the token for database storage (never store raw tokens).
	tokenHash := sha256.Sum256([]byte(encodedToken))
	tokenHashStr := fmt.Sprintf("%x", tokenHash[:])

	// Set expiry for the token (e.g., 1 hour).
	expiresAt := time.Now().UTC().Add(1 * time.Hour)
	user.PasswordResetTokenHash = &tokenHashStr
	user.PasswordResetExpiresAt = &expiresAt

	if _, err := s.userRepo.Update(ctx, user); err != nil {
		return fmt.Errorf("authService.ForgotPassword: failed to save reset token: %w", err)
	}

	// Simulate sending an email. In a real app, this would use an email service.
	s.log.Info("Simulating password reset email",
		zap.String("email", email),
		zap.String("reset_url", fmt.Sprintf("https://zodiac.com/reset-password?token=%s", encodedToken)),
	)

	return nil
}

// ResetPassword completes the password reset process. It validates the token,
// checks for expiry, and sets the user's new password if the token is valid.
func (s *AuthService) ResetPassword(ctx context.Context, encodedToken, newPassword string) error {
	// Hash the raw token to find the match in the database.
	tokenHash := sha256.Sum256([]byte(encodedToken))
	tokenHashStr := fmt.Sprintf("%x", tokenHash[:])

	user, err := s.userRepo.GetByPasswordResetToken(ctx, tokenHashStr)
	if err != nil {
		// Do not reveal if the token was valid or not.
		return domain.ErrValidation("invalid or expired reset token")
	}

	// Check for token expiry.
	if user.PasswordResetExpiresAt == nil || time.Now().UTC().After(*user.PasswordResetExpiresAt) {
		return domain.ErrValidation("invalid or expired reset token")
	}

	// The token is valid and not expired. Hash the new password.
	newPasswordHash, err := hashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("authService.ResetPassword: failed to hash new password: %w", err)
	}

	// Update user record.
	user.PasswordHash = newPasswordHash
	user.PasswordResetTokenHash = nil // Invalidate the token.
	user.PasswordResetExpiresAt = nil

	if _, err := s.userRepo.Update(ctx, user); err != nil {
		return fmt.Errorf("authService.ResetPassword: failed to update password: %w", err)
	}

	s.log.Info("user password has been reset successfully", zap.String("user_id", user.ID.String()))
	return nil
}

// issueTokenPair mints an access JWT and a cryptographically random refresh
// token, storing the refresh token in Redis.
func (s *AuthService) issueTokenPair(ctx context.Context, user *domain.User) (TokenPairResult, error) {
	ttl := s.cfg.JWT.AccessTokenTTL
	now := time.Now().UTC()
	expiresAt := now.Add(ttl)

	claims := middleware.Claims{
		UserID: user.ID,
		Role:   user.Role.Name,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   user.ID.String(),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			Issuer:    "zodiac-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	accessToken, err := token.SignedString([]byte(s.cfg.JWT.Secret))
	if err != nil {
		return TokenPairResult{}, fmt.Errorf("authService: sign JWT: %w", err)
	}

	refreshToken, err := generateRefreshToken()
	if err != nil {
		return TokenPairResult{}, fmt.Errorf("authService: generate refresh token: %w", err)
	}

	refreshTTL := s.cfg.JWT.RefreshTokenTTL
	if err := s.redis.Set(ctx, refreshTokenPrefix+refreshToken, user.ID.String(), refreshTTL).Err(); err != nil {
		return TokenPairResult{}, fmt.Errorf("authService: store refresh token: %w", err)
	}

	return TokenPairResult{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(ttl.Seconds()),
	}, nil
}

// ─── Argon2id helpers ────────────────────────────────────────────────────────

// hashPassword produces an Argon2id encoded hash. The output is a
// base64(salt):base64(hash) string stored verbatim in the database.
func hashPassword(password string) (string, error) {
	salt := make([]byte, argonSaltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("hashPassword: generate salt: %w", err)
	}

	hash := argon2.IDKey([]byte(password), salt, argonTime, argonMemory, argonThreads, argonKeyLen)

	encoded := fmt.Sprintf("%s:%s",
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	)
	return encoded, nil
}

// verifyPassword checks a plain-text password against a stored Argon2id hash.
func verifyPassword(password, encoded string) bool {
	parts := strings.SplitN(encoded, ":", 2)
	if len(parts) != 2 {
		return false
	}
	saltB64, hashB64 := parts[0], parts[1]

	salt, err := base64.RawStdEncoding.DecodeString(saltB64)
	if err != nil {
		return false
	}

	expectedHash, err := base64.RawStdEncoding.DecodeString(hashB64)
	if err != nil {
		return false
	}

	computed := argon2.IDKey([]byte(password), salt, argonTime, argonMemory, argonThreads, argonKeyLen)

	// Constant-time comparison via XOR accumulation.
	if len(computed) != len(expectedHash) {
		return false
	}
	var diff byte
	for i := range computed {
		diff |= computed[i] ^ expectedHash[i]
	}
	return diff == 0
}

// generateRefreshToken returns a URL-safe, cryptographically random string.
func generateRefreshToken() (string, error) {
	b := make([]byte, refreshTokenBytes)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}
