ALTER TABLE users
ADD COLUMN password_reset_token_hash VARCHAR(255),
ADD COLUMN password_reset_expires_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users (password_reset_token_hash);
