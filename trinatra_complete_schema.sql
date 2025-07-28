-- Trinatra Safety App - Complete Database Schema
-- Comprehensive database for personal safety and emergency management

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    emergency_message TEXT DEFAULT 'I need immediate help! Please contact me or call emergency services.',
    blood_group TEXT,
    medical_conditions TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    emergency_contact_1 TEXT,
    emergency_contact_2 TEXT,
    location_sharing_enabled BOOLEAN DEFAULT true,
    push_notifications_enabled BOOLEAN DEFAULT true,
    dark_mode_enabled BOOLEAN DEFAULT false,
    last_location GEOMETRY(POINT, 4326),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    safety_status TEXT DEFAULT 'safe',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    relationship TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    is_primary BOOLEAN DEFAULT false,
    is_emergency_service BOOLEAN DEFAULT false,
    contact_type TEXT DEFAULT 'personal',
    notes TEXT,
    avatar_color TEXT DEFAULT '#5A189A',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs table
CREATE TABLE IF NOT EXISTS call_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    contact_name TEXT,
    call_type TEXT NOT NULL, -- 'incoming', 'outgoing', 'missed'
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration INTEGER DEFAULT 0, -- in seconds
    is_emergency BOOLEAN DEFAULT false,
    location GEOMETRY(POINT, 4326),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location sharing sessions
CREATE TABLE IF NOT EXISTS location_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_name TEXT,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    shared_with TEXT[], -- Array of contact IDs or phone numbers
    share_type TEXT DEFAULT 'emergency', -- emergency, family, friends, custom
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location points for tracking
CREATE TABLE IF NOT EXISTS location_points (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES location_shares(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location GEOMETRY(POINT, 4326) NOT NULL,
    accuracy FLOAT,
    altitude FLOAT,
    speed FLOAT,
    heading FLOAT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    battery_level INTEGER,
    is_emergency BOOLEAN DEFAULT false
);

-- Emergency incidents table
CREATE TABLE IF NOT EXISTS emergency_incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    incident_type TEXT NOT NULL, -- 'medical', 'harassment', 'theft', 'accident', 'other'
    severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    description TEXT,
    location GEOMETRY(POINT, 4326),
    address TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'resolved', 'false_alarm'
    contacts_notified TEXT[],
    response_time INTEGER, -- seconds
    resolved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community messages table
CREATE TABLE IF NOT EXISTS community_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'general', -- 'general', 'alert', 'emergency', 'tip'
    location GEOMETRY(POINT, 4326),
    area_radius INTEGER DEFAULT 5000, -- meters
    is_anonymous BOOLEAN DEFAULT false,
    is_emergency BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    reports_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community message interactions
CREATE TABLE IF NOT EXISTS message_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES community_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL, -- 'like', 'report', 'view'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, interaction_type)
);

-- Safety tips table
CREATE TABLE IF NOT EXISTS safety_tips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL, -- 'general', 'travel', 'online', 'workplace', 'emergency'
    priority INTEGER DEFAULT 1,
    is_featured BOOLEAN DEFAULT false,
    image_url TEXT,
    tags TEXT[],
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User safety check-ins
CREATE TABLE IF NOT EXISTS safety_checkins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- 'safe', 'needs_help', 'emergency'
    message TEXT,
    location GEOMETRY(POINT, 4326),
    scheduled_time TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    is_automated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push notification tokens
CREATE TABLE IF NOT EXISTS push_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'ios', 'android', 'web'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, token)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_last_location ON profiles USING GIST(last_location);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_shares_user_id ON location_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_location_points_session_id ON location_points(session_id);
CREATE INDEX IF NOT EXISTS idx_location_points_location ON location_points USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_emergency_incidents_user_id ON emergency_incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_incidents_location ON emergency_incidents USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_community_messages_location ON community_messages USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_community_messages_created_at ON community_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safety_checkins_user_id ON safety_checkins(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can manage own emergency contacts" ON emergency_contacts FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for call_logs
CREATE POLICY "Users can manage own call logs" ON call_logs FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for location_shares
CREATE POLICY "Users can manage own location shares" ON location_shares FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for location_points
CREATE POLICY "Users can manage own location points" ON location_points FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for emergency_incidents
CREATE POLICY "Users can manage own emergency incidents" ON emergency_incidents FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for community_messages
CREATE POLICY "Anyone can view active community messages" ON community_messages FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create community messages" ON community_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own community messages" ON community_messages FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for message_interactions
CREATE POLICY "Users can manage own message interactions" ON message_interactions FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for safety_checkins
CREATE POLICY "Users can manage own safety check-ins" ON safety_checkins FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for push_tokens
CREATE POLICY "Users can manage own push tokens" ON push_tokens FOR ALL USING (auth.uid() = user_id);

-- Safety tips are public read-only
CREATE POLICY "Anyone can view active safety tips" ON safety_tips FOR SELECT USING (is_active = true);

-- Functions for location-based queries
CREATE OR REPLACE FUNCTION get_nearby_users(
    center_lat FLOAT,
    center_lng FLOAT,
    radius_meters INTEGER DEFAULT 1000
)
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    distance_meters FLOAT
)
LANGUAGE SQL
AS $$
    SELECT 
        p.id,
        p.full_name,
        ST_Distance(
            ST_GeogFromText('POINT(' || center_lng || ' ' || center_lat || ')'),
            ST_GeogFromText(ST_AsText(p.last_location))
        ) as distance_meters
    FROM profiles p
    WHERE p.last_location IS NOT NULL
        AND ST_DWithin(
            ST_GeogFromText('POINT(' || center_lng || ' ' || center_lat || ')'),
            ST_GeogFromText(ST_AsText(p.last_location)),
            radius_meters
        )
        AND p.location_sharing_enabled = true
        AND p.is_active = true
    ORDER BY distance_meters;
$$;

-- Function to create new user profile
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER create_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_for_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_location_shares_updated_at BEFORE UPDATE ON location_shares
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_incidents_updated_at BEFORE UPDATE ON emergency_incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_messages_updated_at BEFORE UPDATE ON community_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_tokens_updated_at BEFORE UPDATE ON push_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default safety tips
INSERT INTO safety_tips (title, content, category, priority, is_featured) VALUES
('Emergency Numbers', 'Always keep these numbers handy: Police (100), Fire (101), Medical (102), Women Helpline (1091)', 'emergency', 1, true),
('Share Your Location', 'Always inform trusted contacts about your whereabouts, especially when traveling alone', 'travel', 2, true),
('Trust Your Instincts', 'If something feels wrong, trust your gut feeling and remove yourself from the situation', 'general', 3, true),
('Stay Alert in Public', 'Be aware of your surroundings, avoid distractions like phones in unfamiliar areas', 'general', 4, false),
('Safe Transportation', 'Use verified taxi services, share ride details with contacts, sit behind the driver', 'travel', 5, false);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profile information with safety preferences';
COMMENT ON TABLE emergency_contacts IS 'Emergency contacts for each user';
COMMENT ON TABLE call_logs IS 'Log of all calls made through the app';
COMMENT ON TABLE location_shares IS 'Live location sharing sessions';
COMMENT ON TABLE emergency_incidents IS 'Emergency incidents reported by users';
COMMENT ON TABLE community_messages IS 'Community safety messages and alerts';
COMMENT ON TABLE safety_tips IS 'Safety tips and guidelines for users';
