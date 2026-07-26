-- We can't fully revert because birth_profiles data is lost.
-- But we can recreate the table structure for rollback purposes.
CREATE TABLE IF NOT EXISTS birth_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    city VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE natal_charts ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES birth_profiles(id) ON DELETE CASCADE;

ALTER TABLE natal_charts DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE natal_charts DROP COLUMN IF EXISTS name CASCADE;
ALTER TABLE natal_charts DROP COLUMN IF EXISTS birth_date CASCADE;
ALTER TABLE natal_charts DROP COLUMN IF EXISTS birth_time CASCADE;
ALTER TABLE natal_charts DROP COLUMN IF EXISTS timezone CASCADE;
ALTER TABLE natal_charts DROP COLUMN IF EXISTS latitude CASCADE;
ALTER TABLE natal_charts DROP COLUMN IF EXISTS longitude CASCADE;
ALTER TABLE natal_charts DROP COLUMN IF EXISTS city CASCADE;
