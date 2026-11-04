package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func newEngine(mw ...gin.HandlerFunc) *gin.Engine {
	gin.SetMode(gin.TestMode)
	e := gin.New()
	_ = e.SetTrustedProxies([]string{})
	e.Use(ErrorHandler())
	e.Use(mw...)
	e.Any("/x", func(c *gin.Context) {
		if _, err := c.GetRawData(); err != nil {
			_ = c.Error(err)
			return
		}
		c.Status(http.StatusOK)
	})
	return e
}

func do(e *gin.Engine, method, body string, hdr map[string]string, remote string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, "/x", strings.NewReader(body))
	req.RemoteAddr = remote
	for k, v := range hdr {
		req.Header.Set(k, v)
	}
	w := httptest.NewRecorder()
	e.ServeHTTP(w, req)
	return w
}

func TestRateLimit_BurstThen429WithRetryAfter(t *testing.T) {
	e := newEngine(RateLimit(60, 3))
	for i := 0; i < 3; i++ {
		if w := do(e, "GET", "", nil, "1.2.3.4:1000"); w.Code != 200 {
			t.Fatalf("request %d: got %d, want 200", i, w.Code)
		}
	}
	w := do(e, "GET", "", nil, "1.2.3.4:1000")
	if w.Code != http.StatusTooManyRequests {
		t.Fatalf("got %d, want 429", w.Code)
	}
	if w.Header().Get("Retry-After") == "" {
		t.Fatal("missing Retry-After header")
	}
	// A different client is unaffected.
	if w := do(e, "GET", "", nil, "5.6.7.8:1000"); w.Code != 200 {
		t.Fatalf("other client got %d, want 200", w.Code)
	}
}

func TestRateLimit_ForgedXFFDoesNotBypass(t *testing.T) {
	e := newEngine(RateLimit(60, 1))
	if w := do(e, "GET", "", map[string]string{"X-Forwarded-For": "9.9.9.1"}, "1.2.3.4:1"); w.Code != 200 {
		t.Fatalf("got %d", w.Code)
	}
	if w := do(e, "GET", "", map[string]string{"X-Forwarded-For": "9.9.9.2"}, "1.2.3.4:2"); w.Code != 429 {
		t.Fatalf("forged XFF bypassed limiter: got %d, want 429", w.Code)
	}
}

func TestRateLimiter_RefillsOverTime(t *testing.T) {
	l := newRateLimiter(60, 1) // 1 token/second
	now := time.Now()
	l.now = func() time.Time { return now }
	if ok, _ := l.allow("a"); !ok {
		t.Fatal("first request should pass")
	}
	if ok, _ := l.allow("a"); ok {
		t.Fatal("second immediate request should be denied")
	}
	now = now.Add(1100 * time.Millisecond)
	if ok, _ := l.allow("a"); !ok {
		t.Fatal("request after refill should pass")
	}
}

func TestRateLimiter_SweepsIdleClients(t *testing.T) {
	l := newRateLimiter(60, 1)
	now := time.Now()
	l.now = func() time.Time { return now }
	l.allow("a")
	now = now.Add(limiterIdleTTL + 2*limiterSweepInterval)
	l.allow("b")
	if _, ok := l.clients["a"]; ok {
		t.Fatal("idle client was not swept")
	}
}

func TestBodyLimit(t *testing.T) {
	e := newEngine(BodyLimit(10))
	if w := do(e, "POST", "short", nil, "1.1.1.1:1"); w.Code != 200 {
		t.Fatalf("small body: got %d", w.Code)
	}
	if w := do(e, "POST", strings.Repeat("a", 11), nil, "1.1.1.1:1"); w.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("declared-length oversize: got %d, want 413", w.Code)
	}
	// Unknown length (chunked): must be cut off by MaxBytesReader.
	req := httptest.NewRequest("POST", "/x", strings.NewReader(strings.Repeat("a", 50)))
	req.ContentLength = -1
	w := httptest.NewRecorder()
	e.ServeHTTP(w, req)
	if w.Code == 200 {
		t.Fatal("chunked oversize body was not rejected")
	}
}

func TestCORS_AllowlistOnly(t *testing.T) {
	e := newEngine(CORS(NewCORSConfig([]string{"https://app.example"})))

	w := do(e, "GET", "", map[string]string{"Origin": "https://app.example"}, "1.1.1.1:1")
	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "https://app.example" {
		t.Fatalf("allowed origin: got ACAO %q", got)
	}
	if w.Header().Get("Access-Control-Allow-Credentials") != "" {
		t.Fatal("credentials must not be allowed")
	}

	w = do(e, "GET", "", map[string]string{"Origin": "https://evil.example"}, "1.1.1.1:1")
	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Fatalf("disallowed origin got ACAO %q", got)
	}

	w = do(e, "GET", "", nil, "1.1.1.1:1")
	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Fatalf("no-Origin request got ACAO %q", got)
	}

	w = do(e, "OPTIONS", "", map[string]string{"Origin": "https://app.example"}, "1.1.1.1:1")
	if w.Code != http.StatusNoContent {
		t.Fatalf("preflight: got %d, want 204", w.Code)
	}
}
