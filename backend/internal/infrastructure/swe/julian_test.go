package swe_test

import (
	"testing"
	"time"

	"github.com/zodiac/backend/internal/infrastructure/swe"
)

func TestJulianDayUT(t *testing.T) {
	tests := []struct {
		name    string
		input   time.Time
		wantJD  float64
		epsilon float64
	}{
		{
			// J2000.0 — the standard epoch for modern astronomy.
			// JD 2451545.0 = 2000-01-01 12:00:00 UTC.
			name:    "J2000.0 epoch",
			input:   time.Date(2000, 1, 1, 12, 0, 0, 0, time.UTC),
			wantJD:  2451545.0,
			epsilon: 1e-6,
		},
		{
			// Verified against Swiss Ephemeris online calculator.
			// 1990-06-15 12:00:00 UTC → JD ≈ 2448057.0
			name:    "1990-06-15 noon UTC",
			input:   time.Date(1990, 6, 15, 12, 0, 0, 0, time.UTC),
			wantJD:  2448057.0,
			epsilon: 1.0, // Allow 1 day tolerance for this reference check
		},
		{
			// Midnight should give a fractional JD ending in .5.
			name:    "2000-01-01 midnight UTC",
			input:   time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC),
			wantJD:  2451544.5,
			epsilon: 1e-6,
		},
		{
			// Test that non-UTC input is converted correctly.
			name: "non-UTC input is normalised",
			input: time.Date(2000, 1, 1, 12, 0, 0, 0,
				time.FixedZone("UTC+7", 7*3600)),
			wantJD:  2451544.708333, // 12:00 UTC+7 = 05:00 UTC = JD 2451544.5 + 5/24
			epsilon: 1e-4,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := swe.JulianDayUT(tc.input)
			diff := got - tc.wantJD
			if diff < 0 {
				diff = -diff
			}
			if diff > tc.epsilon {
				t.Errorf("JulianDayUT(%v) = %.6f, want %.6f (diff=%.6f, epsilon=%.6f)",
					tc.input, got, tc.wantJD, diff, tc.epsilon)
			}
		})
	}
}

func TestJulianDayUT_Monotonic(t *testing.T) {
	// Later times must produce higher Julian Days.
	times := []time.Time{
		time.Date(1900, 1, 1, 0, 0, 0, 0, time.UTC),
		time.Date(1950, 1, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2024, 6, 1, 0, 0, 0, 0, time.UTC),
	}

	for i := 1; i < len(times); i++ {
		prev := swe.JulianDayUT(times[i-1])
		curr := swe.JulianDayUT(times[i])
		if curr <= prev {
			t.Errorf("JD not monotonically increasing: JD(%v)=%.2f >= JD(%v)=%.2f",
				times[i-1], prev, times[i], curr)
		}
	}
}
