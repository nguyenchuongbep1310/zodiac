package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/zodiac/backend/internal/domain"
)


// ChartRepository defines the data access contract for the NatalChart aggregate.
type ChartRepository interface {
	// Save persists a complete NatalChart including its planets, houses, and aspects.
	Save(ctx context.Context, chart *domain.NatalChart) (*domain.NatalChart, error)

	// GetByID retrieves a full NatalChart (including all sub-entities) by its primary key.
	GetByID(ctx context.Context, id uuid.UUID) (*domain.NatalChart, error)

	// ListByUserID retrieves all charts for a given user.
	ListByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.NatalChart, error)

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
