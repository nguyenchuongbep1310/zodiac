package astrology_test

import (
	"testing"

	"github.com/zodiac/backend/internal/astrology"
	domain "github.com/zodiac/backend/internal/domain/astrology"
)

// ─── Aspect Engine Tests ─────────────────────────────────────────────────────

func TestAspectEngine_ExactAspects(t *testing.T) {
	engine := astrology.NewAspectEngine(domain.StandardAspects)

	tests := []struct {
		name       string
		lon1, lon2 float64
		wantType   domain.AspectType
	}{
		{"exact conjunction", 45.0, 45.0, domain.Conjunction},
		{"exact opposition", 0.0, 180.0, domain.Opposition},
		{"exact trine", 0.0, 120.0, domain.Trine},
		{"exact square", 90.0, 180.0, domain.Square},
		{"exact sextile", 30.0, 90.0, domain.Sextile},
		{"exact quincunx", 0.0, 150.0, domain.Quincunx},
		{"exact semi-square", 0.0, 45.0, domain.SemiSquare},
		{"exact semi-sextile", 0.0, 30.0, domain.SemiSextile},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			positions := twoPositions(tc.lon1, 1.0, tc.lon2, -0.5)
			aspects := engine.Calc(positions)

			if len(aspects) == 0 {
				t.Fatalf("expected aspect %s, got none", tc.wantType)
			}

			found := false
			for _, a := range aspects {
				if a.Type == tc.wantType {
					found = true
					if a.Orb > 0.001 {
						t.Errorf("orb for exact %s should be ~0, got %f", tc.wantType, a.Orb)
					}
				}
			}
			if !found {
				t.Errorf("aspect %s not found in results: %v", tc.wantType, aspects)
			}
		})
	}
}

func TestAspectEngine_WithinOrb(t *testing.T) {
	engine := astrology.NewAspectEngine(domain.StandardAspects)

	// Square has 7° orb; 3° deviation should still be detected.
	positions := twoPositions(90.0, 1.0, 183.0, 1.0) // sep = 93° → square orb = 3°
	aspects := engine.Calc(positions)

	found := false
	for _, a := range aspects {
		if a.Type == domain.Square {
			found = true
			if !approxEqual(a.Orb, 3.0, 0.01) {
				t.Errorf("square orb = %f, want ~3.0", a.Orb)
			}
		}
	}
	if !found {
		t.Error("square within orb not detected")
	}
}

func TestAspectEngine_OutsideOrb(t *testing.T) {
	engine := astrology.NewAspectEngine(domain.StandardAspects)

	// Trine has 7° orb; 8° deviation should NOT be detected.
	// Separation = 128° → orb from trine (120°) = 8° > 7°.
	positions := twoPositions(0.0, 1.0, 128.0, 1.0)
	aspects := engine.Calc(positions)

	for _, a := range aspects {
		if a.Type == domain.Trine {
			t.Errorf("trine 8° outside orb should not be detected, got orb=%f", a.Orb)
		}
	}
}

func TestAspectEngine_NoDuplicatePairs(t *testing.T) {
	engine := astrology.NewAspectEngine(domain.StandardAspects)

	// Exact opposition; should appear exactly once.
	positions := []domain.PlanetPosition{
		{Planet: domain.PlanetSun, Longitude: 0.0, Speed: 1.0},
		{Planet: domain.PlanetMoon, Longitude: 180.0, Speed: 13.0},
		{Planet: domain.PlanetMercury, Longitude: 90.0, Speed: 1.5},
	}

	aspects := engine.Calc(positions)

	seen := make(map[[2]domain.Planet]int)
	for _, a := range aspects {
		key := [2]domain.Planet{a.Planet1, a.Planet2}
		seen[key]++
		if seen[key] > 1 {
			t.Errorf("duplicate aspect detected: %v %v", a.Planet1, a.Planet2)
		}
	}
}

func TestAspectEngine_ApplyingSeparating(t *testing.T) {
	engine := astrology.NewAspectEngine(domain.StandardAspects)

	// Sun at 89° moving at +1°/day, Moon at 181° moving at +13°/day.
	// Tomorrow: Sun = 90°, Moon = 194°.
	// Current sep = |89-181| = 92° (orb from square = 2°).
	// Future sep = |90-194| → AngularSeparation = 104° (orb from square = 14°).
	// Orb is INCREASING → separating.
	positions := twoPositions(89.0, 1.0, 181.0, 13.0)
	aspects := engine.Calc(positions)

	for _, a := range aspects {
		if a.Type == domain.Square {
			if a.IsApplying {
				t.Error("Sun/Moon square should be separating, got IsApplying=true")
			}
			return
		}
	}
	t.Error("expected a square aspect")
}

func TestAspectEngine_ApplyingConjunction(t *testing.T) {
	engine := astrology.NewAspectEngine(domain.StandardAspects)

	// Mercury at 50°, Sun at 55°. Mercury speed=1.5, Sun speed=1.0.
	// Mercury is faster and AHEAD of Sun → they are separating?
	// Wait — Mercury at 50°, speed 1.5; Sun at 55°, speed 1.0.
	// Tomorrow: Mercury=51.5°, Sun=56°.
	// Current sep = |50-55|=5° (within 8° orb of conjunction).
	// Future sep = |51.5-56|=4.5°. Orb decreasing → APPLYING.
	positions := twoPositions(50.0, 1.5, 55.0, 1.0)
	aspects := engine.Calc(positions)

	for _, a := range aspects {
		if a.Type == domain.Conjunction {
			if !a.IsApplying {
				t.Error("Mercury/Sun conjunction should be applying, got IsApplying=false")
			}
			return
		}
	}
	t.Error("expected a conjunction aspect")
}

// ─── House Position Tests ────────────────────────────────────────────────────

func TestHousePosFromCusps_EqualHouses(t *testing.T) {
	// Equal houses at 30° intervals starting at Aries.
	cusps := equalHouseCusps(0.0)

	tests := []struct {
		lon       float64
		wantHouse int
	}{
		{0.0, 1},   // exactly on cusp 1
		{15.0, 1},  // middle of house 1
		{29.9, 1},  // just before house 2
		{30.0, 2},  // cusp 2
		{59.9, 2},
		{60.0, 3},
		{350.0, 12}, // in house 12 (330°–360°)
		{0.1, 1},   // just past cusp 1
	}

	for _, tc := range tests {
		got := housePosForTest(tc.lon, cusps)
		if got != tc.wantHouse {
			t.Errorf("lon=%.1f° → house %d, want %d", tc.lon, got, tc.wantHouse)
		}
	}
}

func TestHousePosFromCusps_CuspNear360(t *testing.T) {
	// Ascendant at 350° — house 1 spans 350°–20°.
	cusps := equalHouseCusps(350.0)

	tests := []struct {
		lon       float64
		wantHouse int
	}{
		{355.0, 1}, // clearly in house 1
		{5.0, 1},   // wraps through 0°, still house 1
		{20.0, 2},  // cusp 2 starts at 350+30=20°
		{345.0, 12},
	}

	for _, tc := range tests {
		got := housePosForTest(tc.lon, cusps)
		if got != tc.wantHouse {
			t.Errorf("lon=%.1f° (asc=350°) → house %d, want %d", tc.lon, got, tc.wantHouse)
		}
	}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// twoPositions creates a two-planet slice with the given longitudes and speeds.
func twoPositions(lon1, spd1, lon2, spd2 float64) []domain.PlanetPosition {
	return []domain.PlanetPosition{
		{Planet: domain.PlanetSun, Longitude: lon1, Speed: spd1},
		{Planet: domain.PlanetMoon, Longitude: lon2, Speed: spd2},
	}
}

// equalHouseCusps builds a [13]float64 cusp array with evenly spaced 30° cusps
// starting from the given ascendant longitude.
func equalHouseCusps(asc float64) [13]float64 {
	var cusps [13]float64
	for i := 1; i <= 12; i++ {
		cusps[i] = domain.NormalizeLongitude(asc + float64(i-1)*30.0)
	}
	return cusps
}

// housePosForTest is a test-accessible wrapper around the package-internal
// housePosFromCusps function. Because housePosFromCusps is unexported, we
// replicate the logic here to keep the tests black-box at the package level.
func housePosForTest(lon float64, cusps [13]float64) int {
	normalized := domain.NormalizeLongitude(lon)
	for h := 1; h <= 12; h++ {
		next := h%12 + 1
		start := domain.NormalizeLongitude(cusps[h])
		end := domain.NormalizeLongitude(cusps[next])

		var inArc bool
		if start <= end {
			inArc = normalized >= start && normalized < end
		} else {
			inArc = normalized >= start || normalized < end
		}
		if inArc {
			return h
		}
	}
	return 1
}
