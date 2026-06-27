package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.uber.org/zap"

	"github.com/zodiac/backend/internal/adapter/handler"
	"github.com/zodiac/backend/internal/app"
	"github.com/zodiac/backend/internal/config"
	"github.com/zodiac/backend/internal/infrastructure/cache"
	"github.com/zodiac/backend/internal/infrastructure/database"
	"github.com/zodiac/backend/internal/infrastructure/logger"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "fatal: %v\n", err)
		os.Exit(1)
	}
}

func run() error {
	// 1. Load configuration
	cfg, err := config.Load(".")
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}

	// 2. Initialize structured logger
	log, err := logger.New(cfg.Log.Level, cfg.Log.Format)
	if err != nil {
		return fmt.Errorf("failed to initialize logger: %w", err)
	}
	defer log.Sync()

	log.Info("starting zodiac api",
		zap.String("environment", cfg.App.Environment),
		zap.Int("port", cfg.App.Port),
	)

	// 3. Run database migrations
	if err := database.RunMigrations(cfg.Database.DSN, cfg.Database.MigrationsPath); err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}
	log.Info("database migrations applied")

	// 4. Connect to PostgreSQL
	db, err := database.NewPostgres(cfg.Database)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}
	defer db.Close()
	log.Info("connected to postgresql")

	// 5. Connect to Redis
	redisClient, err := cache.NewRedis(cfg.Redis)
	if err != nil {
		return fmt.Errorf("failed to connect to redis: %w", err)
	}
	defer redisClient.Close()
	log.Info("connected to redis")

	// 6. Wire all application dependencies
	container := app.NewContainer(cfg, log, db, redisClient)

	// 7. Build HTTP router
	router := handler.NewRouter(cfg, log, container)

	// 8. Configure and start the HTTP server
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.App.Port),
		Handler:      router.Handler(),
		ReadTimeout:  cfg.App.ReadTimeout,
		WriteTimeout: cfg.App.WriteTimeout,
		IdleTimeout:  60 * time.Second,
	}

	// 9. Start server in a goroutine so shutdown logic can proceed
	serverErrors := make(chan error, 1)
	go func() {
		log.Info("http server listening", zap.String("addr", srv.Addr))
		serverErrors <- srv.ListenAndServe()
	}()

	// 10. Graceful shutdown: listen for OS signals or server errors
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-serverErrors:
		if !errors.Is(err, http.ErrServerClosed) {
			return fmt.Errorf("server error: %w", err)
		}
	case sig := <-quit:
		log.Info("shutdown signal received", zap.String("signal", sig.String()))

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		if err := srv.Shutdown(ctx); err != nil {
			return fmt.Errorf("graceful shutdown failed: %w", err)
		}
		log.Info("server shut down gracefully")
	}

	return nil
}
