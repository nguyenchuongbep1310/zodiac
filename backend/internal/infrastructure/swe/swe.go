package swe

/*
#cgo LDFLAGS: -L${SRCDIR}/../../../ -lswe
*/
import "C"

import (
	"fmt"

	"github.com/mshafiee/swephgo"
	"github.com/zodiac/backend/internal/domain/astrology"
)

// SweAdapter implements astrology.EphemerisPort using the Swiss Ephemeris C library.
type SweAdapter struct{}

// Compile-time assertion that SweAdapter satisfies EphemerisPort.
var _ astrology.EphemerisPort = (*SweAdapter)(nil)

// NewSweAdapter creates a new SweAdapter and sets the ephemeris data path.
func NewSweAdapter(ephePath string) *SweAdapter {
	a := &SweAdapter{}
	a.SetEphePath(ephePath)
	return a
}

// SetEphePath configures the directory containing the data files.
func (a *SweAdapter) SetEphePath(path string) {
	if path != "" {
		swephgo.SetEphePath([]byte(path))
	}
}

// CalcPlanet computes the ecliptic position and speed of a celestial body.
func (a *SweAdapter) CalcPlanet(julianDayUT float64, planet astrology.Planet) ([6]float64, error) {
	var results [6]float64
	if julianDayUT == 0 {
		return results, fmt.Errorf("invalid julian day")
	}

	x2 := make([]float64, 6)
	serr := make([]byte, 256)

	// Flags: Swiss Ephemeris algorithm (most accurate, uses .se1 files) + calculate speed
	flags := swephgo.SeflgSwieph | swephgo.SeflgSpeed

	// The `planet` cast matches SE_SUN, SE_MOON, etc. directly.
	ret := swephgo.CalcUt(julianDayUT, int(planet), flags, x2, serr)
	if ret < 0 {
		return results, fmt.Errorf("swiss ephemeris error: %s", string(serr))
	}

	copy(results[:], x2)
	return results, nil
}

// CalcHouses computes house cusps and primary angles.
func (a *SweAdapter) CalcHouses(
	julianDayUT float64,
	latitude float64,
	longitude float64,
	system astrology.HouseSystem,
) ([13]float64, [10]float64, error) {
	var cusps [13]float64
	var ascmc [10]float64

	cuspsSlice := make([]float64, 13)
	ascmcSlice := make([]float64, 10)

	ret := swephgo.Houses(julianDayUT, latitude, longitude, int(system), cuspsSlice, ascmcSlice)
	if ret < 0 {
		return cusps, ascmc, fmt.Errorf("swiss ephemeris house calculation failed")
	}

	copy(cusps[:], cuspsSlice)
	copy(ascmc[:], ascmcSlice)

	return cusps, ascmc, nil
}

// Close releases all resources.
func (a *SweAdapter) Close() {
	swephgo.Close()
}
