package astrology

import "time"

// HouseSystem identifies the mathematical method used to divide the ecliptic into 12 houses.
// Values are ASCII codes of the characters used by Swiss Ephemeris.
type HouseSystem byte

const (
	HousePlacidus  HouseSystem = 'P' // Placidus — most widely used
	HouseKoch      HouseSystem = 'K'
	HouseWholeSign HouseSystem = 'W'
	HouseEqual     HouseSystem = 'E'
)

// ChartInput holds all data required to produce a natal chart.
type ChartInput struct {
	// BirthTime must be in UTC. The caller is responsible for conversion.
	BirthTime   time.Time
	Latitude    float64     // Geographic latitude in decimal degrees (+north/-south)
	Longitude   float64     // Geographic longitude in decimal degrees (+east/-west)
	HouseSystem HouseSystem // House division method
	EphePath    string      // Absolute path to the Swiss Ephemeris .se1 data files
}

// HouseCusp holds a computed house cusp longitude.
type HouseCusp struct {
	Number    int        // 1–12
	Longitude float64    // Ecliptic longitude of the cusp
	Sign      ZodiacSign // Sign of the cusp
}

// ChartAngles holds the four primary chart angles derived from the house calculation.
type ChartAngles struct {
	Ascendant  float64 // 1st house cusp — eastern horizon
	Midheaven  float64 // MC — culmination point (10th house cusp)
	Descendant float64 // 7th house cusp — western horizon (Asc + 180°)
	IC         float64 // Imum Coeli — nadir (MC + 180°)
}

// ChartOutput is the complete result of a natal chart calculation.
type ChartOutput struct {
	Input     ChartInput
	JulianDay float64 // Julian Day UT used for calculation
	Planets   []PlanetPosition
	Houses    []HouseCusp // 12 house cusps
	Angles    ChartAngles
	Aspects   []Aspect
}

// ─── Ports (interfaces) ──────────────────────────────────────────────────────

// EphemerisPort is the outbound port for raw astronomical position data.
// The Swiss Ephemeris adapter implements this interface.
type EphemerisPort interface {
	// SetEphePath configures the directory containing the .se1 ephemeris data files.
	// Must be called before any calculation.
	SetEphePath(path string)

	// CalcPlanet returns raw position data for a celestial body at a given Julian Day UT.
	// Returned array indices:
	//   [0] ecliptic longitude (°)
	//   [1] ecliptic latitude (°)
	//   [2] distance (AU)
	//   [3] speed in longitude (°/day; negative = retrograde)
	//   [4] speed in latitude (°/day)
	//   [5] speed in distance (AU/day)
	CalcPlanet(julianDayUT float64, planet Planet) ([6]float64, error)

	// CalcHouses returns house cusps and primary angles for a location.
	//
	//   cusps[1..12] — ecliptic longitude of each house cusp (index 0 unused)
	//   ascmc[0]     — Ascendant
	//   ascmc[1]     — Midheaven (MC)
	//   ascmc[2]     — ARMC (sidereal time of MC in degrees)
	//   ascmc[3]     — Vertex
	CalcHouses(
		julianDayUT float64,
		latitude float64,
		longitude float64,
		system HouseSystem,
	) (cusps [13]float64, ascmc [10]float64, err error)

	// Close releases any resources held by the underlying C library.
	Close()
}

// ChartCalculator is the inbound port for natal chart computation.
// The NatalChartCalculator service implements this interface.
type ChartCalculator interface {
	Calculate(input ChartInput) (*ChartOutput, error)
}
