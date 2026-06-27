# Zodiac Astrology App

This project consists of a Next.js React frontend and a Go backend.

## Prerequisites
- **Node.js** (v18+) and **npm**
- **Go** (v1.20+)
- **Docker** and **Docker Compose** (for PostgreSQL and Redis)

---

## 1. Start Infrastructure (Database & Cache)

The backend requires PostgreSQL and Redis. A Docker Compose file is provided at the root of the project to spin these up.

```bash
# From the project root directory
docker compose up -d
```

This will start PostgreSQL on port `5432` and Redis on port `6379`.

---

## 2. Start the Backend (API)

The backend is a Go application that manages business logic, astrology calculations, and the database.

```bash
# Navigate to the backend directory
cd backend

# Install Go dependencies
go mod tidy

# Run the API server
# (Database migrations will run automatically on startup)
go run ./cmd/api
```

The backend server will start and listen on **http://localhost:8080**.

---

## 3. Start the Frontend (UI)

The frontend is a Next.js web application.

```bash
# Open a new terminal tab and navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Next.js development server
npm run dev
```

The frontend will start and be available at **http://localhost:3000**.

---

## Stopping the App

When you're done, you can stop the infrastructure containers:

```bash
# From the project root directory
docker compose down
```
