package middleware

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// CORSConfig holds the CORS policy settings.
type CORSConfig struct {
	// AllowedOrigins is an explicit allowlist. A literal "*" allows any origin
	// but never together with credentials; config validation forbids it in production.
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
	MaxAge         time.Duration
}

// NewCORSConfig builds a CORS policy for the given origin allowlist.
func NewCORSConfig(allowedOrigins []string) CORSConfig {
	return CORSConfig{
		AllowedOrigins: allowedOrigins,
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Origin", "Content-Type", "X-Request-ID", "Accept"},
		MaxAge:         12 * time.Hour,
	}
}

// CORS returns a Gin middleware that sets CORS response headers only for
// origins on the allowlist. Credentials are never allowed: the API is
// currently unauthenticated, so there is nothing a credentialed request needs.
func CORS(cfg CORSConfig) gin.HandlerFunc {
	methods := strings.Join(cfg.AllowedMethods, ", ")
	headers := strings.Join(cfg.AllowedHeaders, ", ")
	maxAge := strconv.Itoa(int(cfg.MaxAge.Seconds()))

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		c.Writer.Header().Add("Vary", "Origin")

		allowed := origin != "" && isAllowedOrigin(origin, cfg.AllowedOrigins)
		if allowed {
			if hasWildcard(cfg.AllowedOrigins) {
				c.Header("Access-Control-Allow-Origin", "*")
			} else {
				c.Header("Access-Control-Allow-Origin", origin)
			}
			c.Header("Access-Control-Allow-Methods", methods)
			c.Header("Access-Control-Allow-Headers", headers)
			c.Header("Access-Control-Max-Age", maxAge)
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func isAllowedOrigin(origin string, allowed []string) bool {
	for _, o := range allowed {
		if o == "*" || o == origin {
			return true
		}
	}
	return false
}

func hasWildcard(allowed []string) bool {
	for _, o := range allowed {
		if o == "*" {
			return true
		}
	}
	return false
}
