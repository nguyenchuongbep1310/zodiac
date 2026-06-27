package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zodiac/backend/internal/infrastructure/logger"
	"go.uber.org/zap"
)

// RequestLogger returns a Gin middleware that emits a structured log entry
// for every request, including latency, status, and request metadata.
func RequestLogger(log *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()

		fields := []zap.Field{
			zap.Int("status", status),
			zap.String("method", c.Request.Method),
			zap.String("path", path),
			zap.String("query", query),
			zap.String("ip", c.ClientIP()),
			zap.String("user-agent", c.Request.UserAgent()),
			zap.Duration("latency", latency),
			zap.String("request-id", c.GetHeader("X-Request-ID")),
		}

		switch {
		case status >= 500:
			log.Error("server error", fields...)
		case status >= 400:
			log.Warn("client error", fields...)
		default:
			log.Info("request completed", fields...)
		}
	}
}
