package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/zodiac/backend/internal/domain"
)

// UserRepository defines the data access contract for the User aggregate.
// Implementations live in internal/adapter/repository.
type UserRepository interface {
	// Create persists a new User, returning the saved entity.
	Create(ctx context.Context, user *domain.User) (*domain.User, error)

	// GetByID retrieves a User by its primary key.
	GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error)

	// GetByEmail retrieves a User by their unique email address.
	GetByEmail(ctx context.Context, email string) (*domain.User, error)

	// GetByPasswordResetToken retrieves a User by their password reset token.
	GetByPasswordResetToken(ctx context.Context, tokenHash string) (*domain.User, error)

	// Update persists changes to an existing User.
	Update(ctx context.Context, user *domain.User) (*domain.User, error)

	// SoftDelete marks a User as deleted without removing the record.
	SoftDelete(ctx context.Context, id uuid.UUID) error

	// ExistsByEmail checks if an email address is already registered.
	ExistsByEmail(ctx context.Context, email string) (bool, error)
}

// ProfileRepository defines the data access contract for the BirthProfile aggregate.
type ProfileRepository interface {
	// Create persists a new BirthProfile.
	Create(ctx context.Context, profile *domain.BirthProfile) (*domain.BirthProfile, error)

	// GetByID retrieves a BirthProfile by its primary key.
	GetByID(ctx context.Context, id uuid.UUID) (*domain.BirthProfile, error)

	// ListByUserID retrieves all BirthProfiles belonging to a user.
	ListByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.BirthProfile, error)

	// Update persists changes to an existing BirthProfile.
	Update(ctx context.Context, profile *domain.BirthProfile) (*domain.BirthProfile, error)

	// Delete permanently removes a BirthProfile and cascades to related charts.
	Delete(ctx context.Context, id uuid.UUID) error
}

// ChartRepository defines the data access contract for the NatalChart aggregate.
type ChartRepository interface {
	// Save persists a complete NatalChart including its planets, houses, and aspects.
	Save(ctx context.Context, chart *domain.NatalChart) (*domain.NatalChart, error)

	// GetByID retrieves a full NatalChart (including all sub-entities) by its primary key.
	GetByID(ctx context.Context, id uuid.UUID) (*domain.NatalChart, error)

	// GetByProfileID retrieves the most recent chart for a given birth profile.
	GetByProfileID(ctx context.Context, profileID uuid.UUID) (*domain.NatalChart, error)

	// ListByProfileID retrieves all charts for a given birth profile.
	ListByProfileID(ctx context.Context, profileID uuid.UUID) ([]*domain.NatalChart, error)

	// Delete removes a NatalChart and all associated data.
	Delete(ctx context.Context, id uuid.UUID) error
}

// InterpretationRepository defines the data access contract for interpretation_templates.
// The key design goal is to avoid N+1 queries: the service always calls BatchLookup
// with all required factors at once, and receives a map back.
type InterpretationRepository interface {
	// BatchLookup fetches interpretations for all the given factors in a single
	// query. Missing templates are simply absent from the returned map; no error
	// is returned for unfound entries.
	//
	// The returned map is keyed by LookupFactor.Key().
	//
	// Language fallback: if language != DefaultLanguage and no row is found for
	// that language, the implementation transparently falls back to DefaultLanguage.
	BatchLookup(
		ctx context.Context,
		language string,
		factors []domain.LookupFactor,
	) (map[string]*domain.PlacementInterpretation, error)

	// GetByID retrieves a single template by its primary key.
	GetByID(ctx context.Context, id uuid.UUID) (*domain.PlacementInterpretation, error)

	// ListByFactorType returns all active templates of a given type and language.
	// Useful for admin pages and seeding validation.
	ListByFactorType(
		ctx context.Context,
		language string,
		factorType domain.FactorType,
	) ([]*domain.PlacementInterpretation, error)
}
