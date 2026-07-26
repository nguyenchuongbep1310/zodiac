package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/zodiac/backend/internal/app/dto"
	"github.com/zodiac/backend/internal/app/service"
	"github.com/zodiac/backend/internal/domain"
)

// ChartHandler handles natal chart routes.
type ChartHandler struct {
	chartSvc *service.ChartService
	log      *zap.Logger
}

// NewChartHandler constructs a ChartHandler.
func NewChartHandler(chartSvc *service.ChartService, log *zap.Logger) *ChartHandler {
	return &ChartHandler{chartSvc: chartSvc, log: log}
}

// Calculate godoc
//
//	@Summary		Calculate a natal chart
//	@Description	Runs the ephemeris calculation pipeline for the given birth profile and stores the result.
//	@Tags			charts
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.CalculateChartRequest	true	"Chart calculation request"
//	@Success		201		{object}	dto.ChartResponse
//	@Failure		400		{object}	middleware.ErrorResponse
//	@Failure		404		{object}	middleware.ErrorResponse
//	@Failure		500		{object}	middleware.ErrorResponse
//	@Router			/api/v1/charts/calculate [post]
func (h *ChartHandler) Calculate(c *gin.Context) {
	var req dto.CalculateChartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(domain.ErrValidation(err.Error()))
		return
	}

	birthDate, err := time.Parse(time.DateOnly, req.BirthDate)
	if err != nil {
		c.Error(domain.ErrValidation("invalid birth_date format, expected YYYY-MM-DD"))
		return
	}

	birthTime, err := time.Parse(time.TimeOnly, req.BirthTime)
	if err != nil {
		// try with just hours and minutes
		birthTime, err = time.Parse("15:04", req.BirthTime)
		if err != nil {
			c.Error(domain.ErrValidation("invalid birth_time format, expected HH:MM:SS or HH:MM"))
			return
		}
	}

	params := service.CalculateParams{
		UserID:       nil, // Optional: Set if user is authenticated
		Name:         req.Name,
		BirthDate:    birthDate,
		BirthTime:    birthTime,
		Timezone:     req.Timezone,
		Latitude:     req.Latitude,
		Longitude:    req.Longitude,
		City:         req.City,
		HouseSystem:  req.HouseSystem,
		ZodiacSystem: req.ZodiacSystem,
	}

	chart, err := h.chartSvc.Calculate(c.Request.Context(), params)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, mapChartToResponse(chart))
}

// GetByID godoc
//
//	@Summary		Get a natal chart
//	@Description	Returns a previously calculated natal chart by its UUID.
//	@Tags			charts
//	@Produce		json
//	@Param			id	path		string	true	"Chart UUID"
//	@Success		200	{object}	dto.ChartResponse
//	@Failure		400	{object}	middleware.ErrorResponse
//	@Failure		404	{object}	middleware.ErrorResponse
//	@Failure		500	{object}	middleware.ErrorResponse
//	@Router			/api/v1/charts/{id} [get]
func (h *ChartHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(domain.ErrValidation("id must be a valid UUID"))
		return
	}

	chart, err := h.chartSvc.GetByID(c.Request.Context(), id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, mapChartToResponse(chart))
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

func mapChartToResponse(chart *domain.NatalChart) dto.ChartResponse {
	resp := dto.ChartResponse{
		ID:           chart.ID.String(),
		Name:         chart.Name,
		BirthDate:    chart.BirthDate.Format(time.DateOnly),
		BirthTime:    chart.BirthTime.Format(time.TimeOnly),
		Timezone:     chart.Timezone,
		Latitude:     chart.Latitude,
		Longitude:    chart.Longitude,
		City:         chart.City,
		HouseSystem:  chart.HouseSystem,
		ZodiacSystem: chart.ZodiacSystem,
		IsRectified:  chart.IsRectified,
		CreatedAt:    chart.CreatedAt,
		Planets:      make([]dto.PlanetPositionResponse, 0, len(chart.Planets)),
		Houses:       make([]dto.HouseCuspResponse, 0, len(chart.Houses)),
		Aspects:      make([]dto.AspectResponse, 0, len(chart.Aspects)),
	}

	if chart.UserID != nil {
		uid := chart.UserID.String()
		resp.UserID = &uid
	}

	for _, p := range chart.Planets {
		resp.Planets = append(resp.Planets, dto.PlanetPositionResponse{
			Planet:       p.PlanetName,
			Longitude:    p.Longitude,
			Latitude:     p.Latitude,
			Speed:        p.Speed,
			IsRetrograde: p.IsRetrograde,
			Sign:         p.Sign,
			HouseNumber:  p.HousePosition,
		})
	}

	for _, h := range chart.Houses {
		resp.Houses = append(resp.Houses, dto.HouseCuspResponse{
			HouseNumber:   h.HouseNumber,
			CuspLongitude: h.CuspLongitude,
			Sign:          h.Sign,
		})
	}

	for _, a := range chart.Aspects {
		resp.Aspects = append(resp.Aspects, dto.AspectResponse{
			Planet1:    a.Planet1,
			Planet2:    a.Planet2,
			AspectType: string(a.AspectType),
			Orb:        a.Orb,
			IsApplying: a.IsApplying,
		})
	}

	return resp
}
