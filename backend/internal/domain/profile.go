package domain

import (
	"time"

	"github.com/google/uuid"
)

// Location is a value object representing a geographic coordinate pair.
type Location struct {
	Latitude  float64
	Longitude float64
	City      string
}

// BirthTime is a value object representing a complete point in time with timezone awareness.
type BirthTime struct {
	Date     time.Time // UTC-normalized date
	Time     time.Time // UTC-normalized time-of-day
	Timezone string    // IANA timezone, e.g. "America/New_York"
}

// BirthProfile is the aggregate root for astrological subject data.
// It is owned by a User and is the source of truth for all chart calculations.
type BirthProfile struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	Name      string
	BirthTime BirthTime
	Location  Location
	CreatedAt time.Time
	UpdatedAt time.Time
}
