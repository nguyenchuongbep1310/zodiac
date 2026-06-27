package astrology

import (
	"fmt"

	domain "github.com/zodiac/backend/internal/domain/astrology"
	"github.com/zodiac/backend/internal/infrastructure/swe"
)

// NatalChartCalculator implements domain.ChartCalculator.
// It orchestrates the planet, house, and aspect calculation pipeline.
type NatalChartCalculator struct {
	ephe         domain.EphemerisPort
	planetSvc    *planetService
	houseSvc     *houseService
	aspectEngine *AspectEngine
}

// Compile-time assertion that NatalChartCalculator satisfies ChartCalculator.
var _ domain.ChartCalculator = (*NatalChartCalculator)(nil)

// NewNatalChartCalculator constructs the calculator with a live Swiss Ephemeris adapter.
// ephePath is the directory containing .se1 data files.
func NewNatalChartCalculator(ephePath string) *NatalChartCalculator {
	adapter := swe.NewSweAdapter(ephePath)
	return newWithEphemeris(adapter)
}

// NewNatalChartCalculatorWithEphe constructs the calculator with the provided
// EphemerisPort. Use this in tests to inject a mock without CGO.
func NewNatalChartCalculatorWithEphe(ephe domain.EphemerisPort) *NatalChartCalculator {
	return newWithEphemeris(ephe)
}

// newWithEphemeris constructs the calculator with any EphemerisPort implementation.
func newWithEphemeris(ephe domain.EphemerisPort) *NatalChartCalculator {
	return &NatalChartCalculator{
		ephe:         ephe,
		planetSvc:    newPlanetService(ephe),
		houseSvc:     newHouseService(ephe),
		aspectEngine: NewAspectEngine(domain.StandardAspects),
	}
}

// Calculate produces a full natal chart for the given birth data.
//
// Calculation pipeline:
//  1. Convert birth time → Julian Day UT
//  2. Compute all planet positions (longitude, latitude, speed, retrograde)
//  3. Compute Placidus house cusps, Ascendant, and Midheaven
//  4. Assign each planet to its house
//  5. Detect aspects between all planet pairs
func (c *NatalChartCalculator) Calculate(input domain.ChartInput) (*domain.ChartOutput, error) {
	if err := validateInput(input); err != nil {
		return nil, fmt.Errorf("chart calculation: %w", err)
	}

	// Configure ephemeris data path (idempotent call).
	c.ephe.SetEphePath(input.EphePath)

	// Step 1: Julian Day
	jd := swe.JulianDayUT(input.BirthTime)

	// Step 2: Planet positions
	planets, err := c.planetSvc.calcAll(jd)
	if err != nil {
		return nil, fmt.Errorf("planet calculation: %w", err)
	}

	// Step 3: Houses, Ascendant, Midheaven
	houses, err := c.houseSvc.calc(jd, input.Latitude, input.Longitude, input.HouseSystem)
	if err != nil {
		return nil, fmt.Errorf("house calculation: %w", err)
	}

	// Step 4: House assignment per planet
	planets = assignHouses(planets, houses.rawCusps)

	// Step 5: Aspect detection
	aspects := c.aspectEngine.Calc(planets)

	// Build the 12-element house slice for the output.
	houseCusps := make([]domain.HouseCusp, 12)
	for i, h := range houses.Houses {
		houseCusps[i] = h
	}

	return &domain.ChartOutput{
		Input:     input,
		JulianDay: jd,
		Planets:   planets,
		Houses:    houseCusps,
		Angles:    houses.Angles,
		Aspects:   aspects,
	}, nil
}

// validateInput checks that the ChartInput contains coherent values before
// making any ephemeris calls.
func validateInput(input domain.ChartInput) error {
	if input.BirthTime.IsZero() {
		return fmt.Errorf("birth time is required")
	}
	if input.Latitude < -90 || input.Latitude > 90 {
		return fmt.Errorf("latitude %f is out of range [-90, 90]", input.Latitude)
	}
	if input.Longitude < -180 || input.Longitude > 180 {
		return fmt.Errorf("longitude %f is out of range [-180, 180]", input.Longitude)
	}
	if input.EphePath == "" {
		return fmt.Errorf("ephemeris path is required")
	}
	return nil
}
