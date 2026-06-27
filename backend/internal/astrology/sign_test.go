package astrology_test

import (
	"testing"

	domain "github.com/zodiac/backend/internal/domain/astrology"
)

func TestNormalizeLongitude(t *testing.T) {
	tests := []struct {
		input float64
		want  float64
	}{
		{0, 0},
		{360, 0},
		{-1, 359},
		{-90, 270},
		{361, 1},
		{720, 0},
		{-360, 0},
		{179.5, 179.5},
	}

	for _, tc := range tests {
		got := domain.NormalizeLongitude(tc.input)
		if !approxEqual(got, tc.want, 1e-9) {
			t.Errorf("NormalizeLongitude(%v) = %v, want %v", tc.input, got, tc.want)
		}
	}
}

func TestSignFromLongitude(t *testing.T) {
	tests := []struct {
		lon  float64
		want domain.ZodiacSign
	}{
		{0, domain.Aries},
		{15, domain.Aries},
		{29.99, domain.Aries},
		{30, domain.Taurus},
		{59.99, domain.Taurus},
		{60, domain.Gemini},
		{90, domain.Cancer},
		{120, domain.Leo},
		{150, domain.Virgo},
		{180, domain.Libra},
		{210, domain.Scorpio},
		{240, domain.Sagittarius},
		{270, domain.Capricorn},
		{300, domain.Aquarius},
		{330, domain.Pisces},
		{359.99, domain.Pisces},
	}

	for _, tc := range tests {
		got := domain.SignFromLongitude(tc.lon)
		if got != tc.want {
			t.Errorf("SignFromLongitude(%v) = %v, want %v", tc.lon, got, tc.want)
		}
	}
}

func TestDegreeInSign(t *testing.T) {
	tests := []struct {
		lon  float64
		want float64
	}{
		{0, 0},       // Aries 0°
		{15, 15},     // Aries 15°
		{30, 0},      // Taurus 0°
		{31.5, 1.5},  // Taurus 1.5°
		{359.5, 29.5}, // Pisces 29.5°
	}

	for _, tc := range tests {
		got := domain.DegreeInSign(tc.lon)
		if !approxEqual(got, tc.want, 1e-9) {
			t.Errorf("DegreeInSign(%v) = %v, want %v", tc.lon, got, tc.want)
		}
	}
}

func TestAngularSeparation(t *testing.T) {
	tests := []struct {
		lon1, lon2 float64
		want       float64
	}{
		{0, 0, 0},
		{0, 90, 90},
		{0, 180, 180},
		{0, 270, 90},  // 270° from 0° — shortest arc is 90° (going backward)
		{350, 10, 20}, // crosses 0°
		{10, 350, 20}, // symmetric
		{90, 270, 180},
		{180, 0, 180},
	}

	for _, tc := range tests {
		got := domain.AngularSeparation(tc.lon1, tc.lon2)
		if !approxEqual(got, tc.want, 1e-9) {
			t.Errorf("AngularSeparation(%v, %v) = %v, want %v", tc.lon1, tc.lon2, got, tc.want)
		}
	}
}

func TestZodiacSignString(t *testing.T) {
	tests := []struct {
		sign domain.ZodiacSign
		want string
	}{
		{domain.Aries, "Aries"},
		{domain.Taurus, "Taurus"},
		{domain.Pisces, "Pisces"},
		{domain.ZodiacSign(99), "Unknown"},
	}

	for _, tc := range tests {
		if got := tc.sign.String(); got != tc.want {
			t.Errorf("ZodiacSign(%d).String() = %q, want %q", tc.sign, got, tc.want)
		}
	}
}

func TestAngleDiff(t *testing.T) {
	tests := []struct {
		lon1, lon2 float64
		want       float64 // signed, -180 < result <= 180
	}{
		{0, 90, 90},
		{90, 0, -90},
		{350, 10, 20},
		{10, 350, -20},
		{0, 180, 180},
		{180, 0, 180}, // 180 is the flip-point; both directions are equal, returns +180
	}

	for _, tc := range tests {
		got := domain.AngleDiff(tc.lon1, tc.lon2)
		if !approxEqual(got, tc.want, 1e-9) {
			t.Errorf("AngleDiff(%v, %v) = %v, want %v", tc.lon1, tc.lon2, got, tc.want)
		}
	}
}

// approxEqual compares two floats within a tolerance.
func approxEqual(a, b, tol float64) bool {
	d := a - b
	if d < 0 {
		d = -d
	}
	return d <= tol
}
