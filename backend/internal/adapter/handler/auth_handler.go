// Package handler contains the HTTP handler layer for the Zodiac API.
// Each handler struct is a thin adapter: it decodes requests, calls the
// appropriate service, and encodes the response. Business logic lives in the
// service layer.
package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/zodiac/backend/internal/app/dto"
	"github.com/zodiac/backend/internal/app/service"
	"github.com/zodiac/backend/internal/domain"
)

// AuthHandler handles all authentication routes.
type AuthHandler struct {
	authSvc *service.AuthService
	log     *zap.Logger
}

// NewAuthHandler constructs an AuthHandler.
func NewAuthHandler(authSvc *service.AuthService, log *zap.Logger) *AuthHandler {
	return &AuthHandler{authSvc: authSvc, log: log}
}

// Register godoc
//
//	@Summary		Register a new user
//	@Description	Creates a new user account and returns a JWT token pair.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.RegisterRequest	true	"Registration payload"
//	@Success		201		{object}	dto.TokenPair
//	@Failure		400		{object}	middleware.ErrorResponse
//	@Failure		409		{object}	middleware.ErrorResponse
//	@Failure		500		{object}	middleware.ErrorResponse
//	@Router			/api/v1/auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(domain.ErrValidation(err.Error()))
		return
	}

	result, err := h.authSvc.Register(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, dto.TokenPair{
		AccessToken:  result.TokenPair.AccessToken,
		RefreshToken: result.TokenPair.RefreshToken,
		ExpiresIn:    result.TokenPair.ExpiresIn,
		TokenType:    "Bearer",
	})
}

// Login godoc
//
//	@Summary		Authenticate a user
//	@Description	Validates credentials and returns a JWT token pair.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.LoginRequest	true	"Login credentials"
//	@Success		200		{object}	dto.TokenPair
//	@Failure		400		{object}	middleware.ErrorResponse
//	@Failure		401		{object}	middleware.ErrorResponse
//	@Failure		500		{object}	middleware.ErrorResponse
//	@Router			/api/v1/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(domain.ErrValidation(err.Error()))
		return
	}

	pair, err := h.authSvc.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, dto.TokenPair{
		AccessToken:  pair.AccessToken,
		RefreshToken: pair.RefreshToken,
		ExpiresIn:    pair.ExpiresIn,
		TokenType:    "Bearer",
	})
}

// Refresh godoc
//
//	@Summary		Rotate JWT tokens
//	@Description	Exchanges a valid refresh token for a new access + refresh token pair. Tokens are single-use.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.RefreshRequest	true	"Refresh token"
//	@Success		200		{object}	dto.TokenPair
//	@Failure		400		{object}	middleware.ErrorResponse
//	@Failure		401		{object}	middleware.ErrorResponse
//	@Failure		500		{object}	middleware.ErrorResponse
//	@Router			/api/v1/auth/refresh [post]
func (h *AuthHandler) Refresh(c *gin.Context) {
	var req dto.RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(domain.ErrValidation(err.Error()))
		return
	}

	pair, err := h.authSvc.RefreshTokens(c.Request.Context(), req.RefreshToken)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, dto.TokenPair{
		AccessToken:  pair.AccessToken,
		RefreshToken: pair.RefreshToken,
		ExpiresIn:    pair.ExpiresIn,
		TokenType:    "Bearer",
	})
}

// ForgotPassword godoc
//
//	@Summary		Request a password reset
//	@Description	Initiates the password reset process by sending an email with a reset token.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.ForgotPasswordRequest	true	"Email address"
//	@Success		202		{object}	nil
//	@Failure		400		{object}	middleware.ErrorResponse
//	@Failure		500		{object}	middleware.ErrorResponse
//	@Router			/api/v1/auth/forgot-password [post]
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req dto.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(domain.ErrValidation(err.Error()))
		return
	}

	if err := h.authSvc.ForgotPassword(c.Request.Context(), req.Email); err != nil {
		c.Error(err)
		return
	}

	c.Status(http.StatusAccepted)
}

// ResetPassword godoc
//
//	@Summary		Reset a user's password
//	@Description	Sets a new password for a user using a valid reset token.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.ResetPasswordRequest	true	"Reset token and new password"
//	@Success		204		{object}	nil
//	@Failure		400		{object}	middleware.ErrorResponse
//	@Failure		500		{object}	middleware.ErrorResponse
//	@Router			/api/v1/auth/reset-password [post]
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req dto.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(domain.ErrValidation(err.Error()))
		return
	}

	err := h.authSvc.ResetPassword(c.Request.Context(), req.Token, req.NewPassword)
	if err != nil {
		c.Error(err)
		return
	}

	c.Status(http.StatusNoContent)
}

// respondError writes a structured JSON error from any error type.
// Exported for reuse across handlers.
func respondError(c *gin.Context, err error) {
	var appErr *domain.AppError
	if errors.As(err, &appErr) {
		c.AbortWithStatusJSON(appErr.StatusCode, gin.H{
			"code":    appErr.Code,
			"message": appErr.Message,
		})
		return
	}
	c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
		"code":    "INTERNAL_SERVER_ERROR",
		"message": "an unexpected error occurred",
	})
}
