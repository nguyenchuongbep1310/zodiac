# Build Stage
FROM golang:1.24-alpine AS builder

# Install build tools & git
RUN apk add --no-cache gcc musl-dev git make curl

WORKDIR /app

# Download Swiss Ephemeris C source and compile libswe.a for Linux target (only core library C files)
RUN git clone --depth 1 https://github.com/aloistr/swisseph.git /tmp/swisseph && \
    gcc -O2 -c \
      /tmp/swisseph/swecl.c \
      /tmp/swisseph/swedate.c \
      /tmp/swisseph/swehouse.c \
      /tmp/swisseph/swejpl.c \
      /tmp/swisseph/swemmoon.c \
      /tmp/swisseph/swemplan.c \
      /tmp/swisseph/sweph.c \
      /tmp/swisseph/swephlib.c \
      /tmp/swisseph/swehel.c \
      -I/tmp/swisseph && \
    ar rcs libswe.a *.o && \
    rm -f *.o && \
    rm -rf /tmp/swisseph

# Copy go module dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source files
COPY . .

# Compile Go API with CGO enabled
RUN CGO_ENABLED=1 GOOS=linux go build -o api ./cmd/api

# Final Stage
FROM alpine:latest

RUN apk add --no-cache ca-certificates libc6-compat tzdata

WORKDIR /app

# Copy binary, ephe data files, and migrations from builder stage
COPY --from=builder /app/api ./
COPY --from=builder /app/ephe ./ephe
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080

CMD ["./api"]
