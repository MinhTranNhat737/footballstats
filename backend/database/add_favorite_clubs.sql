-- Add favorite_clubs column to users table (MySQL)
ALTER TABLE users ADD COLUMN favorite_clubs TEXT DEFAULT NULL;

-- Initialize existing users with empty array
UPDATE users SET favorite_clubs = '[]' WHERE favorite_clubs IS NULL;
