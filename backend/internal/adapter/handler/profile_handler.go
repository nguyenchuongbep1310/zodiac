package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/zodiac/backend/internal/adapter/middleware"
	"github.com/zodiac/backend/internal/app/dto"
	"github.com/zodiac/backend/internal/app/service"
	"github.com/zodiac/backend/internal/domain"
)

// ProfileHandler handles all birth-profile routes.
type ProfileHandler struct {
	profileSvc *service.ProfileService
	log        *zap.Logger
}

// NewProfileHandler constructs a ProfileHandler.
func NewProfileHandler(profileSvc *service.ProfileService, log *zap.Logger) *ProfileHandler {
	return &ProfileHandler{profileSvc: profileSvc, log: log}
}

// Create godoc
//
//	@Summary		Create a birth profile
//	@Description	Creates a new birth profile owned by the authenticated user.
//	@Tags			profiles
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			body	body		dto.CreateProfileRequest	true	"Birth profile payload"
//	@Success		201		{object}	dto.ProfileResponse
//	@Failure		400		{object}	middleware.ErrorResponse
//	@Failure		401		{object}	middleware.ErrorResponse
//	@Failure		500		{object}	middleware.ErrorResponse
//	@Router			/api/v1/profiles [post]
func (h *ProfileHandler) Create(c *gin.Context) {
	var req dto.CreateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(domain.ErrValidation(err.Error()))
		return
	}

	profile, err := parseProfileRequest(req)
	if err != nil {
		c.Error(domain.ErrValidation(err.Error()))
		return
	}

	userID := middleware.GetUserID(c)
	saved, err := h.profileSvc.Create(c.Request.Context(), userID, profile)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, mapProfileToResponse(saved))
}

// List godoc
//
//	@Summary		List birth profiles
//	@Description	Returns all birth profiles belonging to the authenticated user.
//	@Tags			profiles
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{object}	dto.ProfileListResponse
//	@Failure		401	{object}	middleware.ErrorResponse
//	@Failure		500	{object}	middleware.ErrorResponse
//	@Router			/api/v1/profiles [get]
func (h *ProfileHandler) List(c *gin.Context) {
	userID := middleware.GetUserID(c)

	profiles, err := h.profileSvc.ListForUser(c.Request.Context(), userID)
	if err != nil {
		c.Error(err)
		return
	}

	resp := make([]dto.ProfileResponse, 0, len(profiles))
	for _, p := range profiles {
		resp = append(resp, mapProfileToResponse(p))
	}

	c.JSON(http.StatusOK, dto.ProfileListResponse{
		Data:  resp,
		Total: len(resp),
	})
}

// GetByID godoc
//
//	@Summary		Get a birth profile
//	@Description	Returns a single birth profile by ID. The profile must belong to the caller.
//	@Tags			profiles
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string	true	"Profile UUID"
//	@Success		200	{object}	dto.ProfileResponse
//	@Failure		400	{object}	middleware.ErrorResponse
//	@Failure		401	{object}	middleware.ErrorResponse
//	@Failure		403	{object}	middleware.ErrorResponse
//	@Failure		404	{object}	middleware.ErrorResponse
//	@Failure		500	{object}	middleware.ErrorResponse
//	@Router			/api/v1/profiles/{id} [get]
func (h *ProfileHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(domain.ErrValidation("id must be a valid UUID"))
		return
	}

	userID := middleware.GetUserID(c)
	profile, err := h.profileSvc.GetByID(c.Request.Context(), id, userID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, mapProfileToResponse(profile))
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// parseProfileRequest converts the DTO into a domain.BirthProfile, validating
// the date/time strings along the way.
func parseProfileRequest(req dto.CreateProfileRequest) (*domain.BirthProfile, error) {
	const dateLayout = "2006-01-02"
	const timeLayout = "15:04"

	date, err := time.Parse(dateLayout, req.BirthDate)
	if err != nil {
		return nil, fmt.Errorf("birth_date must be in YYYY-MM-DD format: %w", err)
	}

	t, err := time.Parse(timeLayout, req.BirthTime)
	if err != nil {
		return nil, fmt.Errorf("birth_time must be in HH:MM format: %w", err)
	}

	return &domain.BirthProfile{
		Name: req.Name,
		BirthTime: domain.BirthTime{
			Date:     date,
			Time:     t,
			Timezone: req.Timezone,
		},
		Location: domain.Location{
			Latitude:  req.Latitude,
			Longitude: req.Longitude,
			City:      req.City,
		},
	}, nil
}

func mapProfileToResponse(p *domain.BirthProfile) dto.ProfileResponse {
	const dateLayout = "2006-01-02"
	const timeLayout = "15:04"
	return dto.ProfileResponse{
		ID:        p.ID.String(),
		UserID:    p.UserID.String(),
		Name:      p.Name,
		BirthDate: p.BirthTime.Date.Format(dateLayout),
		BirthTime: p.BirthTime.Time.Format(timeLayout),
		Timezone:  p.BirthTime.Timezone,
		Location: dto.LocationResponse{
			Latitude:  p.Location.Latitude,
			Longitude: p.Location.Longitude,
			City:      p.Location.City,
		},
		CreatedAt: p.CreatedAt,
		UpdatedAt: p.UpdatedAt,
	}
}
