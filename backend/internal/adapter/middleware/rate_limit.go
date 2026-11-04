package middleware

import (
	"math"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/zodiac/backend/internal/domain"
)

const (
	limiterIdleTTL       = 10 * time.Minute
	limiterSweepInterval = time.Minute
	// limiterMaxClients bounds memory if many distinct source IPs hit the API.
	limiterMaxClients = 100_000
)

type bucket struct {
	tokens float64
	last   time.Time
}

// rateLimiter is an in-memory, per-client-IP token bucket. It is per process:
// behind multiple replicas each instance enforces its own limit.
type rateLimiter struct {
	mu        sync.Mutex
	perSecond float64
	burst     float64
	clients   map[string]*bucket
	lastSweep time.Time
	now       func() time.Time
}

func newRateLimiter(perMinute, burst int) *rateLimiter {
	return &rateLimiter{
		perSecond: float64(perMinute) / 60.0,
		burst:     float64(burst),
		clients:   make(map[string]*bucket),
		lastSweep: time.Now(),
		now:       time.Now,
	}
}

// allow consumes one token for key. When denied it returns how long to wait.
func (l *rateLimiter) allow(key string) (bool, time.Duration) {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := l.now()
	l.sweep(now)

	b, ok := l.clients[key]
	if !ok {
		if len(l.clients) >= limiterMaxClients {
			// Fail closed for new, unknown clients while the table is saturated.
			return false, time.Second
		}
		b = &bucket{tokens: l.burst, last: now}
		l.clients[key] = b
	}

	b.tokens = math.Min(l.burst, b.tokens+now.Sub(b.last).Seconds()*l.perSecond)
	b.last = now

	if b.tokens >= 1 {
		b.tokens--
		return true, 0
	}
	wait := time.Duration((1 - b.tokens) / l.perSecond * float64(time.Second))
	return false, wait
}

func (l *rateLimiter) sweep(now time.Time) {
	if now.Sub(l.lastSweep) < limiterSweepInterval {
		return
	}
	l.lastSweep = now
	for k, b := range l.clients {
		if now.Sub(b.last) > limiterIdleTTL {
			delete(l.clients, k)
		}
	}
}

// RateLimit returns a middleware limiting each client IP to perMinute requests
// with the given burst. Client IP comes from c.ClientIP(), so configure the
// engine's trusted proxies or the limit can be bypassed with a forged
// X-Forwarded-For header.
func RateLimit(perMinute, burst int) gin.HandlerFunc {
	l := newRateLimiter(perMinute, burst)
	return func(c *gin.Context) {
		if c.Request.Method == http.MethodOptions {
			c.Next()
			return
		}
		ok, wait := l.allow(c.ClientIP())
		if ok {
			c.Next()
			return
		}
		secs := int(math.Ceil(wait.Seconds()))
		if secs < 1 {
			secs = 1
		}
		c.Header("Retry-After", strconv.Itoa(secs))
		c.Abort()
		_ = c.Error(domain.ErrTooManyRequests())
	}
}

// BodyLimit caps the readable request body at maxBytes. Handlers binding the
// body receive an *http.MaxBytesError once the cap is exceeded.
func BodyLimit(maxBytes int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.ContentLength > maxBytes {
			c.Abort()
			_ = c.Error(domain.ErrPayloadTooLarge())
			return
		}
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)
		c.Next()
	}
}
