package cache

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
	"github.com/zodiac/backend/internal/config"
)

// NewRedis establishes a Redis client with connection pool settings and validates connectivity.
func NewRedis(cfg config.RedisConfig) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:        cfg.Address,
		Password:    cfg.Password,
		DB:          cfg.DB,
		PoolSize:    cfg.PoolSize,
		DialTimeout: cfg.DialTimeout,
	})

	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("cache: failed to connect to Redis: %w", err)
	}

	return client, nil
}
