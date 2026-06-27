package middleware

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/zodiac/backend/internal/domain"
)

const (
	// ContextKeyUserID is the key used to store the authenticated user's ID in Gin context.
	ContextKeyUserID = "userID"
	// ContextKeyUserRole is the key used to store the authenticated user's role in Gin context.
	ContextKeyUserRole = "userRole"
)

// Claims defines the JWT payload structure.
type Claims struct {
	UserID uuid.UUID `json:"uid"`
	Role   string    `json:"role"`
	jwt.RegisteredClaims
}

// Auth returns a Gin middleware that validates a Bearer JWT from the Authorization header.
// On success, it sets the user ID and role into the Gin context for downstream handlers.
func Auth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"code":    "UNAUTHORIZED",
				"message": "authorization header is required",
			})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"code":    "UNAUTHORIZED",
				"message": "authorization header must be in 'Bearer <token>' format",
			})
			return
		}

		tokenStr := parts[1]

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, domain.ErrUnauthorized("unexpected signing method")
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			code := "INVALID_TOKEN"
			msg := "token is invalid or malformed"

			if errors.Is(err, jwt.ErrTokenExpired) {
				code = "TOKEN_EXPIRED"
				msg = "token has expired"
			}

			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"code":    code,
				"message": msg,
			})
			return
		}

		c.Set(ContextKeyUserID, claims.UserID)
		c.Set(ContextKeyUserRole, claims.Role)
		c.Next()
	}
}

// RequireRole returns a middleware that enforces role-based access control.
// Must be chained after Auth.
func RequireRole(roles ...string) gin.HandlerFunc {
	allowedRoles := make(map[string]struct{}, len(roles))
	for _, r := range roles {
		allowedRoles[r] = struct{}{}
	}

	return func(c *gin.Context) {
		role, exists := c.Get(ContextKeyUserRole)
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"code":    "FORBIDDEN",
				"message": "access denied",
			})
			return
		}

		roleStr, ok := role.(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"code":    "FORBIDDEN",
				"message": "access denied",
			})
			return
		}

		if _, allowed := allowedRoles[roleStr]; !allowed {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"code":    "FORBIDDEN",
				"message": "insufficient permissions",
			})
			return
		}

		c.Next()
	}
}

// GetUserID extracts the authenticated user's UUID from the Gin context.
// Panics if Auth middleware was not applied, which is an unrecoverable programming error.
func GetUserID(c *gin.Context) uuid.UUID {
	id, _ := c.Get(ContextKeyUserID)
	return id.(uuid.UUID)
}
