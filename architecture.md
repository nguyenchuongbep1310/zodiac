# Zodiac - Astrology Platform Architecture

## 1. High-Level Architecture

The platform is designed as a modular monolith with a modern, decoupled frontend. 

- **Frontend (Next.js 15, TypeScript):** A robust, server-side rendered application providing an interactive UI for natal charts and interpretations.
- **Backend (Go 1.22, Gin):** A high-performance API serving as the orchestration layer for domain logic, database operations, and caching. 
- **Astrology Engine:** The core astrological calculation logic relies on the high-precision **Swiss Ephemeris** C library, integrated into the Go backend via `cgo`.
- **Data Persistence (PostgreSQL):** Relational storage for user accounts, birth profiles, and generated interpretations.
- **Caching Layer (Redis):** Acts as a low-latency cache for computationally expensive chart calculations and frequent API responses.

## 2. C4 Container Diagram (ASCII)

```text
+-----------------------------------------------------------------------------------+
|                                 System Boundary                                   |
|                                                                                   |
|  +-----------------------+              +--------------------------------------+  |
|  |                       |              |                                      |  |
|  |    Web Application    | ====REST====>|        API Gateway / App Layer       |  |
|  | (Next.js 15 + React)  |   (JSON)     |          (Go 1.22 + Gin)             |  |
|  |                       |              |                                      |  |
|  +-----------------------+              +--------------------------------------+  |
|                                            |                 |                 |  |
|                                          CGO Wrapper         |                 |  |
|                                            |                 |                 |  |
|  +-----------------------+              +--v---------------+ | +-------------+ |  |
|  |                       |              |                  | | |             | |  |
|  |   Ephemeris Data      | <---Reads--- | Swiss Ephemeris  | | |    Redis    | |  |
|  |   Files (*.se1)       |              |    (C-Library)   | | |    Cache    | |  |
|  |                       |              |                  | | |             | |  |
|  +-----------------------+              +------------------+ | +-------------+ |  |
|                                                              |                 |  |
|                                                              | +-------------+ |  |
|                                                              | |             | |  |
|                                                              v | PostgreSQL  | |  |
|                                                                |   Database  | |  |
|                                                                |             | |  |
|                                                                +-------------+ |  |
+-----------------------------------------------------------------------------------+
```

## 3. Bounded Contexts

1. **Identity & Access Management (IAM):** 
   - Responsible for user registration, authentication (JWT), authorization, and session management.
2. **Profile Management:**
   - Manages subjects' metadata required for chart generation. Handles birth dates, times, geographic coordinates, and timezones.
3. **Astrology Engine:**
   - The highly mathematical context. Calculates exact planetary longitudes, house cusps (Placidus, Koch, etc.), and mathematical aspects (trine, square, conjunct).
4. **Interpretation Engine:**
   - The semantic context. Matches calculated astrological data against a repository of interpretative text to generate human-readable insights.

## 4. Domain Aggregates

- **User Aggregate**
  - *Root:* `User` (ID, Email, PasswordHash, Status)
  - *Value Objects:* `Preferences` (House system preference, Orbs limits)
- **Birth Profile Aggregate**
  - *Root:* `BirthProfile` (ID, UserID, Name)
  - *Value Objects:* `Location` (Latitude, Longitude, City), `BirthTime` (UTC Time, Local Time, TimeZone)
- **Natal Chart Aggregate**
  - *Root:* `NatalChart` (ID, ProfileID)
  - *Entities:* `PlanetPosition` (Planet ID, Sign, Longitude, Retrograde), `HouseCusp` (House Number, Sign, Longitude)
  - *Value Objects:* `Aspect` (Planet A, Planet B, Aspect Type, Orb)
- **Interpretation Aggregate**
  - *Root:* `ChartInterpretation` (ID, ChartID)
  - *Entities:* `PlanetInSignRule`, `PlanetInHouseRule`, `AspectRule`

## 5. Clean Architecture Structure (Backend)

The Go backend adheres to Clean Architecture principles, ensuring the business logic remains independent of the delivery mechanism and external integrations.

```text
├── cmd/
│   └── api/                  # Application entry point (main.go)
├── internal/
│   ├── domain/               # Core business logic (Entities, Interfaces)
│   │   ├── user.go
│   │   ├── profile.go
│   │   └── chart.go
│   ├── usecase/              # Application specific business rules
│   │   ├── calculate_chart.go
│   │   └── create_profile.go
│   ├── adapter/              # Interface adapters
│   │   ├── handler/          # Delivery: HTTP handlers (Gin controllers)
│   │   ├── repository/       # Data: PostgreSQL implementation
│   │   └── cache/            # Cache: Redis implementation
│   └── infrastructure/       # Frameworks and drivers
│       ├── database/         # Postgres connections and migrations
│       ├── swe/              # CGO wrapper for Swiss Ephemeris
│       └── logger/           # Structured logging configuration
├── ephe/                     # Swiss Ephemeris data files (.se1)
└── go.mod
```

## 6. Service Boundaries

While deployed as a single modular monolith for performance and operational simplicity, the system maintains strict logical boundaries:

- **`AuthService`**: Handles login, JWT generation, and password resets.
- **`ProfileService`**: CRUD operations for birth profiles. Interacts with the Geocoding API if timezone lookups are required.
- **`CalculationService`**: Isolated boundary for Ephemeris interactions. Exposed internally to avoid tightly coupling the web layer to CGO.
- **`InterpretationService`**: Queries the `CalculationService` for raw data, then accesses the repository to fetch the corresponding interpretation blocks.

## 7. Event Flows

The system relies on asynchronous events for non-critical path operations to ensure fast API responses.

1. **Profile Creation Flow:**
   - **Trigger:** `POST /api/v1/profiles`
   - **Action:** Validates data, geocodes coordinates (if needed), saves to PostgreSQL.
   - **Event:** Emits `ProfileCreatedEvent`.
2. **Chart Calculation Flow:**
   - **Trigger:** `GET /api/v1/charts/{profile_id}`
   - **Action:** 
     1. Check Redis Cache for pre-calculated chart.
     2. If Miss: `CalculationService` invokes Swiss Ephemeris.
     3. Save result to PostgreSQL and populate Redis Cache.
   - **Response:** Returns JSON of planets, houses, and aspects.
3. **Background Interpretation Pre-calculation (Optional/Optimization):**
   - **Trigger:** Listens for `ProfileCreatedEvent`.
   - **Action:** Asynchronously calculates the chart and caches the standard interpretation to ensure instant load times when the user navigates to the chart view.

## 8. Deployment Topology

Designed for high availability, zero-downtime deployments, and optimal read performance.

- **DNS & CDN:** Cloudflare or Route 53 pointing to the frontend hosting.
- **Frontend App:** Hosted on Vercel or AWS Amplify (Node.js runtime for Next.js 15 SSR).
- **API Gateway/Load Balancer:** AWS ALB routing traffic to the backend instances.
- **Backend Compute:** AWS ECS (Fargate) or EKS cluster running the Go 1.22 Docker containers.
  - *Note:* The Docker image contains both the Go binary and the `.se1` Swiss Ephemeris data files to ensure zero-latency disk reads during calculation.
- **Database:** Amazon RDS for PostgreSQL (Multi-AZ) for reliable, persistent storage.
- **Cache:** Amazon ElastiCache (Redis) for ephemeral state, session management, and chart calculation caching.
- **Monitoring:** OpenTelemetry instrumentation sending traces and metrics to Datadog or Prometheus/Grafana.
