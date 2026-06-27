package domain

import (
	"time"

	"github.com/google/uuid"
)

// UserStatus represents the lifecycle state of a user account.
type UserStatus string

const (
	UserStatusActive    UserStatus = "active"
	UserStatusSuspended UserStatus = "suspended"
	UserStatusDeleted   UserStatus = "deleted"
)

// Role is a value object representing a permission role.
type Role struct {
	ID          uuid.UUID
	Name        string
	Description string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// User is the aggregate root for identity and access.
type User struct {
	ID           uuid.UUID
	Email        string
	PasswordHash string
	Role         Role
	Status       UserStatus
	LastLoginAt  *time.Time
	CreatedAt    time.Time
	UpdatedAt    time.Time
	PasswordResetTokenHash   *string
	PasswordResetExpiresAt *time.Time
}

// IsActive reports whether the user is allowed to authenticate.
func (u *User) IsActive() bool {
	return u.Status == UserStatusActive
}

// Sanitize clears sensitive fields before the struct is returned to callers
// outside the auth context.
func (u *User) Sanitize() {
	u.PasswordHash = ""
	u.PasswordResetTokenHash = nil
	u.PasswordResetExpiresAt = nil
}

// Preferences holds user-level configuration for chart rendering.
type Preferences struct {
	HouseSystem string // e.g. "placidus", "koch"
	OrbLimit    float64
}
