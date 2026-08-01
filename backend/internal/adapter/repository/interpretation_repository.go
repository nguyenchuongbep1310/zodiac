package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/zodiac/backend/internal/domain"
	domrepo "github.com/zodiac/backend/internal/domain/repository"
)

// interpretationRecord is the flat DB model for placement_interpretations rows.
type interpretationRecord struct {
	ID            uuid.UUID      `db:"id"`
	Language      string         `db:"language"`
	FactorType    string         `db:"factor_type"`
	FactorValue1  string         `db:"factor_value_1"`
	FactorValue2  string         `db:"factor_value_2"`
	FactorValue3  sql.NullString `db:"factor_value_3"`
	CoreMeaning   string         `db:"core_meaning"`
	RealLife      string         `db:"real_life"`
	Strengths     string         `db:"strengths"`
	Challenges    string         `db:"challenges"`
	Relationships string         `db:"relationships"`
	GrowthPath    string         `db:"growth_path"`
	KeyThemes     pq.StringArray `db:"key_themes"`
	CreatedAt     time.Time      `db:"created_at"`
	UpdatedAt     time.Time      `db:"updated_at"`
}

func recordToTemplate(r *interpretationRecord) *domain.PlacementInterpretation {
	t := &domain.PlacementInterpretation{
		ID:            r.ID,
		Language:      r.Language,
		FactorType:    domain.FactorType(r.FactorType),
		FactorValue1:  r.FactorValue1,
		FactorValue2:  r.FactorValue2,
		CoreMeaning:   r.CoreMeaning,
		RealLife:      r.RealLife,
		Strengths:     r.Strengths,
		Challenges:    r.Challenges,
		Relationships: r.Relationships,
		GrowthPath:    r.GrowthPath,
		KeyThemes:     []string(r.KeyThemes),
		CreatedAt:     r.CreatedAt,
		UpdatedAt:     r.UpdatedAt,
	}
	if r.FactorValue3.Valid {
		v := r.FactorValue3.String
		t.FactorValue3 = &v
	}
	return t
}

// PostgresInterpretationRepository implements InterpretationRepository using sqlx.
type PostgresInterpretationRepository struct {
	db *sqlx.DB
}

// Compile-time assertion.
var _ domrepo.InterpretationRepository = (*PostgresInterpretationRepository)(nil)

// NewPostgresInterpretationRepository constructs a new repository.
func NewPostgresInterpretationRepository(db *sqlx.DB) *PostgresInterpretationRepository {
	return &PostgresInterpretationRepository{db: db}
}

// ── BatchLookup ───────────────────────────────────────────────────────────────
//
// Lookup Strategy:
//   1. Build a VALUES list of all (factor_type, v1, v2, v3) tuples requested.
//   2. Execute a single SQL query joining that VALUES list against the table.
//   3. If language != "en", run a second pass to fill in any missing rows using
//      the English fallback (language fallback is transparent to callers).
//
// This approach gives us O(1) round-trips regardless of chart size.

func (r *PostgresInterpretationRepository) BatchLookup(
	ctx context.Context,
	language string,
	factors []domain.LookupFactor,
) (map[string]*domain.PlacementInterpretation, error) {
	if len(factors) == 0 {
		return map[string]*domain.PlacementInterpretation{}, nil
	}

	result := make(map[string]*domain.PlacementInterpretation, len(factors))

	// First pass: requested language.
	err := r.fetchInto(ctx, language, factors, result)
	if err != nil {
		return nil, err
	}

	// Fallback pass: for any factor not found in the requested language, try "en".
	if language != domain.DefaultLanguage {
		var missing []domain.LookupFactor
		for _, f := range factors {
			if _, found := result[f.Key()]; !found {
				missing = append(missing, f)
			}
		}
		if len(missing) > 0 {
			if err := r.fetchInto(ctx, domain.DefaultLanguage, missing, result); err != nil {
				return nil, err
			}
		}
	}

	return result, nil
}

// fetchInto executes the batch query and populates dest.
// It uses a VALUES constructor joined against the table so we get one round-trip.
func (r *PostgresInterpretationRepository) fetchInto(
	ctx context.Context,
	language string,
	factors []domain.LookupFactor,
	dest map[string]*domain.PlacementInterpretation,
) error {
	// Build:  VALUES ($2,$3,$4,$5), ($6,$7,$8,$9), ...
	// args[0] = language
	args := []interface{}{language}
	placeholders := make([]string, 0, len(factors))
	idx := 2 // $1 is language

	for _, f := range factors {
		v3 := ""
		if f.FactorValue3 != nil {
			v3 = *f.FactorValue3
		}
		placeholders = append(placeholders,
			fmt.Sprintf("($%d::varchar, $%d::varchar, $%d::varchar, $%d::varchar)",
				idx, idx+1, idx+2, idx+3))
		args = append(args, string(f.FactorType), f.FactorValue1, f.FactorValue2, v3)
		idx += 4
	}

	query := fmt.Sprintf(`
		SELECT it.id, it.language, it.factor_type,
		       it.factor_value_1, it.factor_value_2, it.factor_value_3,
		       it.core_meaning, it.real_life, it.strengths, it.challenges,
		       it.relationships, it.growth_path, it.key_themes,
		       it.created_at, it.updated_at
		FROM placement_interpretations it
		JOIN (VALUES %s) AS req(ft, v1, v2, v3)
		  ON it.language      = $1
		 AND LOWER(it.factor_type) = LOWER(req.ft)
		 AND LOWER(TRIM(REPLACE(it.factor_value_1, 'House ', ''))) = LOWER(TRIM(REPLACE(req.v1, 'House ', '')))
		 AND LOWER(it.factor_value_2) = LOWER(req.v2)
		 AND (
		   -- match rows where factor_value_3 is NULL or empty string (planet_in_sign / planet_in_house / house_in_sign)
		   (req.v3 = '' AND (it.factor_value_3 IS NULL OR it.factor_value_3 = ''))
		   OR
		   -- match rows where factor_value_3 is set (aspect)
		   (req.v3 <> '' AND LOWER(it.factor_value_3) = LOWER(req.v3))
		 )
	`, strings.Join(placeholders, ", "))

	var recs []interpretationRecord
	if err := r.db.SelectContext(ctx, &recs, query, args...); err != nil {
		return fmt.Errorf("interpretationRepo.BatchLookup: %w", err)
	}

	for i := range recs {
		tmpl := recordToTemplate(&recs[i])
		for _, reqFactor := range factors {
			if matchFactor(reqFactor, tmpl) {
				if _, exists := dest[reqFactor.Key()]; !exists {
					dest[reqFactor.Key()] = tmpl
				}
			}
		}
	}
	return nil
}

func matchFactor(req domain.LookupFactor, tmpl *domain.PlacementInterpretation) bool {
	if !strings.EqualFold(string(req.FactorType), string(tmpl.FactorType)) {
		return false
	}
	v1Req := strings.TrimSpace(strings.ReplaceAll(req.FactorValue1, "House ", ""))
	v1Tmpl := strings.TrimSpace(strings.ReplaceAll(tmpl.FactorValue1, "House ", ""))
	if !strings.EqualFold(v1Req, v1Tmpl) {
		return false
	}
	if !strings.EqualFold(req.FactorValue2, tmpl.FactorValue2) {
		return false
	}
	reqV3 := ""
	if req.FactorValue3 != nil {
		reqV3 = *req.FactorValue3
	}
	tmplV3 := ""
	if tmpl.FactorValue3 != nil {
		tmplV3 = *tmpl.FactorValue3
	}
	return strings.EqualFold(reqV3, tmplV3)
}

// ── GetByID ───────────────────────────────────────────────────────────────────

func (r *PostgresInterpretationRepository) GetByID(
	ctx context.Context,
	id uuid.UUID,
) (*domain.PlacementInterpretation, error) {
	const q = `
		SELECT id, language, factor_type, factor_value_1, factor_value_2, factor_value_3,
		       core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes, created_at, updated_at
		FROM placement_interpretations WHERE id = $1`

	var rec interpretationRecord
	if err := r.db.GetContext(ctx, &rec, q, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound("interpretation template")
		}
		return nil, fmt.Errorf("interpretationRepo.GetByID: %w", err)
	}
	return recordToTemplate(&rec), nil
}

// ── ListByFactorType ──────────────────────────────────────────────────────────

func (r *PostgresInterpretationRepository) ListByFactorType(
	ctx context.Context,
	language string,
	factorType domain.FactorType,
) ([]*domain.PlacementInterpretation, error) {
	const q = `
		SELECT id, language, factor_type, factor_value_1, factor_value_2, factor_value_3,
		       core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes, created_at, updated_at
		FROM placement_interpretations
		WHERE language = $1 AND factor_type = $2
		ORDER BY factor_value_1, factor_value_2`

	var recs []interpretationRecord
	if err := r.db.SelectContext(ctx, &recs, q, language, string(factorType)); err != nil {
		return nil, fmt.Errorf("interpretationRepo.ListByFactorType: %w", err)
	}

	out := make([]*domain.PlacementInterpretation, 0, len(recs))
	for i := range recs {
		out = append(out, recordToTemplate(&recs[i]))
	}
	return out, nil
}
