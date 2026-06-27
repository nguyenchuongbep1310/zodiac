package astrology_test

import (
	"testing"
	"time"

	"github.com/zodiac/backend/internal/astrology"
	domain "github.com/zodiac/backend/internal/domain/astrology"
)

// ─── Mock Ephemeris ───────────────────────────────────────────────────────────

// mockEphemeris implements domain.EphemerisPort with synthetic, deterministic data.
// It simulates a chart where:
//   - Sun  at  91° (Cancer), speed +1.0°/day
//   - Moon at 181° (Libra),  speed +13.5°/day
//   - Mercury at 93° (Cancer), speed +1.5°/day
//   - All other planets at predictable positions
//   - Ascendant at 0° (Aries), MC at 270° (Capricorn)
//   - Equal houses at 30° intervals
type mockEphemeris struct {
	positions map[domain.Planet][6]float64 // planet → [lon,lat,dist,speedLon,speedLat,speedDist]
	cusps     [13]float64
	ascmc     [10]float64
}

func newMockEphemeris() *mockEphemeris {
	m := &mockEphemeris{
		positions: map[domain.Planet][6]float64{
			domain.PlanetSun:     {91.0, 0.0, 1.0, 1.0, 0.0, 0.0},
			domain.PlanetMoon:    {181.0, 0.0, 0.0025, 13.5, 0.0, 0.0},
			domain.PlanetMercury: {93.0, 0.5, 0.9, 1.5, 0.0, 0.0},
			domain.PlanetVenus:   {45.0, -1.0, 0.72, 1.2, 0.0, 0.0},
			domain.PlanetMars:    {271.0, 0.0, 1.5, 0.5, 0.0, 0.0},
			domain.PlanetJupiter: {30.0, 0.0, 5.2, 0.08, 0.0, 0.0},
			domain.PlanetSaturn:  {240.0, 0.0, 9.5, -0.03, 0.0, 0.0}, // retrograde
			domain.PlanetUranus:  {15.0, 0.0, 19.2, 0.01, 0.0, 0.0},
			domain.PlanetNeptune: {330.0, 0.0, 30.0, 0.005, 0.0, 0.0},
			domain.PlanetPluto:   {270.0, 0.0, 40.0, -0.002, 0.0, 0.0}, // retrograde
			domain.PlanetNNode:   {120.0, 0.0, 0.0, -0.05, 0.0, 0.0},  // always retrograde
			domain.PlanetChiron:  {200.0, 0.0, 14.0, 0.02, 0.0, 0.0},
		},
	}

	// Equal houses: 0°, 30°, 60°, ... (index 0 unused per SE convention)
	for i := 1; i <= 12; i++ {
		m.cusps[i] = float64((i - 1) * 30)
	}
	m.ascmc[0] = 0.0   // Ascendant = Aries 0°
	m.ascmc[1] = 270.0 // MC = Capricorn 0°

	return m
}

func (m *mockEphemeris) SetEphePath(_ string)  {}
func (m *mockEphemeris) Close()                {}

func (m *mockEphemeris) CalcPlanet(_ float64, p domain.Planet) ([6]float64, error) {
	if data, ok := m.positions[p]; ok {
		return data, nil
	}
	return [6]float64{}, nil
}

func (m *mockEphemeris) CalcHouses(_, _, _ float64, _ domain.HouseSystem) ([13]float64, [10]float64, error) {
	return m.cusps, m.ascmc, nil
}

// ─── Calculator Integration Tests ────────────────────────────────────────────

func testCalculator() domain.ChartCalculator {
	return astrology.NewNatalChartCalculatorWithEphe(newMockEphemeris())
}

func testInput() domain.ChartInput {
	return domain.ChartInput{
		BirthTime:   time.Date(1990, 6, 15, 12, 0, 0, 0, time.UTC),
		Latitude:    48.8566,  // Paris
		Longitude:   2.3522,
		HouseSystem: domain.HousePlacidus,
		EphePath:    "/mock/ephe",
	}
}

func TestCalculate_ReturnsPlanets(t *testing.T) {
	chart, err := testCalculator().Calculate(testInput())
	if err != nil {
		t.Fatalf("Calculate failed: %v", err)
	}

	if len(chart.Planets) != len(domain.AllPlanets()) {
		t.Errorf("got %d planets, want %d", len(chart.Planets), len(domain.AllPlanets()))
	}
}

func TestCalculate_SunPosition(t *testing.T) {
	chart, err := testCalculator().Calculate(testInput())
	if err != nil {
		t.Fatal(err)
	}

	sun := findPlanet(t, chart.Planets, domain.PlanetSun)
	if !approxEqual(sun.Longitude, 91.0, 0.001) {
		t.Errorf("Sun longitude = %f, want 91.0", sun.Longitude)
	}
	if sun.Sign != domain.Cancer {
		t.Errorf("Sun sign = %v, want Cancer", sun.Sign)
	}
	if sun.IsRetrograde {
		t.Error("Sun should not be retrograde")
	}
	if sun.HouseNumber != 4 {
		t.Errorf("Sun house = %d, want 4 (cusps at 0,30,60,90... so 91° = H4)", sun.HouseNumber)
	}
}

func TestCalculate_SaturnRetrograde(t *testing.T) {
	chart, err := testCalculator().Calculate(testInput())
	if err != nil {
		t.Fatal(err)
	}

	saturn := findPlanet(t, chart.Planets, domain.PlanetSaturn)
	if !saturn.IsRetrograde {
		t.Error("Saturn (speed=-0.03) should be retrograde")
	}
}

func TestCalculate_MoonSign(t *testing.T) {
	chart, err := testCalculator().Calculate(testInput())
	if err != nil {
		t.Fatal(err)
	}

	moon := findPlanet(t, chart.Planets, domain.PlanetMoon)
	if moon.Sign != domain.Libra {
		t.Errorf("Moon sign = %v, want Libra (lon=181°)", moon.Sign)
	}
}

func TestCalculate_Houses(t *testing.T) {
	chart, err := testCalculator().Calculate(testInput())
	if err != nil {
		t.Fatal(err)
	}

	if len(chart.Houses) != 12 {
		t.Errorf("got %d houses, want 12", len(chart.Houses))
	}

	// Equal houses: house 1 cusp = 0°, house 7 cusp = 180°.
	if !approxEqual(chart.Houses[0].Longitude, 0.0, 0.001) {
		t.Errorf("house 1 cusp = %f, want 0.0", chart.Houses[0].Longitude)
	}
	if !approxEqual(chart.Houses[6].Longitude, 180.0, 0.001) {
		t.Errorf("house 7 cusp = %f, want 180.0", chart.Houses[6].Longitude)
	}
}

func TestCalculate_ChartAngles(t *testing.T) {
	chart, err := testCalculator().Calculate(testInput())
	if err != nil {
		t.Fatal(err)
	}

	if !approxEqual(chart.Angles.Ascendant, 0.0, 0.001) {
		t.Errorf("Ascendant = %f, want 0.0", chart.Angles.Ascendant)
	}
	if !approxEqual(chart.Angles.Midheaven, 270.0, 0.001) {
		t.Errorf("Midheaven = %f, want 270.0", chart.Angles.Midheaven)
	}
	if !approxEqual(chart.Angles.Descendant, 180.0, 0.001) {
		t.Errorf("Descendant = %f, want 180.0", chart.Angles.Descendant)
	}
	if !approxEqual(chart.Angles.IC, 90.0, 0.001) {
		t.Errorf("IC = %f, want 90.0", chart.Angles.IC)
	}
}

func TestCalculate_KeyAspects(t *testing.T) {
	chart, err := testCalculator().Calculate(testInput())
	if err != nil {
		t.Fatal(err)
	}

	// Sun at 91°, Moon at 181° → separation = 90° → Square (within 7° orb)
	assertAspect(t, chart.Aspects, domain.PlanetSun, domain.PlanetMoon, domain.Square)

	// Sun at 91°, Mercury at 93° → separation = 2° → Conjunction (within 8° orb)
	assertAspect(t, chart.Aspects, domain.PlanetSun, domain.PlanetMercury, domain.Conjunction)

	// Sun at 91°, Mars at 271° → separation = 180° → Opposition (within 8° orb)
	assertAspect(t, chart.Aspects, domain.PlanetSun, domain.PlanetMars, domain.Opposition)
}

func TestCalculate_InvalidInput_ReturnsError(t *testing.T) {
	calc := testCalculator()

	t.Run("zero birth time", func(t *testing.T) {
		input := testInput()
		input.BirthTime = time.Time{}
		_, err := calc.Calculate(input)
		if err == nil {
			t.Error("expected error for zero birth time")
		}
	})

	t.Run("invalid latitude", func(t *testing.T) {
		input := testInput()
		input.Latitude = 95.0
		_, err := calc.Calculate(input)
		if err == nil {
			t.Error("expected error for latitude > 90")
		}
	})

	t.Run("missing ephe path", func(t *testing.T) {
		input := testInput()
		input.EphePath = ""
		_, err := calc.Calculate(input)
		if err == nil {
			t.Error("expected error for empty EphePath")
		}
	})
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

func findPlanet(t *testing.T, planets []domain.PlanetPosition, p domain.Planet) domain.PlanetPosition {
	t.Helper()
	for _, pos := range planets {
		if pos.Planet == p {
			return pos
		}
	}
	t.Fatalf("planet %s not found in chart", p.Name())
	return domain.PlanetPosition{}
}

func assertAspect(t *testing.T, aspects []domain.Aspect, p1, p2 domain.Planet, wantType domain.AspectType) {
	t.Helper()
	for _, a := range aspects {
		if (a.Planet1 == p1 && a.Planet2 == p2) || (a.Planet1 == p2 && a.Planet2 == p1) {
			if a.Type == wantType {
				return
			}
		}
	}
	t.Errorf("expected %s aspect between %s and %s, not found", wantType, p1.Name(), p2.Name())
}
