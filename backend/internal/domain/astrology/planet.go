package astrology

// Planet represents a Swiss Ephemeris celestial body identifier.
// Values match SE planet constants defined in swephexp.h.
type Planet int

const (
	PlanetSun     Planet = 0
	PlanetMoon    Planet = 1
	PlanetMercury Planet = 2
	PlanetVenus   Planet = 3
	PlanetMars    Planet = 4
	PlanetJupiter Planet = 5
	PlanetSaturn  Planet = 6
	PlanetUranus  Planet = 7
	PlanetNeptune Planet = 8
	PlanetPluto   Planet = 9
	PlanetNNode   Planet = 11 // SE_TRUE_NODE — more accurate than mean node
	PlanetChiron  Planet = 15 // SE_CHIRON
)

var planetNames = map[Planet]string{
	PlanetSun:     "Sun",
	PlanetMoon:    "Moon",
	PlanetMercury: "Mercury",
	PlanetVenus:   "Venus",
	PlanetMars:    "Mars",
	PlanetJupiter: "Jupiter",
	PlanetSaturn:  "Saturn",
	PlanetUranus:  "Uranus",
	PlanetNeptune: "Neptune",
	PlanetPluto:   "Pluto",
	PlanetNNode:   "North Node",
	PlanetChiron:  "Chiron",
}

// Name returns the human-readable name for the planet.
func (p Planet) Name() string {
	if name, ok := planetNames[p]; ok {
		return name
	}
	return "Unknown"
}

func (p Planet) String() string { return p.Name() }

// AllPlanets returns the ordered set of planets included in a standard natal chart.
func AllPlanets() []Planet {
	return []Planet{
		PlanetSun, PlanetMoon, PlanetMercury, PlanetVenus,
		PlanetMars, PlanetJupiter, PlanetSaturn, PlanetUranus,
		PlanetNeptune, PlanetPluto, PlanetNNode, PlanetChiron,
	}
}

// PlanetPosition is the fully resolved position of a planet within a natal chart.
type PlanetPosition struct {
	Planet       Planet
	Longitude    float64    // Ecliptic longitude 0–360°
	Latitude     float64    // Ecliptic latitude (+ north, - south)
	Distance     float64    // Distance from Earth in AU
	Speed        float64    // Daily motion in longitude (degrees/day; negative = retrograde)
	IsRetrograde bool       // True when Speed < 0
	Sign         ZodiacSign // Zodiac sign derived from Longitude
	DegreeInSign float64    // Exact degree within the sign (0–30°)
	HouseNumber  int        // House placement (1–12)
}
