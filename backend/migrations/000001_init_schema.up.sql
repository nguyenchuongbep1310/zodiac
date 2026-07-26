CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES ('admin', 'Administrator'), ('user', 'Standard User') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS natal_charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    city VARCHAR(255) NOT NULL,
    house_system VARCHAR(50) NOT NULL,
    zodiac_system VARCHAR(50) NOT NULL,
    is_rectified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS planets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id UUID REFERENCES natal_charts(id) ON DELETE CASCADE,
    planet_name VARCHAR(50) NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    speed DOUBLE PRECISION NOT NULL,
    is_retrograde BOOLEAN NOT NULL DEFAULT FALSE,
    sign VARCHAR(50) NOT NULL,
    house_position INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id UUID REFERENCES natal_charts(id) ON DELETE CASCADE,
    house_number INTEGER NOT NULL,
    cusp_longitude DOUBLE PRECISION NOT NULL,
    sign VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS aspects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id UUID REFERENCES natal_charts(id) ON DELETE CASCADE,
    planet_1 VARCHAR(50) NOT NULL,
    planet_2 VARCHAR(50) NOT NULL,
    aspect_type VARCHAR(50) NOT NULL,
    orb DOUBLE PRECISION NOT NULL,
    is_applying BOOLEAN NOT NULL DEFAULT FALSE
);
