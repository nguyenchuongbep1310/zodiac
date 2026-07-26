package domain

import (
	"time"

	"github.com/google/uuid"
)

// FactorType classifies what kind of astrological factor an interpretation describes.
type FactorType string

const (
	FactorPlanetInSign  FactorType = "planet_in_sign"
	FactorPlanetInHouse FactorType = "planet_in_house"
	FactorHouseInSign   FactorType = "house_in_sign"
	FactorAspect        FactorType = "aspect"
)

// SupportedLanguages lists all language codes that have seeded content.
var SupportedLanguages = []string{"en", "vi"}

// DefaultLanguage is the fallback when a requested language has no content.
const DefaultLanguage = "en"

// Trait represents a single psychological trait from the traits_library.
type Trait struct {
	ID          uuid.UUID
	Language    string
	Name        string
	Category    string
	Polarity    int
	Description string
}

// PlacementInterpretation is the domain entity representing a structured interpretation.
// Lookup key = (language, factor_type, factor_value_1, factor_value_2, factor_value_3).
type PlacementInterpretation struct {
	ID            uuid.UUID
	Language      string      // BCP-47 short code: "en" | "vi"
	FactorType    FactorType
	FactorValue1  string      // planet name
	FactorValue2  string      // sign / house number / second planet
	FactorValue3  *string     // aspect type (nil for planet_in_sign / planet_in_house)
	
	CoreMeaning   string
	RealLife      string
	Strengths     string
	Challenges    string
	Relationships string
	GrowthPath    string
	KeyThemes     []string
	
	Traits        []TraitWeight // Loaded by the Trait Engine
	
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type TraitWeight struct {
	Trait  Trait
	Weight int
}

// ConflictRule represents an internal tension between two traits.
type ConflictRule struct {
	ID                 uuid.UUID
	Language           string
	TraitID1           uuid.UUID
	TraitID2           uuid.UUID
	TensionDescription string
}

// ── Grouped output types used by the service layer ────────────────────────────

// PlanetInSignInterpretation wraps an PlacementInterpretation for a specific
// planet-in-sign combination, with the original chart context attached.
type PlanetInSignInterpretation struct {
	Planet   string
	Sign     string
	Template *PlacementInterpretation
}

// PlanetInHouseInterpretation wraps an PlacementInterpretation for a planet-in-house
// combination with house number context.
type PlanetInHouseInterpretation struct {
	Planet      string
	HouseNumber int
	Template    *PlacementInterpretation
}

// AspectInterpretation wraps an PlacementInterpretation for a specific aspect,
// including the orb and applying/separating status from the natal chart.
type AspectInterpretation struct {
	Planet1    string
	Planet2    string
	AspectType string
	Orb        float64
	IsApplying bool
	Template   *PlacementInterpretation // nil when no template found
}

type HouseInSignInterpretation struct {
	HouseNumber int
	Sign        string
	Template    *PlacementInterpretation
}

// ChartInterpretation is the aggregate returned by InterpretationService.
// It groups all three interpretation kinds for a single chart + language.
type ChartInterpretation struct {
	ChartID  uuid.UUID
	Language string

	PlanetInSign  []PlanetInSignInterpretation
	PlanetInHouse []PlanetInHouseInterpretation
	HouseInSign   []HouseInSignInterpretation
	Aspects       []AspectInterpretation
}

// ── LookupFactor is the key used for batch repository queries ─────────────────

// LookupFactor represents a single interpretation lookup request.
// The repository accepts a slice of these and returns a map keyed by their
// canonical string representation.
type LookupFactor struct {
	FactorType   FactorType
	FactorValue1 string
	FactorValue2 string
	FactorValue3 *string // nil for planet_in_sign / planet_in_house
}

// Key returns a deterministic string key for map lookups.
func (f LookupFactor) Key() string {
	v3 := ""
	if f.FactorValue3 != nil {
		v3 = *f.FactorValue3
	}
	return string(f.FactorType) + "|" + f.FactorValue1 + "|" + f.FactorValue2 + "|" + v3
}
