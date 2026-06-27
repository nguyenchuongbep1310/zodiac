package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/zodiac/backend/internal/adapter/middleware"
	"github.com/zodiac/backend/internal/app/dto"
	"github.com/zodiac/backend/internal/app/service"
	"github.com/zodiac/backend/internal/domain"
)

// InterpretationHandler handles interpretation routes.
type InterpretationHandler struct {
	interpSvc *service.InterpretationService
	log       *zap.Logger
}

// NewInterpretationHandler constructs the handler.
func NewInterpretationHandler(interpSvc *service.InterpretationService, log *zap.Logger) *InterpretationHandler {
	return &InterpretationHandler{interpSvc: interpSvc, log: log}
}

// GetByChartID godoc
//
//	@Summary		Get chart interpretations
//	@Description	Returns astrological interpretations for every planet-in-sign, planet-in-house, and aspect in the specified natal chart. Supports "en" (default) and "vi" via ?lang= query param.
//	@Tags			interpretations
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id		path		string	true	"Chart UUID"
//	@Param			lang	query		string	false	"Language code: en (default) | vi"
//	@Success		200		{object}	dto.ChartInterpretationResponse
//	@Failure		400		{object}	middleware.ErrorResponse
//	@Failure		401		{object}	middleware.ErrorResponse
//	@Failure		403		{object}	middleware.ErrorResponse
//	@Failure		404		{object}	middleware.ErrorResponse
//	@Failure		500		{object}	middleware.ErrorResponse
//	@Router			/api/v1/charts/{id}/interpretations [get]
func (h *InterpretationHandler) GetByChartID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(domain.ErrValidation("id must be a valid UUID"))
		return
	}

	var req dto.InterpretChartRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.Error(domain.ErrValidation(err.Error()))
		return
	}

	// Default language to "en" when omitted.
	if req.Language == "" {
		req.Language = "en"
	}

	userID := middleware.GetUserID(c)

	interp, err := h.interpSvc.Interpret(
		c.Request.Context(),
		id,
		userID,
		req.Language,
	)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, mapInterpretationToResponse(interp))
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

func mapInterpretationToResponse(i *domain.ChartInterpretation) dto.ChartInterpretationResponse {
	resp := dto.ChartInterpretationResponse{
		ChartID:       i.ChartID.String(),
		Language:      i.Language,
		PlanetInSign:  make([]dto.PlanetInSignResponse, 0, len(i.PlanetInSign)),
		PlanetInHouse: make([]dto.PlanetInHouseResponse, 0, len(i.PlanetInHouse)),
		Aspects:       make([]dto.AspectInterpretationResponse, 0, len(i.Aspects)),
	}

	for _, s := range i.PlanetInSign {
		entry := dto.PlanetInSignResponse{
			Planet: s.Planet,
			Sign:   s.Sign,
		}
		if s.Template != nil {
			entry.Interpretation = templateToContent(s.Template)
		}
		resp.PlanetInSign = append(resp.PlanetInSign, entry)
	}

	for _, h := range i.PlanetInHouse {
		entry := dto.PlanetInHouseResponse{
			Planet:      h.Planet,
			HouseNumber: h.HouseNumber,
		}
		if h.Template != nil {
			entry.Interpretation = templateToContent(h.Template)
		}
		resp.PlanetInHouse = append(resp.PlanetInHouse, entry)
	}

	for _, a := range i.Aspects {
		entry := dto.AspectInterpretationResponse{
			Planet1:    a.Planet1,
			Planet2:    a.Planet2,
			AspectType: a.AspectType,
			Orb:        a.Orb,
			IsApplying: a.IsApplying,
		}
		if a.Template != nil {
			entry.Interpretation = templateToContent(a.Template)
		}
		resp.Aspects = append(resp.Aspects, entry)
	}

	return resp
}

func templateToContent(t *domain.PlacementInterpretation) *dto.InterpretationContentResponse {
	return &dto.InterpretationContentResponse{
		CoreMeaning:   t.CoreMeaning,
		RealLife:      t.RealLife,
		Strengths:     t.Strengths,
		Challenges:    t.Challenges,
		Relationships: t.Relationships,
		GrowthPath:    t.GrowthPath,
		KeyThemes:     t.KeyThemes,
	}
}
