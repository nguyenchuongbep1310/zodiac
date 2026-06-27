package dto

import "time"

// CreateProfileRequest is the body accepted by POST /api/v1/profiles.
//
//	@Description	Create a new birth profile
type CreateProfileRequest struct {
	// Name is a human-readable label for the subject (e.g. "John's Chart").
	Name string `json:"name" binding:"required,min=1,max=120"`
	// BirthDate is the date portion in YYYY-MM-DD format.
	BirthDate string `json:"birth_date" binding:"required"`
	// BirthTime is the time portion in HH:MM format (24-hour).
	BirthTime string `json:"birth_time" binding:"required"`
	// Timezone is a valid IANA timezone identifier, e.g. "America/New_York".
	Timezone string `json:"timezone" binding:"required,max=64"`
	// Latitude is geographic latitude in decimal degrees (−90 to +90).
	Latitude float64 `json:"latitude" binding:"required,min=-90,max=90"`
	// Longitude is geographic longitude in decimal degrees (−180 to +180).
	Longitude float64 `json:"longitude" binding:"required,min=-180,max=180"`
	// City is a human-readable place name.
	City string `json:"city" binding:"required,min=1,max=120"`
}

// ProfileResponse is the canonical representation of a BirthProfile.
//
//	@Description	Birth profile resource
type ProfileResponse struct {
	ID        string           `json:"id"`
	UserID    string           `json:"user_id"`
	Name      string           `json:"name"`
	BirthDate string           `json:"birth_date"`
	BirthTime string           `json:"birth_time"`
	Timezone  string           `json:"timezone"`
	Location  LocationResponse `json:"location"`
	CreatedAt time.Time        `json:"created_at"`
	UpdatedAt time.Time        `json:"updated_at"`
}

// LocationResponse embeds geographic data inside ProfileResponse.
//
//	@Description	Geographic location data
type LocationResponse struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	City      string  `json:"city"`
}

// ProfileListResponse wraps a paginated list of profiles.
//
//	@Description	Paginated list of birth profiles
type ProfileListResponse struct {
	Data  []ProfileResponse `json:"data"`
	Total int               `json:"total"`
}
