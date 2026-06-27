package astrology

// ZodiacSign represents one of the 12 tropical zodiac signs.
type ZodiacSign int

const (
	Aries       ZodiacSign = 0
	Taurus      ZodiacSign = 1
	Gemini      ZodiacSign = 2
	Cancer      ZodiacSign = 3
	Leo         ZodiacSign = 4
	Virgo       ZodiacSign = 5
	Libra       ZodiacSign = 6
	Scorpio     ZodiacSign = 7
	Sagittarius ZodiacSign = 8
	Capricorn   ZodiacSign = 9
	Aquarius    ZodiacSign = 10
	Pisces      ZodiacSign = 11
)

var signNames = [12]string{
	"Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
	"Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
}

func (s ZodiacSign) String() string {
	if s < 0 || int(s) >= len(signNames) {
		return "Unknown"
	}
	return signNames[s]
}

// SignFromLongitude returns the zodiac sign for an ecliptic longitude.
// Every 30° of the ecliptic corresponds to one sign, starting at Aries at 0°.
func SignFromLongitude(longitude float64) ZodiacSign {
	return ZodiacSign(int(NormalizeLongitude(longitude) / 30.0))
}

// DegreeInSign returns the degree within the sign (0–30°) for an ecliptic longitude.
func DegreeInSign(longitude float64) float64 {
	lon := NormalizeLongitude(longitude)
	return lon - float64(int(lon/30.0))*30.0
}

// NormalizeLongitude clamps an arbitrary angle to the canonical range [0°, 360°).
// This handles negative longitudes and values above 360°.
func NormalizeLongitude(lon float64) float64 {
	lon = lon - 360.0*float64(int(lon/360.0))
	if lon < 0 {
		lon += 360.0
	}
	return lon
}

// AngleDiff returns the signed shortest difference from lon1 to lon2
// in the range (-180°, 180°]. Positive = lon2 is ahead of lon1.
func AngleDiff(lon1, lon2 float64) float64 {
	diff := NormalizeLongitude(lon2) - NormalizeLongitude(lon1)
	if diff > 180.0 {
		diff -= 360.0
	} else if diff <= -180.0 {
		diff += 360.0
	}
	return diff
}
