package dto

import "time"

// CalculateChartRequest is the body accepted by POST /api/v1/charts/calculate.
//
//	@Description	Trigger a natal chart calculation for a birth profile
type CalculateChartRequest struct {
	Name      string `json:"name" binding:"required,max=100"`
	BirthDate string `json:"birth_date" binding:"required,max=10"` // e.g. "2000-01-01"
	BirthTime string `json:"birth_time" binding:"required,max=8"`  // e.g. "12:00:00"
	Timezone  string `json:"timezone" binding:"required,max=50"`
	// Latitude/Longitude are pointers so that a legitimate value of 0 (equator,
	// prime meridian) is not mistaken for a missing field by "required".
	Latitude  *float64 `json:"latitude" binding:"required,gte=-90,lte=90"`
	Longitude *float64 `json:"longitude" binding:"required,gte=-180,lte=180"`
	City      string   `json:"city" binding:"max=255"`
	// HouseSystem selects the house division method.
	// Allowed values: "placidus" (default), "koch", "whole_sign", "equal".
	HouseSystem string `json:"house_system" binding:"omitempty,oneof=placidus koch whole_sign equal"`
	// ZodiacSystem selects the zodiac type.
	// Allowed values: "tropical" (default), "sidereal".
	ZodiacSystem string `json:"zodiac_system" binding:"omitempty,oneof=tropical sidereal"`
}

// ChartResponse is the complete natal chart resource.
//
//	@Description	Full natal chart with planets, houses, and aspects
type ChartResponse struct {
	ID           string                   `json:"id"`
	UserID       *string                  `json:"user_id,omitempty"`
	Name         string                   `json:"name"`
	BirthDate    string                   `json:"birth_date"`
	BirthTime    string                   `json:"birth_time"`
	Timezone     string                   `json:"timezone"`
	Latitude     float64                  `json:"latitude"`
	Longitude    float64                  `json:"longitude"`
	City         string                   `json:"city"`
	HouseSystem  string                   `json:"house_system"`
	ZodiacSystem string                   `json:"zodiac_system"`
	IsRectified  bool                     `json:"is_rectified"`
	Planets      []PlanetPositionResponse `json:"planets"`
	Houses       []HouseCuspResponse      `json:"houses"`
	Aspects      []AspectResponse         `json:"aspects"`
	CreatedAt    time.Time                `json:"created_at"`
}

// PlanetPositionResponse represents a single planet's ecliptic position.
//
//	@Description	Planet position within a natal chart
type PlanetPositionResponse struct {
	Planet       string  `json:"planet"`
	Longitude    float64 `json:"longitude"`
	Latitude     float64 `json:"latitude"`
	Speed        float64 `json:"speed"`
	IsRetrograde bool    `json:"is_retrograde"`
	Sign         string  `json:"sign"`
	HouseNumber  int     `json:"house_number"`
}

// HouseCuspResponse represents a single house cusp.
//
//	@Description	House cusp in a natal chart
type HouseCuspResponse struct {
	HouseNumber   int     `json:"house_number"`
	CuspLongitude float64 `json:"cusp_longitude"`
	Sign          string  `json:"sign"`
}

// AspectResponse represents an angular relationship between two planets.
//
//	@Description	Aspect between two planets
type AspectResponse struct {
	Planet1    string  `json:"planet_1"`
	Planet2    string  `json:"planet_2"`
	AspectType string  `json:"aspect_type"`
	Orb        float64 `json:"orb"`
	IsApplying bool    `json:"is_applying"`
}
