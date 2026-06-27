-- Schema version: 1.0.0
-- Database: zodiac_db

-- ENUMS
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE calculation_type AS ENUM ('planet', 'house', 'aspect', 'full_chart');

-- 1. Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    status user_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMPTZ
);

-- 3. Birth Profiles
CREATE TABLE birth_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    city VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Natal Charts
CREATE TABLE natal_charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES birth_profiles(id) ON DELETE CASCADE,
    house_system VARCHAR(20) NOT NULL DEFAULT 'placidus',
    zodiac_system VARCHAR(20) NOT NULL DEFAULT 'tropical',
    is_rectified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Chart Calculations
-- Stores the raw outputs from Swiss Ephemeris
CREATE TABLE chart_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id UUID NOT NULL REFERENCES natal_charts(id) ON DELETE CASCADE,
    calc_type calculation_type NOT NULL,
    ephemeris_version VARCHAR(20) NOT NULL,
    raw_data JSONB NOT NULL,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Planets
CREATE TABLE planets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id UUID NOT NULL REFERENCES natal_charts(id) ON DELETE CASCADE,
    planet_name VARCHAR(50) NOT NULL,
    longitude NUMERIC(10,6) NOT NULL,
    latitude NUMERIC(10,6) NOT NULL,
    speed NUMERIC(10,6) NOT NULL,
    is_retrograde BOOLEAN NOT NULL DEFAULT false,
    sign VARCHAR(20) NOT NULL,
    house_position INTEGER, -- Which house this planet falls into
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (chart_id, planet_name)
);

-- 7. Houses
CREATE TABLE houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id UUID NOT NULL REFERENCES natal_charts(id) ON DELETE CASCADE,
    house_number INTEGER NOT NULL CHECK (house_number BETWEEN 1 AND 12),
    cusp_longitude NUMERIC(10,6) NOT NULL,
    sign VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (chart_id, house_number)
);

-- 8. Aspects
CREATE TABLE aspects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id UUID NOT NULL REFERENCES natal_charts(id) ON DELETE CASCADE,
    planet_1 VARCHAR(50) NOT NULL,
    planet_2 VARCHAR(50) NOT NULL,
    aspect_type VARCHAR(20) NOT NULL,
    orb NUMERIC(5,2) NOT NULL,
    is_applying BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (planet_1 < planet_2), -- Enforce alphabetical order to prevent duplicate combinations
    UNIQUE (chart_id, planet_1, planet_2, aspect_type)
);

-- 9. Interpretation Templates
CREATE TABLE interpretation_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factor_type VARCHAR(50) NOT NULL, -- e.g., 'planet_in_sign', 'aspect'
    factor_value_1 VARCHAR(50) NOT NULL, -- e.g., 'Sun'
    factor_value_2 VARCHAR(50), -- e.g., 'Aries' or 'Moon'
    content TEXT NOT NULL,
    author VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Audit Logs
CREATE TABLE audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_by UUID, -- Can be NULL for system actions
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- INDEXING STRATEGY
-- ==========================================

-- Foreign Key Indexes
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_birth_profiles_user_id ON birth_profiles(user_id);
CREATE INDEX idx_natal_charts_profile_id ON natal_charts(profile_id);
CREATE INDEX idx_chart_calcs_chart_id ON chart_calculations(chart_id);
CREATE INDEX idx_planets_chart_id ON planets(chart_id);
CREATE INDEX idx_houses_chart_id ON houses(chart_id);
CREATE INDEX idx_aspects_chart_id ON aspects(chart_id);

-- Lookup/Search Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_interpretation_factors ON interpretation_templates(factor_type, factor_value_1, factor_value_2) WHERE is_active = true;

-- BRIN Index for Append-Only Audit Logs (PostgreSQL Best Practice for time-series/logs)
CREATE INDEX idx_audit_logs_changed_at ON audit_logs USING BRIN(changed_at);

-- JSONB Indexing (GIN) for deep searching within raw calculation data
CREATE INDEX idx_chart_calcs_raw_data ON chart_calculations USING GIN (raw_data);
