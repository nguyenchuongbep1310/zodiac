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
	UserRepo           domrepo.UserRepository
	ProfileRepo        domrepo.ProfileRepository
	ChartRepo          domrepo.ChartRepository
	InterpretationRepo domrepo.InterpretationRepository

	// Services
	AuthService            *service.AuthService
	ProfileService         *service.ProfileService
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
	userRepo := adapterrepo.NewPostgresUserRepository(db)
	profileRepo := adapterrepo.NewPostgresProfileRepository(db)
	chartRepo := adapterrepo.NewPostgresChartRepository(db)
	interpRepo := adapterrepo.NewPostgresInterpretationRepository(db)

	// ── Astrology calculation engine ──────────────────────────────────────────
	calculator := astrology.NewNatalChartCalculator(cfg.App.EphePath)

	// ── Services ──────────────────────────────────────────────────────────────
	authSvc := service.NewAuthService(userRepo, cfg, redisClient, zapLog)
	profileSvc := service.NewProfileService(profileRepo, zapLog)
	chartSvc := service.NewChartService(chartRepo, profileRepo, calculator, cfg.App.EphePath, zapLog)
	interpSvc := service.NewInterpretationService(interpRepo, chartRepo, profileRepo, zapLog)

	return &Container{
		Config: cfg,
		Logger: log,
		DB:     db,
		Redis:  redisClient,

		UserRepo:           userRepo,
		ProfileRepo:        profileRepo,
		ChartRepo:          chartRepo,
		InterpretationRepo: interpRepo,

		AuthService:           authSvc,
		ProfileService:        profileSvc,
		ChartService:          chartSvc,
		InterpretationService: interpSvc,
	}
}
