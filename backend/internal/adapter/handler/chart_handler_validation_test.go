package handler

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"github.com/zodiac/backend/internal/adapter/middleware"
)

// Validation failures must be rejected before the service is reached, so a
// nil service is safe here: reaching it would panic and fail the test.
func calcEngine() *gin.Engine {
	gin.SetMode(gin.TestMode)
	e := gin.New()
	e.Use(middleware.ErrorHandler(), middleware.BodyLimit(2048))
	e.POST("/calculate", NewChartHandler(nil, nil).Calculate)
	return e
}

const validBody = `{"name":"A","birth_date":"1990-05-17","birth_time":"08:30","timezone":"Asia/Ho_Chi_Minh","latitude":21.03,"longitude":105.85}`

func post(body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest("POST", "/calculate", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	calcEngine().ServeHTTP(w, req)
	return w
}

func TestCalculate_RejectsBadInput(t *testing.T) {
	long := strings.Repeat("x", 101)
	cases := []struct {
		name string
		body string
		want int
	}{
		{"lat too high", strings.Replace(validBody, `"latitude":21.03`, `"latitude":91`, 1), 422},
		{"lat too low", strings.Replace(validBody, `"latitude":21.03`, `"latitude":-91`, 1), 422},
		{"lon too high", strings.Replace(validBody, `"longitude":105.85`, `"longitude":181`, 1), 422},
		{"lat missing", strings.Replace(validBody, `"latitude":21.03,`, ``, 1), 422},
		{"lon missing", strings.Replace(validBody, `,"longitude":105.85`, ``, 1), 422},
		{"name too long", strings.Replace(validBody, `"name":"A"`, `"name":"`+long+`"`, 1), 422},
		{"timezone too long", strings.Replace(validBody, `Asia/Ho_Chi_Minh`, strings.Repeat("z", 51), 1), 422},
		{"year too early", strings.Replace(validBody, `1990-05-17`, `1500-01-01`, 1), 422},
		{"year too late", strings.Replace(validBody, `1990-05-17`, `2500-01-01`, 1), 422},
		{"body too large", `{"name":"` + strings.Repeat("a", 4096) + `"}`, http.StatusRequestEntityTooLarge},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if w := post(tc.body); w.Code != tc.want {
				t.Fatalf("got %d (%s), want %d", w.Code, w.Body.String(), tc.want)
			}
		})
	}
}

// Zero is a valid coordinate (equator / prime meridian) and must pass
// validation. It then reaches the nil service and panics, which proves it got
// past every check.
func TestCalculate_ZeroCoordinatesPassValidation(t *testing.T) {
	body := strings.NewReplacer(`"latitude":21.03`, `"latitude":0`, `"longitude":105.85`, `"longitude":0`).Replace(validBody)
	defer func() {
		if recover() == nil {
			t.Fatal("expected request with 0,0 to pass validation and reach the service")
		}
	}()
	post(body)
}
