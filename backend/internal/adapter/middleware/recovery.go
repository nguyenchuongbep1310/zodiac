package middleware

import (
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"github.com/zodiac/backend/internal/infrastructure/logger"
	"go.uber.org/zap"
)

// Recovery returns a Gin middleware that recovers from panics, logs the stack trace
// using the structured logger, and returns a 500 JSON response.
func Recovery(log *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				stack := debug.Stack()

				log.Error("panic recovered",
					zap.Any("error", r),
					zap.String("stack", string(stack)),
					zap.String("path", c.Request.URL.Path),
					zap.String("method", c.Request.Method),
				)

				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"code":    "INTERNAL_SERVER_ERROR",
					"message": "an unexpected error occurred",
				})
			}
		}()
		c.Next()
	}
}
