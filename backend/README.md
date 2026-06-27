# Zodiac Backend

## Project Structure

```
backend/
├── cmd/
│   └── api/
│       └── main.go                 # Entrypoint: boot sequence & graceful shutdown
├── internal/
│   ├── app/
│   │   └── container.go            # Dependency injection container
│   ├── config/
│   │   └── config.go               # Viper config loading + validation
│   ├── domain/                     # Pure domain layer — no external dependencies
│   │   ├── errors.go               # Transport-agnostic AppError type
│   │   ├── user.go                 # User aggregate root
│   │   ├── profile.go              # BirthProfile aggregate root
│   │   ├── chart.go                # NatalChart aggregate root
│   │   └── repository/
│   │       └── interfaces.go       # Repository interfaces (ports)
│   ├── adapter/                    # Adapters (implements ports, talks to delivery)
│   │   ├── middleware/
│   │   │   ├── auth.go             # JWT Bearer auth + RBAC
│   │   │   ├── cors.go             # CORS with configurable origins
│   │   │   ├── error_handler.go    # Centralized JSON error responses
│   │   │   ├── recovery.go         # Panic recovery with stack trace logging
│   │   │   └── request_logger.go   # Structured per-request zap logging
│   │   ├── handler/
│   │   │   └── router.go           # Gin engine, middleware stack, route groups
│   │   └── repository/
│   │       ├── user_repository.go  # PostgreSQL UserRepository
│   │       ├── profile_repository.go # PostgreSQL ProfileRepository
│   │       └── chart_repository.go # PostgreSQL ChartRepository (transactional)
│   └── infrastructure/
│       ├── database/
│       │   └── postgres.go         # sqlx connection pool + migrate integration
│       ├── cache/
│       │   └── redis.go            # go-redis client with pool config
│       └── logger/
│           └── logger.go           # Zap structured logger (JSON/console)
├── migrations/                     # golang-migrate SQL files
├── config.yaml                     # Local development config
└── go.mod
```

## Running Locally (Full Stack)

For complete instructions covering both Frontend and Backend, please see the [root README.md](../README.md).

Quick start for backend development:
```bash
# 1. Start infrastructure (from project root)
cd .. && docker compose up -d postgres redis && cd backend

# 2. Install dependencies
go mod tidy

# 3. Run the API (migrations run automatically)
# Ensure you have the ephemeris data in the ephe/ folder (see config.yaml)
go run ./cmd/api
```

## Environment Variables

All config values can be overridden with `ZODIAC_` prefixed environment variables:

| Variable | Description |
|---|---|
| `ZODIAC_DATABASE_DSN` | PostgreSQL DSN |
| `ZODIAC_REDIS_ADDRESS` | Redis address |
| `ZODIAC_JWT_SECRET` | JWT signing secret (min 32 chars) |
| `ZODIAC_APP_PORT` | HTTP listen port |
| `ZODIAC_LOG_LEVEL` | Log level: `debug`, `info`, `warn`, `error` |

## Architectural Decisions

- **Clean Architecture**: The `domain` package has zero external dependencies. All infrastructure knowledge flows inward via interfaces.
- **Flat DB Records**: Separate `*Record` structs with `db:` tags are used for scanning, keeping domain entities clean.
- **Compile-time Interface Assertions**: Each repository implementation uses `var _ Interface = (*Impl)(nil)` to catch interface drift at compile time, not runtime.
- **Transactional Chart Persistence**: `ChartRepository.Save` wraps all planet, house, and aspect inserts in a single transaction to prevent partial writes.
- **Graceful Shutdown**: A 30-second drain period ensures in-flight requests complete before the process exits.
