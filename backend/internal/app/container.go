package app

import (
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"

	adapterrepo "github.com/zodiac/backend/internal/adapter/repository"
	"github.com/zodiac/backend/internal/app/service"
	"github.com/zodiac/backend/internal/astrology"
	"github.com/zodiac/backend/internal/config"
	domrepo "github.com/zodiac/backend/internal/domain/repository"
	"github.com/zodiac/backend/internal/infrastructure/logger"
)

// Container is the application's dependency injection container.
// It wires all infrastructure, adapters, and use-cases together.
// All fields are exported to allow easy access from main.
type Container struct {
	Config *config.Config
	Logger *logger.Logger
	DB     *sqlx.DB
	Redis  *redis.Client

	// Repositories
	ChartRepo          domrepo.ChartRepository
	InterpretationRepo domrepo.InterpretationRepository

	// Services
	ChartService           *service.ChartService
	InterpretationService  *service.InterpretationService
}

// NewContainer constructs and wires all application dependencies.
func NewContainer(
	cfg *config.Config,
	log *logger.Logger,
	db *sqlx.DB,
	redisClient *redis.Client,
) *Container {
	// logger.Logger embeds *zap.Logger directly.
	zapLog := log.Logger

	// ── Repositories ──────────────────────────────────────────────────────────
	chartRepo := adapterrepo.NewPostgresChartRepository(db)
	interpRepo := adapterrepo.NewPostgresInterpretationRepository(db)

	// ── Astrology calculation engine ──────────────────────────────────────────
	calculator := astrology.NewNatalChartCalculator(cfg.App.EphePath)

	// ── Services ──────────────────────────────────────────────────────────────
	chartSvc := service.NewChartService(chartRepo, calculator, cfg.App.EphePath, zapLog)
	interpSvc := service.NewInterpretationService(interpRepo, chartRepo, zapLog)

	return &Container{
		Config: cfg,
		Logger: log,
		DB:     db,
		Redis:  redisClient,

		ChartRepo:          chartRepo,
		InterpretationRepo: interpRepo,

		ChartService:          chartSvc,
		InterpretationService: interpSvc,
	}
}
