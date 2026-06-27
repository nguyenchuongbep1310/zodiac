package middleware

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zodiac/backend/internal/domain"
)

// ErrorResponse is the canonical JSON error body returned to clients.
type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// ErrorHandler is a Gin middleware that converts domain errors and panics
// into structured JSON error responses. Must be registered before routes.
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) == 0 {
			return
		}

		// Use the last error attached via c.Error(err).
		err := c.Errors.Last().Err

		var appErr *domain.AppError
		if errors.As(err, &appErr) {
			c.JSON(appErr.StatusCode, ErrorResponse{
				Code:    appErr.Code,
				Message: appErr.Message,
			})
			return
		}

		// Unrecognized error: log it and return a generic 500.
		c.Request.Context()
		gin.DefaultErrorWriter.Write([]byte("Unhandled error: " + err.Error() + "\n"))
		
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Code:    "INTERNAL_SERVER_ERROR",
			Message: "an unexpected error occurred",
		})
	}
}
