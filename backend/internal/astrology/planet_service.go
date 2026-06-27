package astrology

import (
	"fmt"

	domain "github.com/zodiac/backend/internal/domain/astrology"
)

// planetService resolves raw ephemeris data into fully annotated PlanetPosition values.
type planetService struct {
	ephe domain.EphemerisPort
}

// newPlanetService constructs a planetService with the given ephemeris adapter.
func newPlanetService(ephe domain.EphemerisPort) *planetService {
	return &planetService{ephe: ephe}
}

// calcAll calculates positions for every planet in AllPlanets() at the given Julian Day.
// House placement (HouseNumber) is set to 0 here; it is resolved later by the
// houseService after house cusps are known.
func (s *planetService) calcAll(julianDayUT float64) ([]domain.PlanetPosition, error) {
	planets := domain.AllPlanets()
	positions := make([]domain.PlanetPosition, 0, len(planets))

	for _, p := range planets {
		pos, err := s.calcOne(julianDayUT, p)
		if err != nil {
			return nil, fmt.Errorf("planet %s: %w", p.Name(), err)
		}
		positions = append(positions, pos)
	}

	return positions, nil
}

// calcOne calculates and resolves a single planet's position.
func (s *planetService) calcOne(julianDayUT float64, p domain.Planet) (domain.PlanetPosition, error) {
	// raw[0]=lon, [1]=lat, [2]=dist, [3]=speedLon, [4]=speedLat, [5]=speedDist
	raw, err := s.ephe.CalcPlanet(julianDayUT, p)
	if err != nil {
		return domain.PlanetPosition{}, err
	}

	lon := raw[0]
	lat := raw[1]
	dist := raw[2]
	speedLon := raw[3]

	return domain.PlanetPosition{
		Planet:       p,
		Longitude:    lon,
		Latitude:     lat,
		Distance:     dist,
		Speed:        speedLon,
		IsRetrograde: isRetrograde(speedLon),
		Sign:         domain.SignFromLongitude(lon),
		DegreeInSign: domain.DegreeInSign(lon),
		HouseNumber:  0, // resolved after house calculation
	}, nil
}

// isRetrograde reports whether a planet is in retrograde motion.
// A negative daily speed in longitude indicates retrograde.
// The Moon and Sun never retrograde, but we keep the logic consistent.
func isRetrograde(speedLon float64) bool {
	return speedLon < 0
}
