package astrology

import (
	domain "github.com/zodiac/backend/internal/domain/astrology"
)

// houseService computes Placidus (or any SE-supported) house cusps and the
// four primary chart angles, then annotates each planet with its house number.
type houseService struct {
	ephe domain.EphemerisPort
}

// newHouseService constructs a houseService with the given ephemeris adapter.
func newHouseService(ephe domain.EphemerisPort) *houseService {
	return &houseService{ephe: ephe}
}

// houseResult bundles the outputs of a full house calculation.
type houseResult struct {
	Houses [12]domain.HouseCusp
	Angles domain.ChartAngles
	// rawCusps is retained so planet placement can use it without re-querying SE.
	rawCusps [13]float64
}

// calc computes house cusps and chart angles for the given location and time.
func (s *houseService) calc(
	julianDayUT float64,
	latitude float64,
	longitude float64,
	system domain.HouseSystem,
) (*houseResult, error) {
	cusps, ascmc, err := s.ephe.CalcHouses(julianDayUT, latitude, longitude, system)
	if err != nil {
		return nil, err
	}

	// ascmc[0] = Ascendant, ascmc[1] = MC
	asc := cusps[1]  // House 1 cusp IS the Ascendant for Placidus
	mc := ascmc[1]   // Midheaven

	angles := domain.ChartAngles{
		Ascendant:  asc,
		Midheaven:  mc,
		Descendant: domain.NormalizeLongitude(asc + 180.0),
		IC:         domain.NormalizeLongitude(mc + 180.0),
	}

	var houses [12]domain.HouseCusp
	for i := 1; i <= 12; i++ {
		lon := cusps[i]
		houses[i-1] = domain.HouseCusp{
			Number:    i,
			Longitude: lon,
			Sign:      domain.SignFromLongitude(lon),
		}
	}

	return &houseResult{
		Houses:   houses,
		Angles:   angles,
		rawCusps: cusps,
	}, nil
}

// assignHouses annotates each PlanetPosition with the house (1–12) it falls in,
// derived from the computed house cusp longitudes.
func assignHouses(positions []domain.PlanetPosition, rawCusps [13]float64) []domain.PlanetPosition {
	for i := range positions {
		positions[i].HouseNumber = housePosFromCusps(positions[i].Longitude, rawCusps)
	}
	return positions
}

// housePosFromCusps determines which house (1–12) a given ecliptic longitude
// falls into, given the 1-indexed cusp array from Swiss Ephemeris.
//
// The algorithm accounts for the wrap-around at 0°/360° that can occur when
// a cusp is near Pisces/Aries. Each cusp arc is checked using modular arithmetic.
func housePosFromCusps(longitude float64, cusps [13]float64) int {
	lon := domain.NormalizeLongitude(longitude)

	for h := 1; h <= 12; h++ {
		next := h%12 + 1
		start := domain.NormalizeLongitude(cusps[h])
		end := domain.NormalizeLongitude(cusps[next])

		if inArc(lon, start, end) {
			return h
		}
	}

	// Fallback: return house 1 if no arc matched (edge case at exact cusp boundary).
	return 1
}

// inArc reports whether lon lies within the arc [start, end), accounting
// for the case where the arc wraps through 0°.
func inArc(lon, start, end float64) bool {
	if start <= end {
		return lon >= start && lon < end
	}
	// Arc wraps around 0° (e.g. start=350°, end=20°)
	return lon >= start || lon < end
}
