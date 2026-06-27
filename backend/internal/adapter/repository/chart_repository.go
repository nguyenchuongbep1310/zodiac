package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/zodiac/backend/internal/domain"
	domrepo "github.com/zodiac/backend/internal/domain/repository"
)

// chartRecord is the flat DB model for natal_charts rows.
type chartRecord struct {
	ID           uuid.UUID `db:"id"`
	ProfileID    uuid.UUID `db:"profile_id"`
	HouseSystem  string    `db:"house_system"`
	ZodiacSystem string    `db:"zodiac_system"`
	IsRectified  bool      `db:"is_rectified"`
	CreatedAt    time.Time `db:"created_at"`
}

// planetRecord is the flat DB model for planets rows.
type planetRecord struct {
	ID            uuid.UUID `db:"id"`
	ChartID       uuid.UUID `db:"chart_id"`
	PlanetName    string    `db:"planet_name"`
	Longitude     float64   `db:"longitude"`
	Latitude      float64   `db:"latitude"`
	Speed         float64   `db:"speed"`
	IsRetrograde  bool      `db:"is_retrograde"`
	Sign          string    `db:"sign"`
	HousePosition int       `db:"house_position"`
}

// houseRecord is the flat DB model for houses rows.
type houseRecord struct {
	ID            uuid.UUID `db:"id"`
	ChartID       uuid.UUID `db:"chart_id"`
	HouseNumber   int       `db:"house_number"`
	CuspLongitude float64   `db:"cusp_longitude"`
	Sign          string    `db:"sign"`
}

// aspectRecord is the flat DB model for aspects rows.
type aspectRecord struct {
	ID         uuid.UUID `db:"id"`
	ChartID    uuid.UUID `db:"chart_id"`
	Planet1    string    `db:"planet_1"`
	Planet2    string    `db:"planet_2"`
	AspectType string    `db:"aspect_type"`
	Orb        float64   `db:"orb"`
	IsApplying bool      `db:"is_applying"`
}

// PostgresChartRepository implements domain/repository.ChartRepository using sqlx.
type PostgresChartRepository struct {
	db *sqlx.DB
}

// Compile-time assertion that PostgresChartRepository satisfies the interface.
var _ domrepo.ChartRepository = (*PostgresChartRepository)(nil)

// NewPostgresChartRepository constructs a new PostgresChartRepository.
func NewPostgresChartRepository(db *sqlx.DB) *PostgresChartRepository {
	return &PostgresChartRepository{db: db}
}

func (r *PostgresChartRepository) Save(ctx context.Context, chart *domain.NatalChart) (*domain.NatalChart, error) {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("chartRepo.Save begin tx: %w", err)
	}
	defer tx.Rollback()

	const insertChart = `
		INSERT INTO natal_charts (id, profile_id, house_system, zodiac_system, is_rectified)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING created_at`

	row := tx.QueryRowContext(ctx, insertChart,
		chart.ID, chart.ProfileID, chart.HouseSystem, chart.ZodiacSystem, chart.IsRectified,
	)
	if err := row.Scan(&chart.CreatedAt); err != nil {
		return nil, fmt.Errorf("chartRepo.Save insert chart: %w", err)
	}

	if err := insertPlanets(ctx, tx, chart.ID, chart.Planets); err != nil {
		return nil, err
	}

	if err := insertHouses(ctx, tx, chart.ID, chart.Houses); err != nil {
		return nil, err
	}

	if err := insertAspects(ctx, tx, chart.ID, chart.Aspects); err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("chartRepo.Save commit: %w", err)
	}

	return chart, nil
}

func (r *PostgresChartRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.NatalChart, error) {
	const query = `
		SELECT id, profile_id, house_system, zodiac_system, is_rectified, created_at
		FROM natal_charts WHERE id = $1`

	var rec chartRecord
	if err := r.db.GetContext(ctx, &rec, query, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound("natal chart")
		}
		return nil, fmt.Errorf("chartRepo.GetByID: %w", err)
	}

	return r.hydrateChart(ctx, &rec)
}

func (r *PostgresChartRepository) GetByProfileID(ctx context.Context, profileID uuid.UUID) (*domain.NatalChart, error) {
	const query = `
		SELECT id, profile_id, house_system, zodiac_system, is_rectified, created_at
		FROM natal_charts WHERE profile_id = $1 ORDER BY created_at DESC LIMIT 1`

	var rec chartRecord
	if err := r.db.GetContext(ctx, &rec, query, profileID); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound("natal chart")
		}
		return nil, fmt.Errorf("chartRepo.GetByProfileID: %w", err)
	}

	return r.hydrateChart(ctx, &rec)
}

func (r *PostgresChartRepository) ListByProfileID(ctx context.Context, profileID uuid.UUID) ([]*domain.NatalChart, error) {
	const query = `
		SELECT id, profile_id, house_system, zodiac_system, is_rectified, created_at
		FROM natal_charts WHERE profile_id = $1 ORDER BY created_at DESC`

	var recs []chartRecord
	if err := r.db.SelectContext(ctx, &recs, query, profileID); err != nil {
		return nil, fmt.Errorf("chartRepo.ListByProfileID: %w", err)
	}

	charts := make([]*domain.NatalChart, 0, len(recs))
	for i := range recs {
		chart, err := r.hydrateChart(ctx, &recs[i])
		if err != nil {
			return nil, err
		}
		charts = append(charts, chart)
	}
	return charts, nil
}

func (r *PostgresChartRepository) Delete(ctx context.Context, id uuid.UUID) error {
	const query = `DELETE FROM natal_charts WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("chartRepo.Delete: %w", err)
	}

	affected, _ := result.RowsAffected()
	if affected == 0 {
		return domain.ErrNotFound("natal chart")
	}

	return nil
}

// hydrateChart fetches and attaches all child entities to a NatalChart.
func (r *PostgresChartRepository) hydrateChart(ctx context.Context, rec *chartRecord) (*domain.NatalChart, error) {
	chart := &domain.NatalChart{
		ID:           rec.ID,
		ProfileID:    rec.ProfileID,
		HouseSystem:  rec.HouseSystem,
		ZodiacSystem: rec.ZodiacSystem,
		IsRectified:  rec.IsRectified,
		CreatedAt:    rec.CreatedAt,
	}

	var pRecs []planetRecord
	if err := r.db.SelectContext(ctx, &pRecs,
		`SELECT id, chart_id, planet_name, longitude, latitude, speed, is_retrograde, sign, house_position FROM planets WHERE chart_id = $1`,
		rec.ID,
	); err != nil {
		return nil, fmt.Errorf("chartRepo hydrate planets: %w", err)
	}
	for _, p := range pRecs {
		chart.Planets = append(chart.Planets, domain.PlanetPosition{
			ID: p.ID, ChartID: p.ChartID, PlanetName: p.PlanetName,
			Longitude: p.Longitude, Latitude: p.Latitude, Speed: p.Speed,
			IsRetrograde: p.IsRetrograde, Sign: p.Sign, HousePosition: p.HousePosition,
		})
	}

	var hRecs []houseRecord
	if err := r.db.SelectContext(ctx, &hRecs,
		`SELECT id, chart_id, house_number, cusp_longitude, sign FROM houses WHERE chart_id = $1 ORDER BY house_number`,
		rec.ID,
	); err != nil {
		return nil, fmt.Errorf("chartRepo hydrate houses: %w", err)
	}
	for _, h := range hRecs {
		chart.Houses = append(chart.Houses, domain.HouseCusp{
			ID: h.ID, ChartID: h.ChartID, HouseNumber: h.HouseNumber,
			CuspLongitude: h.CuspLongitude, Sign: h.Sign,
		})
	}

	var aRecs []aspectRecord
	if err := r.db.SelectContext(ctx, &aRecs,
		`SELECT id, chart_id, planet_1, planet_2, aspect_type, orb, is_applying FROM aspects WHERE chart_id = $1`,
		rec.ID,
	); err != nil {
		return nil, fmt.Errorf("chartRepo hydrate aspects: %w", err)
	}
	for _, a := range aRecs {
		chart.Aspects = append(chart.Aspects, domain.Aspect{
			ID: a.ID, ChartID: a.ChartID, Planet1: a.Planet1, Planet2: a.Planet2,
			AspectType: domain.AspectType(a.AspectType), Orb: a.Orb, IsApplying: a.IsApplying,
		})
	}

	return chart, nil
}

func insertPlanets(ctx context.Context, tx *sqlx.Tx, chartID uuid.UUID, planets []domain.PlanetPosition) error {
	for _, p := range planets {
		_, err := tx.ExecContext(ctx,
			`INSERT INTO planets (id, chart_id, planet_name, longitude, latitude, speed, is_retrograde, sign, house_position)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
			p.ID, chartID, p.PlanetName, p.Longitude, p.Latitude, p.Speed, p.IsRetrograde, p.Sign, p.HousePosition,
		)
		if err != nil {
			return fmt.Errorf("insertPlanets %s: %w", p.PlanetName, err)
		}
	}
	return nil
}

func insertHouses(ctx context.Context, tx *sqlx.Tx, chartID uuid.UUID, houses []domain.HouseCusp) error {
	for _, h := range houses {
		_, err := tx.ExecContext(ctx,
			`INSERT INTO houses (id, chart_id, house_number, cusp_longitude, sign) VALUES ($1, $2, $3, $4, $5)`,
			h.ID, chartID, h.HouseNumber, h.CuspLongitude, h.Sign,
		)
		if err != nil {
			return fmt.Errorf("insertHouses house %d: %w", h.HouseNumber, err)
		}
	}
	return nil
}

func insertAspects(ctx context.Context, tx *sqlx.Tx, chartID uuid.UUID, aspects []domain.Aspect) error {
	for _, a := range aspects {
		_, err := tx.ExecContext(ctx,
			`INSERT INTO aspects (id, chart_id, planet_1, planet_2, aspect_type, orb, is_applying)
			 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			a.ID, chartID, a.Planet1, a.Planet2, string(a.AspectType), a.Orb, a.IsApplying,
		)
		if err != nil {
			return fmt.Errorf("insertAspects %s/%s: %w", a.Planet1, a.Planet2, err)
		}
	}
	return nil
}
