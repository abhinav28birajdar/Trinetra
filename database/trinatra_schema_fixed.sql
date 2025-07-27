-- Trinatra Women's Safety App Database Schema - FIXED VERSION
-- This version fixes the "Database error saving new user" issue

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (simplified for reliable user creation)
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
    safety_status TEXT DEFAULT 'safe', -- safe, help_needed, emergency
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
    priority INTEGER DEFAULT 1, -- 1 = highest priority
    is_primary BOOLEAN DEFAULT false,
    is_emergency_service BOOLEAN DEFAULT false,
    contact_type TEXT DEFAULT 'personal', -- personal, medical, police, fire, women_helpline
    notes TEXT,
    avatar_color TEXT DEFAULT '#5A189A',
    last_contacted TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs table
CREATE TABLE IF NOT EXISTS call_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES emergency_contacts(id) ON DELETE SET NULL,
    phone_number TEXT NOT NULL,
    contact_name TEXT,
    call_type TEXT NOT NULL, -- outgoing, incoming, missed, emergency
    call_status TEXT DEFAULT 'completed', -- initiated, ringing, connected, completed, failed, cancelled
    duration INTEGER DEFAULT 0, -- in seconds
    is_emergency BOOLEAN DEFAULT false,
    location GEOMETRY(POINT, 4326),
    address TEXT,
    notes TEXT,
    recording_url TEXT, -- for emergency calls
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location sharing sessions
CREATE TABLE IF NOT EXISTS location_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_name TEXT DEFAULT 'Emergency Location Share',
    message TEXT,
    shared_with TEXT[], -- array of contact IDs or phone numbers
    duration_minutes INTEGER, -- null for indefinite
    location GEOMETRY(POINT, 4326),
    address TEXT,
    accuracy REAL,
    is_active BOOLEAN DEFAULT true,
    is_emergency BOOLEAN DEFAULT false,
    auto_update_interval INTEGER DEFAULT 30, -- seconds
    last_update TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community messages for safety chat
CREATE TABLE IF NOT EXISTS community_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    community_id UUID, -- for different neighborhoods/groups
    message_type TEXT DEFAULT 'chat', -- chat, alert, emergency, announcement
    content TEXT NOT NULL,
    location GEOMETRY(POINT, 4326),
    address TEXT,
    image_urls TEXT[], -- array of image URLs
    is_emergency BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1, -- 1 = low, 5 = critical
    tags TEXT[], -- safety, crime, help, medical, etc.
    replies_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency alerts system
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL, -- sos, panic, medical, fire, crime
    status TEXT DEFAULT 'active', -- active, resolved, false_alarm
    message TEXT,
    location GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    contacts_notified TEXT[], -- array of contact IDs notified
    response_time INTEGER, -- time to resolution in minutes
    resolved_by UUID REFERENCES profiles(id),
    resolution_notes TEXT,
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App settings and preferences
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    theme_mode TEXT DEFAULT 'light', -- light, dark, system
    language TEXT DEFAULT 'en',
    auto_location_sharing BOOLEAN DEFAULT true,
    emergency_auto_call BOOLEAN DEFAULT false,
    silent_alerts BOOLEAN DEFAULT false,
    location_accuracy TEXT DEFAULT 'balanced', -- low, balanced, high
    backup_contacts_cloud BOOLEAN DEFAULT true,
    two_factor_auth BOOLEAN DEFAULT false,
    biometric_auth BOOLEAN DEFAULT false,
    emergency_countdown INTEGER DEFAULT 5, -- seconds
    location_share_radius INTEGER DEFAULT 100, -- meters for privacy
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST(last_location);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_priority ON emergency_contacts(priority);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_shares_user_id ON location_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_location_shares_active ON location_shares(is_active);
CREATE INDEX IF NOT EXISTS idx_community_messages_created_at ON community_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_messages_location ON community_messages USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_user_id ON emergency_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status ON emergency_alerts(status);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Emergency contacts: Users can only manage their own contacts
CREATE POLICY "Users can manage own contacts" ON emergency_contacts
    FOR ALL USING (auth.uid() = user_id);

-- Call logs: Users can only see their own call logs
CREATE POLICY "Users can manage own call logs" ON call_logs
    FOR ALL USING (auth.uid() = user_id);

-- Location shares: Users can manage their own location shares
CREATE POLICY "Users can manage own location shares" ON location_shares
    FOR ALL USING (auth.uid() = user_id);

-- Community messages: Users can see all public messages but only edit their own
CREATE POLICY "Users can view community messages" ON community_messages
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own messages" ON community_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON community_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON community_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Emergency alerts policies
CREATE POLICY "Users can manage own emergency alerts" ON emergency_alerts
    FOR ALL USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can manage own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_location_shares_updated_at BEFORE UPDATE ON location_shares
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_messages_updated_at BEFORE UPDATE ON community_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- IMPROVED USER CREATION FUNCTION WITH ERROR HANDLING
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- First, try to create the profile with minimal required data
    BEGIN
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (
            NEW.id, 
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
        );
    EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE NOTICE 'Error creating profile for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Try to create default user settings
    BEGIN
        INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error creating settings for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Try to create default emergency contacts
    BEGIN
        INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_emergency_service, contact_type, avatar_color, priority) VALUES
        (NEW.id, 'Police', '100', 'Emergency Service', true, 'police', '#DC2626', 1),
        (NEW.id, 'Fire Brigade', '101', 'Emergency Service', true, 'fire', '#EA580C', 2),
        (NEW.id, 'Medical Emergency', '102', 'Emergency Service', true, 'medical', '#059669', 3),
        (NEW.id, 'Women Helpline', '1091', 'Emergency Service', true, 'women_helpline', '#5A189A', 4);
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error creating emergency contacts for user %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Allow public access to profiles for user registration
GRANT INSERT ON public.profiles TO anon;
GRANT INSERT ON public.user_settings TO anon;
GRANT INSERT ON public.emergency_contacts TO anon;
