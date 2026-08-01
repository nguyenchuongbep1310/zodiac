package cache

import (
	"context"
	"crypto/tls"
	"fmt"
	"strings"

	"github.com/redis/go-redis/v9"
	"github.com/zodiac/backend/internal/config"
)

// NewRedis establishes a Redis client with connection pool settings and validates connectivity.
func NewRedis(cfg config.RedisConfig) (*redis.Client, error) {
	var opts *redis.Options

	if strings.HasPrefix(cfg.Address, "rediss://") || strings.HasPrefix(cfg.Address, "redis://") {
		var err error
		opts, err = redis.ParseURL(cfg.Address)
		if err != nil {
			return nil, fmt.Errorf("cache: failed to parse redis URL: %w", err)
		}
	} else {
		opts = &redis.Options{
			Addr:        cfg.Address,
			Password:    cfg.Password,
			DB:          cfg.DB,
			PoolSize:    cfg.PoolSize,
			DialTimeout: cfg.DialTimeout,
		}
		if strings.Contains(cfg.Address, "upstash.io") {
			opts.TLSConfig = &tls.Config{
				InsecureSkipVerify: false,
			}
		}
	}

	client := redis.NewClient(opts)

	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("cache: failed to connect to Redis: %w", err)
	}

	return client, nil
}
