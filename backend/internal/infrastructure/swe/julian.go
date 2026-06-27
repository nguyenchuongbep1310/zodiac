package swe

import "time"

// JulianDayUT converts a time.Time to a Julian Day Number in Universal Time (UT),
// which is the time scale required by the Swiss Ephemeris calc functions.
//
// Algorithm: Jean Meeus, "Astronomical Algorithms", 2nd ed., Chapter 7 (pp.60–61).
// Valid for all dates after the adoption of the Gregorian calendar (Oct 15, 1582).
func JulianDayUT(t time.Time) float64 {
	t = t.UTC()

	Y := t.Year()
	M := int(t.Month())
	D := t.Day()

	// Fractional day from hour, minute, second, nanosecond
	fracDay := (float64(t.Hour()) +
		float64(t.Minute())/60.0 +
		(float64(t.Second())+float64(t.Nanosecond())/1e9)/3600.0) / 24.0

	// January and February are treated as months 13 and 14 of the previous year.
	if M <= 2 {
		Y--
		M += 12
	}

	A := Y / 100
	B := 2 - A + A/4 // Gregorian calendar correction

	jd := float64(int(365.25*float64(Y+4716))) +
		float64(int(30.6001*float64(M+1))) +
		float64(D) + fracDay + float64(B) - 1524.5

	return jd
}
