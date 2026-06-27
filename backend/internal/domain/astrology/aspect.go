package astrology

import "math"

// AspectType identifies a named angular relationship between two planets.
type AspectType string

const (
	Conjunction AspectType = "conjunction"  // 0°
	SemiSextile AspectType = "semi-sextile" // 30°
	SemiSquare  AspectType = "semi-square"  // 45°
	Sextile     AspectType = "sextile"      // 60°
	Square      AspectType = "square"       // 90°
	Trine       AspectType = "trine"        // 120°
	Quincunx    AspectType = "quincunx"     // 150°
	Opposition  AspectType = "opposition"   // 180°
)

// AspectDefinition pairs an aspect type with its exact angle and maximum orb.
// The orb represents the maximum allowed deviation from the exact angle for
// an aspect to be considered valid.
type AspectDefinition struct {
	Type  AspectType
	Angle float64 // Exact aspect angle in degrees
	Orb   float64 // Maximum allowed orb in degrees
}

// StandardAspects is the ordered set of aspects used in natal chart interpretation.
// Major aspects have wider orbs; minor aspects are tighter.
var StandardAspects = []AspectDefinition{
	{Conjunction, 0.0, 8.0},
	{Opposition, 180.0, 8.0},
	{Trine, 120.0, 7.0},
	{Square, 90.0, 7.0},
	{Sextile, 60.0, 5.0},
	{Quincunx, 150.0, 3.0},
	{SemiSquare, 45.0, 2.0},
	{SemiSextile, 30.0, 2.0},
}

// Aspect is the fully resolved angular relationship between two planets
// in a natal chart.
type Aspect struct {
	Planet1    Planet
	Planet2    Planet
	Type       AspectType
	ExactAngle float64 // The aspect's defining angle (e.g. 90° for a square)
	Orb        float64 // Actual deviation from exact (always >= 0)
	IsApplying bool    // True if planets are moving toward exact aspect
}

// AngularSeparation returns the shortest arc between two ecliptic longitudes.
// The result is always in [0°, 180°].
func AngularSeparation(lon1, lon2 float64) float64 {
	diff := math.Abs(NormalizeLongitude(lon1) - NormalizeLongitude(lon2))
	if diff > 180.0 {
		diff = 360.0 - diff
	}
	return diff
}
