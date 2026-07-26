package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zodiac/backend/internal/adapter/middleware"
	"github.com/zodiac/backend/internal/app"
	"github.com/zodiac/backend/internal/config"
	"github.com/zodiac/backend/internal/infrastructure/logger"
)

// Router holds all handler dependencies and configures the Gin engine.
type Router struct {
	engine    *gin.Engine
	cfg       *config.Config
	log       *logger.Logger
	container *app.Container
}

// NewRouter constructs the Gin router with all middleware and route groups registered.
func NewRouter(cfg *config.Config, log *logger.Logger, container *app.Container) *Router {
	if !cfg.App.Debug {
		gin.SetMode(gin.ReleaseMode)
	}

	engine := gin.New()

	// Global middleware stack (order is critical)
	engine.Use(middleware.Recovery(log))
	engine.Use(middleware.RequestLogger(log))
	engine.Use(middleware.CORS(middleware.DefaultCORSConfig()))
	engine.Use(middleware.ErrorHandler())

	r := &Router{engine: engine, cfg: cfg, log: log, container: container}
	r.registerRoutes()

	return r
}

func (r *Router) registerRoutes() {
	// ── Health endpoints (no auth required) ───────────────────────────────────
	r.engine.GET("/health", r.handleHealth)
	r.engine.GET("/ready", r.handleReady)

	// ── Instantiate handlers ──────────────────────────────────────────────────
	zapLog := r.log.Logger
	chartH := NewChartHandler(r.container.ChartService, zapLog)
	interpH := NewInterpretationHandler(r.container.InterpretationService, zapLog)

	v1 := r.engine.Group("/api/v1")
	{
		// ── Public routes ─────────────────────────────────────────────────────
		charts := v1.Group("/charts")
		{
			// POST /api/v1/charts/calculate
			charts.POST("/calculate", chartH.Calculate)
			// GET  /api/v1/charts/:id
			charts.GET("/:id", chartH.GetByID)
			// GET  /api/v1/charts/:id/interpretations?lang=en|vi
			charts.GET("/:id/interpretations", interpH.GetByChartID)
		}
	}
}

// Handler returns the underlying http.Handler for use in net/http servers.
func (r *Router) Handler() http.Handler {
	return r.engine
}

func (r *Router) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (r *Router) handleReady(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ready"})
}

func (r *Router) handleNotImplemented(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "this endpoint is not yet implemented",
	})
}
