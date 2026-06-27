package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/zodiac/backend/internal/domain"
	domrepo "github.com/zodiac/backend/internal/domain/repository"
)

// userRecord is the flat DB model used for scanning sqlx rows.
// Separate from the domain model to avoid polluting the domain with db tags.
type userRecord struct {
	ID                       uuid.UUID      `db:"id"`
	Email                    string         `db:"email"`
	PasswordHash             string         `db:"password_hash"`
	PasswordResetTokenHash   sql.NullString `db:"password_reset_token_hash"`
	PasswordResetExpiresAt sql.NullTime   `db:"password_reset_expires_at"`
	RoleID                   uuid.UUID      `db:"role_id"`
	RoleName                 string         `db:"role_name"`
	Status                   string         `db:"status"`
	LastLoginAt              *sql.NullTime  `db:"last_login_at"`
	CreatedAt                sql.NullTime   `db:"created_at"`
	UpdatedAt                sql.NullTime   `db:"updated_at"`
}

// PostgresUserRepository implements domain/repository.UserRepository using sqlx.
type PostgresUserRepository struct {
	db *sqlx.DB
}

// Compile-time assertion that PostgresUserRepository satisfies the interface.
var _ domrepo.UserRepository = (*PostgresUserRepository)(nil)

// NewPostgresUserRepository constructs a new PostgresUserRepository.
func NewPostgresUserRepository(db *sqlx.DB) *PostgresUserRepository {
	return &PostgresUserRepository{db: db}
}

func (r *PostgresUserRepository) Create(ctx context.Context, user *domain.User) (*domain.User, error) {
	const query = `
		INSERT INTO users (id, email, password_hash, role_id, status)
		VALUES (:id, :email, :password_hash, (SELECT id FROM roles WHERE name = :role_name), :status)
		RETURNING id, created_at, updated_at`

	row := map[string]any{
		"id":            user.ID,
		"email":         user.Email,
		"password_hash": user.PasswordHash,
		"role_name":     user.Role.Name,
		"status":        string(user.Status),
	}

	rows, err := r.db.NamedQueryContext(ctx, query, row)
	if err != nil {
		return nil, fmt.Errorf("userRepo.Create: %w", err)
	}
	defer rows.Close()

	if rows.Next() {
		if err := rows.Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt); err != nil {
			return nil, fmt.Errorf("userRepo.Create scan: %w", err)
		}
	}

	return user, nil
}

func (r *PostgresUserRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	const query = `
		SELECT u.id, u.email, u.password_hash, u.status, u.last_login_at, u.created_at, u.updated_at,
		       u.password_reset_token_hash, u.password_reset_expires_at,
		       r.id AS role_id, r.name AS role_name
		FROM users u
		JOIN roles r ON r.id = u.role_id
		WHERE u.id = $1 AND u.status != 'deleted'`

	var rec userRecord
	if err := r.db.GetContext(ctx, &rec, query, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound("user")
		}
		return nil, fmt.Errorf("userRepo.GetByID: %w", err)
	}

	return mapUserRecord(&rec), nil
}

func (r *PostgresUserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	const query = `
		SELECT u.id, u.email, u.password_hash, u.status, u.last_login_at, u.created_at, u.updated_at,
		       u.password_reset_token_hash, u.password_reset_expires_at,
		       r.id AS role_id, r.name AS role_name
		FROM users u
		JOIN roles r ON r.id = u.role_id
		WHERE u.email = $1 AND u.status != 'deleted'`

	var rec userRecord
	if err := r.db.GetContext(ctx, &rec, query, email); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound("user")
		}
		return nil, fmt.Errorf("userRepo.GetByEmail: %w", err)
	}

	return mapUserRecord(&rec), nil
}

func (r *PostgresUserRepository) GetByPasswordResetToken(ctx context.Context, tokenHash string) (*domain.User, error) {
	const query = `
		SELECT u.id, u.email, u.password_hash, u.status, u.last_login_at, u.created_at, u.updated_at,
		       u.password_reset_token_hash, u.password_reset_expires_at,
		       r.id AS role_id, r.name AS role_name
		FROM users u
		JOIN roles r ON r.id = u.role_id
		WHERE u.password_reset_token_hash = $1 AND u.status != 'deleted'`

	var rec userRecord
	if err := r.db.GetContext(ctx, &rec, query, tokenHash); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound("user")
		}
		return nil, fmt.Errorf("userRepo.GetByPasswordResetToken: %w", err)
	}

	return mapUserRecord(&rec), nil
}

func (r *PostgresUserRepository) Update(ctx context.Context, user *domain.User) (*domain.User, error) {
	const query = `
		UPDATE users
		SET
			email = :email,
			password_hash = :password_hash,
			role_id = (SELECT id FROM roles WHERE name = :role_name),
			status = :status,
			last_login_at = :last_login_at,
			password_reset_token_hash = :password_reset_token_hash,
			password_reset_expires_at = :password_reset_expires_at,
			updated_at = now()
		WHERE id = :id AND status != 'deleted'
		RETURNING updated_at`

	// Build map for named query
	row := map[string]any{
		"id":                          user.ID,
		"email":                       user.Email,
		"password_hash":               user.PasswordHash,
		"role_name":                   user.Role.Name,
		"status":                      string(user.Status),
		"last_login_at":               user.LastLoginAt,
		"password_reset_token_hash":   user.PasswordResetTokenHash,
		"password_reset_expires_at":   user.PasswordResetExpiresAt,
	}

	rows, err := r.db.NamedQueryContext(ctx, query, row)
	if err != nil {
		return nil, fmt.Errorf("userRepo.Update named query: %w", err)
	}
	defer rows.Close()

	if rows.Next() {
		if err := rows.Scan(&user.UpdatedAt); err != nil {
			return nil, fmt.Errorf("userRepo.Update scan: %w", err)
		}
	} else {
		// This case handles if the user was not found (e.g., already deleted)
		return nil, domain.ErrNotFound("user")
	}

	return user, nil
}

func (r *PostgresUserRepository) SoftDelete(ctx context.Context, id uuid.UUID) error {
	const query = `UPDATE users SET status = 'deleted', updated_at = now() WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("userRepo.SoftDelete: %w", err)
	}

	affected, _ := result.RowsAffected()
	if affected == 0 {
		return domain.ErrNotFound("user")
	}

	return nil
}

func (r *PostgresUserRepository) ExistsByEmail(ctx context.Context, email string) (bool, error) {
	const query = `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND status != 'deleted')`

	var exists bool
	if err := r.db.GetContext(ctx, &exists, query, email); err != nil {
		return false, fmt.Errorf("userRepo.ExistsByEmail: %w", err)
	}

	return exists, nil
}

func mapUserRecord(rec *userRecord) *domain.User {
	u := &domain.User{
		ID:           rec.ID,
		Email:        rec.Email,
		PasswordHash: rec.PasswordHash,
		Status:       domain.UserStatus(rec.Status),
		Role: domain.Role{
			ID:   rec.RoleID,
			Name: rec.RoleName,
		},
	}
	if rec.CreatedAt.Valid {
		u.CreatedAt = rec.CreatedAt.Time
	}
	if rec.UpdatedAt.Valid {
		u.UpdatedAt = rec.UpdatedAt.Time
	}
	if rec.LastLoginAt != nil && rec.LastLoginAt.Valid {
		u.LastLoginAt = &rec.LastLoginAt.Time
	}
	if rec.PasswordResetTokenHash.Valid {
		u.PasswordResetTokenHash = &rec.PasswordResetTokenHash.String
	}
	if rec.PasswordResetExpiresAt.Valid {
		u.PasswordResetExpiresAt = &rec.PasswordResetExpiresAt.Time
	}
	return u
}
