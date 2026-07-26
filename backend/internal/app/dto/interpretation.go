package dto

// ─── Request ──────────────────────────────────────────────────────────────────

// InterpretChartRequest carries the query parameters for the interpretation endpoint.
// Language defaults to "en" when omitted.
type InterpretChartRequest struct {
	// Language is a BCP-47 short code: "en" (English) or "vi" (Vietnamese).
	Language string `form:"lang" binding:"-"`
}

// ─── Response types ───────────────────────────────────────────────────────────

// InterpretationContentResponse is the renderable text block from a matched template.
type InterpretationContentResponse struct {
	CoreMeaning   string   `json:"core_meaning"`
	RealLife      string   `json:"real_life"`
	Strengths     string   `json:"strengths"`
	Challenges    string   `json:"challenges"`
	Relationships string   `json:"relationships"`
	GrowthPath    string   `json:"growth_path"`
	KeyThemes     []string `json:"key_themes"`
}

// PlanetInSignResponse is one entry in the planet_in_sign array.
type PlanetInSignResponse struct {
	Planet         string                          `json:"planet"`
	Sign           string                          `json:"sign"`
	Interpretation *InterpretationContentResponse  `json:"interpretation,omitempty"`
}

// PlanetInHouseResponse is one entry in the planet_in_house array.
type PlanetInHouseResponse struct {
	Planet         string                          `json:"planet"`
	HouseNumber    int                             `json:"house_number"`
	Interpretation *InterpretationContentResponse  `json:"interpretation,omitempty"`
}

// HouseInSignResponse is one entry in the house_in_sign array.
type HouseInSignResponse struct {
	HouseNumber    int                             `json:"house_number"`
	Sign           string                          `json:"sign"`
	Interpretation *InterpretationContentResponse  `json:"interpretation,omitempty"`
}

// AspectInterpretationResponse is one entry in the aspects array.
type AspectInterpretationResponse struct {
	Planet1        string                          `json:"planet_1"`
	Planet2        string                          `json:"planet_2"`
	AspectType     string                          `json:"aspect_type"`
	Orb            float64                         `json:"orb"`
	IsApplying     bool                            `json:"is_applying"`
	Interpretation *InterpretationContentResponse  `json:"interpretation,omitempty"`
}

// ChartInterpretationResponse is the top-level response for
// GET /api/v1/charts/:id/interpretations.
type ChartInterpretationResponse struct {
	ChartID       string                          `json:"chart_id"`
	Language      string                          `json:"language"`
	PlanetInSign  []PlanetInSignResponse           `json:"planet_in_sign"`
	PlanetInHouse []PlanetInHouseResponse          `json:"planet_in_house"`
	HouseInSign   []HouseInSignResponse            `json:"house_in_sign"`
	Aspects       []AspectInterpretationResponse   `json:"aspects"`
}
