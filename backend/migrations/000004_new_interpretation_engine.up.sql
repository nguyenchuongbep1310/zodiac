CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Traits Library
CREATE TABLE IF NOT EXISTS traits_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    language VARCHAR(10) NOT NULL, -- 'en' | 'vi'
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Emotional', 'Communication', 'Action', etc.
    polarity INT NOT NULL DEFAULT 0, -- -1, 0, 1
    description TEXT,
    UNIQUE(language, name)
);

-- 2. Structured Placement Interpretations
CREATE TABLE IF NOT EXISTS placement_interpretations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    language VARCHAR(10) NOT NULL,
    factor_type VARCHAR(50) NOT NULL, -- 'planet_in_sign', 'planet_in_house', 'aspect'
    factor_value_1 VARCHAR(50) NOT NULL,
    factor_value_2 VARCHAR(50) NOT NULL,
    factor_value_3 VARCHAR(50),
    core_meaning TEXT NOT NULL,
    real_life TEXT NOT NULL,
    strengths TEXT NOT NULL,
    challenges TEXT NOT NULL,
    relationships TEXT NOT NULL,
    growth_path TEXT NOT NULL,
    key_themes TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(language, factor_type, factor_value_1, factor_value_2, factor_value_3)
);

-- 3. Placement Traits (Join Table for Trait Engine)
CREATE TABLE IF NOT EXISTS placement_traits (
    interpretation_id UUID REFERENCES placement_interpretations(id) ON DELETE CASCADE,
    trait_id UUID REFERENCES traits_library(id) ON DELETE CASCADE,
    weight INT NOT NULL CHECK (weight >= 1 AND weight <= 10),
    PRIMARY KEY (interpretation_id, trait_id)
);

-- 4. Conflict Rules
CREATE TABLE IF NOT EXISTS conflict_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    language VARCHAR(10) NOT NULL,
    trait_id_1 UUID REFERENCES traits_library(id) ON DELETE CASCADE,
    trait_id_2 UUID REFERENCES traits_library(id) ON DELETE CASCADE,
    tension_description TEXT NOT NULL,
    UNIQUE(language, trait_id_1, trait_id_2)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_placement_interp_lookup 
ON placement_interpretations(language, factor_type, factor_value_1, factor_value_2, factor_value_3);

CREATE INDEX IF NOT EXISTS idx_placement_traits_interp 
ON placement_traits(interpretation_id);
