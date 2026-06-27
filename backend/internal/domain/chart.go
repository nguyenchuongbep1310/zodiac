package domain

import (
	"time"

	"github.com/google/uuid"
)

// AspectType represents a named angular relationship between two planets.
type AspectType string

const (
	AspectConjunction AspectType = "conjunction" // 0°
	AspectSextile     AspectType = "sextile"     // 60°
	AspectSquare      AspectType = "square"      // 90°
	AspectTrine       AspectType = "trine"       // 120°
	AspectOpposition  AspectType = "opposition"  // 180°
)

// PlanetPosition is an entity representing a single planet's ecliptic position.
type PlanetPosition struct {
	ID           uuid.UUID
	ChartID      uuid.UUID
	PlanetName   string
	Longitude    float64 // Ecliptic longitude in degrees (0-360)
	Latitude     float64 // Ecliptic latitude in degrees
	Speed        float64 // Daily motion in degrees (negative = retrograde)
	IsRetrograde bool
	Sign         string
	HousePosition int
}

// HouseCusp is an entity representing a house cusp in the natal chart.
type HouseCusp struct {
	ID           uuid.UUID
	ChartID      uuid.UUID
	HouseNumber  int // 1-12
	CuspLongitude float64
	Sign         string
}

// Aspect is a value object representing a mathematical angular relationship
// between two planets. Enforce planet1 < planet2 alphabetically to avoid duplicates.
type Aspect struct {
	ID         uuid.UUID
	ChartID    uuid.UUID
	Planet1    string
	Planet2    string
	AspectType AspectType
	Orb        float64 // Deviation from exact angle, in degrees
	IsApplying bool    // True if the angle is closing (moving toward exact)
}

// NatalChart is the aggregate root for all astrological data generated
// from a single BirthProfile. It ties together positions, houses, and aspects.
type NatalChart struct {
	ID           uuid.UUID
	ProfileID    uuid.UUID
	HouseSystem  string
	ZodiacSystem string
	IsRectified  bool
	Planets      []PlanetPosition
	Houses       []HouseCusp
	Aspects      []Aspect
	CreatedAt    time.Time
}
