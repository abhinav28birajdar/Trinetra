-- Add the is_emergency column to the location_shares table
ALTER TABLE location_shares 
ADD COLUMN IF NOT EXISTS is_emergency BOOLEAN DEFAULT FALSE;

-- Add the user_id and session_id columns to the location_points table if not exists
ALTER TABLE location_points 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES location_shares(id);
