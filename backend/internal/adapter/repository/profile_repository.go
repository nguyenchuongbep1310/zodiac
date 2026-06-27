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

// profileRecord is the flat DB model for birth_profiles rows.
type profileRecord struct {
	ID        uuid.UUID `db:"id"`
	UserID    uuid.UUID `db:"user_id"`
	Name      string    `db:"name"`
	BirthDate time.Time `db:"birth_date"`
	BirthTime string    `db:"birth_time"`
	Timezone  string    `db:"timezone"`
	Latitude  float64   `db:"latitude"`
	Longitude float64   `db:"longitude"`
	City      string    `db:"city"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

// PostgresProfileRepository implements domain/repository.ProfileRepository using sqlx.
type PostgresProfileRepository struct {
	db *sqlx.DB
}

// Compile-time assertion that PostgresProfileRepository satisfies the interface.
var _ domrepo.ProfileRepository = (*PostgresProfileRepository)(nil)

// NewPostgresProfileRepository constructs a new PostgresProfileRepository.
func NewPostgresProfileRepository(db *sqlx.DB) *PostgresProfileRepository {
	return &PostgresProfileRepository{db: db}
}

func (r *PostgresProfileRepository) Create(ctx context.Context, p *domain.BirthProfile) (*domain.BirthProfile, error) {
	const query = `
		INSERT INTO birth_profiles (id, user_id, name, birth_date, birth_time, timezone, latitude, longitude, city)
		VALUES (:id, :user_id, :name, :birth_date, :birth_time, :timezone, :latitude, :longitude, :city)
		RETURNING created_at, updated_at`

	row := map[string]any{
		"id":         p.ID,
		"user_id":    p.UserID,
		"name":       p.Name,
		"birth_date": p.BirthTime.Date,
		"birth_time": p.BirthTime.Time,
		"timezone":   p.BirthTime.Timezone,
		"latitude":   p.Location.Latitude,
		"longitude":  p.Location.Longitude,
		"city":       p.Location.City,
	}

	rows, err := r.db.NamedQueryContext(ctx, query, row)
	if err != nil {
		return nil, fmt.Errorf("profileRepo.Create: %w", err)
	}
	defer rows.Close()

	if rows.Next() {
		if err := rows.Scan(&p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, fmt.Errorf("profileRepo.Create scan: %w", err)
		}
	}

	return p, nil
}

func (r *PostgresProfileRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.BirthProfile, error) {
	const query = `
		SELECT id, user_id, name, birth_date, birth_time, timezone, latitude, longitude, city, created_at, updated_at
		FROM birth_profiles WHERE id = $1`

	var rec profileRecord
	if err := r.db.GetContext(ctx, &rec, query, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound("birth profile")
		}
		return nil, fmt.Errorf("profileRepo.GetByID: %w", err)
	}

	return mapProfileRecord(&rec), nil
}

func (r *PostgresProfileRepository) ListByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.BirthProfile, error) {
	const query = `
		SELECT id, user_id, name, birth_date, birth_time, timezone, latitude, longitude, city, created_at, updated_at
		FROM birth_profiles WHERE user_id = $1 ORDER BY created_at DESC`

	var recs []profileRecord
	if err := r.db.SelectContext(ctx, &recs, query, userID); err != nil {
		return nil, fmt.Errorf("profileRepo.ListByUserID: %w", err)
	}

	profiles := make([]*domain.BirthProfile, 0, len(recs))
	for i := range recs {
		profiles = append(profiles, mapProfileRecord(&recs[i]))
	}
	return profiles, nil
}

func (r *PostgresProfileRepository) Update(ctx context.Context, p *domain.BirthProfile) (*domain.BirthProfile, error) {
	const query = `
		UPDATE birth_profiles
		SET name = $1, birth_date = $2, birth_time = $3, timezone = $4,
		    latitude = $5, longitude = $6, city = $7, updated_at = now()
		WHERE id = $8 AND user_id = $9
		RETURNING updated_at`

	row := r.db.QueryRowContext(ctx, query,
		p.Name, p.BirthTime.Date, p.BirthTime.Time, p.BirthTime.Timezone,
		p.Location.Latitude, p.Location.Longitude, p.Location.City,
		p.ID, p.UserID,
	)
	if err := row.Scan(&p.UpdatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound("birth profile")
		}
		return nil, fmt.Errorf("profileRepo.Update: %w", err)
	}

	return p, nil
}

func (r *PostgresProfileRepository) Delete(ctx context.Context, id uuid.UUID) error {
	const query = `DELETE FROM birth_profiles WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("profileRepo.Delete: %w", err)
	}

	affected, _ := result.RowsAffected()
	if affected == 0 {
		return domain.ErrNotFound("birth profile")
	}

	return nil
}

func mapProfileRecord(rec *profileRecord) *domain.BirthProfile {
	// pgx returns TIME without time zone as string (e.g. "08:45:00")
	t, _ := time.Parse("15:04:05", rec.BirthTime)

	return &domain.BirthProfile{
		ID:     rec.ID,
		UserID: rec.UserID,
		Name:   rec.Name,
		BirthTime: domain.BirthTime{
			Date:     rec.BirthDate,
			Time:     t,
			Timezone: rec.Timezone,
		},
		Location: domain.Location{
			Latitude:  rec.Latitude,
			Longitude: rec.Longitude,
			City:      rec.City,
		},
		CreatedAt: rec.CreatedAt,
		UpdatedAt: rec.UpdatedAt,
	}
}
