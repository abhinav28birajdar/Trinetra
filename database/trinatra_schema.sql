-- Trinatra Safety App - Complete Database Schema
-- A comprehensive schema for the personal safety application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to avoid conflicts (remove these lines in production)
DROP TABLE IF EXISTS location_points;
DROP TABLE IF EXISTS location_shares;
DROP TABLE IF EXISTS call_logs;
DROP TABLE IF EXISTS emergency_contacts;
DROP TABLE IF EXISTS profiles;

-- Profiles table - Stores user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT, -- Removed UNIQUE constraint to avoid registration issues
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    emergency_message TEXT DEFAULT 'I need immediate help! Please contact me or emergency services.',
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
    last_location GEOMETRY(POINT, 4326) NULL, -- Explicitly nullable
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    safety_status TEXT DEFAULT 'safe',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency contacts table - Stores emergency contacts for each user
CREATE TABLE public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    relationship TEXT,
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

-- Call logs table - Records of emergency calls made through the app
CREATE TABLE public.call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.emergency_contacts(id) ON DELETE SET NULL,
    phone_number TEXT NOT NULL,
    contact_name TEXT,
    call_type TEXT NOT NULL, -- 'incoming', 'outgoing', 'missed', 'emergency'
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration INTEGER DEFAULT 0, -- in seconds
    is_emergency BOOLEAN DEFAULT false,
    location GEOMETRY(POINT, 4326),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location sharing sessions table - Records of location sharing
CREATE TABLE public.location_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_name TEXT,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    shared_with TEXT[], -- Array of contact IDs or phone numbers
    share_type TEXT DEFAULT 'emergency', -- emergency, family, friends, custom
    message TEXT DEFAULT 'Sharing my location for safety',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location points table - Individual location points recorded during sharing
CREATE TABLE public.location_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.location_shares(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    location GEOMETRY(POINT, 4326) NOT NULL,
    accuracy FLOAT,
    altitude FLOAT,
    speed FLOAT,
    heading FLOAT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    battery_level INTEGER,
    is_emergency BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_points ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public insert access to profiles" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- RLS Policies for emergency contacts
CREATE POLICY "Users can view own contacts" ON public.emergency_contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts" ON public.emergency_contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" ON public.emergency_contacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts" ON public.emergency_contacts
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for call logs
CREATE POLICY "Users can view own call logs" ON public.call_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert call logs" ON public.call_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for location sharing
CREATE POLICY "Users can view own location shares" ON public.location_shares
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own location shares" ON public.location_shares
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for location points
CREATE POLICY "Users can view own location points" ON public.location_points
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own location points" ON public.location_points
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        username,
        created_at,
        updated_at
    ) VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        split_part(new.email, '@', 1),
        now(),
        now()
    );
    RETURN new;
EXCEPTION
    WHEN others THEN
        -- Log the error (in a real system you'd want better error handling)
        RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
        RETURN new; -- Continue even if there's an error
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to execute the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add default emergency services contact for all users
-- This function will run once to add emergency services to existing users
CREATE OR REPLACE FUNCTION public.add_default_emergency_service()
RETURNS void AS $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM public.profiles
    LOOP
        -- Only insert if the user doesn't already have an emergency service contact
        IF NOT EXISTS (
            SELECT 1 FROM public.emergency_contacts 
            WHERE user_id = user_record.id AND is_emergency_service = true
        ) THEN
            INSERT INTO public.emergency_contacts (
                user_id, 
                name, 
                phone, 
                relationship, 
                is_emergency_service, 
                contact_type, 
                priority,
                avatar_color
            ) VALUES (
                user_record.id, 
                'Emergency Services', 
                '911', 
                'Emergency', 
                true, 
                'emergency', 
                0,
                '#DC2626'
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to add emergency contacts to existing users
SELECT public.add_default_emergency_service();

-- Create a trigger to add emergency services contact for new users
CREATE OR REPLACE FUNCTION public.add_emergency_service_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.emergency_contacts (
        user_id, 
        name, 
        phone, 
        relationship, 
        is_emergency_service, 
        contact_type, 
        priority,
        avatar_color
    ) VALUES (
        NEW.id, 
        'Emergency Services', 
        '911', 
        'Emergency', 
        true, 
        'emergency', 
        0,
        '#DC2626'
    );
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        -- Log the error but continue
        RAISE LOG 'Error in add_emergency_service_for_new_user trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to add emergency contact when a new profile is created
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.add_emergency_service_for_new_user();
-- Single comprehensive schema file for the Trinatra Safety App

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist to prevent conflicts
DROP TABLE IF EXISTS location_points;
DROP TABLE IF EXISTS location_shares;
DROP TABLE IF EXISTS call_logs;
DROP TABLE IF EXISTS emergency_contacts;
DROP TABLE IF EXISTS profiles;

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT, -- No UNIQUE constraint to avoid registration issues
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
    last_location GEOMETRY(POINT, 4326) NULL,
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    safety_status TEXT DEFAULT 'safe',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES emergency_contacts(id) ON DELETE SET NULL,
    phone_number TEXT NOT NULL,
    contact_name TEXT,
    call_type TEXT NOT NULL, -- 'incoming', 'outgoing', 'missed', 'emergency'
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration INTEGER DEFAULT 0, -- in seconds
    is_emergency BOOLEAN DEFAULT false,
    location GEOMETRY(POINT, 4326),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location sharing sessions
CREATE TABLE IF NOT EXISTS location_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    session_name TEXT,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    shared_with TEXT[], -- Array of contact IDs or phone numbers
    share_type TEXT DEFAULT 'emergency', -- emergency, family, friends, custom
    message TEXT DEFAULT 'Sharing my location for safety',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location points for tracking
CREATE TABLE IF NOT EXISTS location_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES location_shares(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    accuracy FLOAT,
    altitude FLOAT,
    speed FLOAT,
    heading FLOAT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    battery_level INTEGER,
    is_emergency BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_points ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles table policies
CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Public insert access to profiles" 
    ON profiles FOR INSERT 
    WITH CHECK (true);

-- Emergency contacts policies
CREATE POLICY "Users can view own contacts" 
    ON emergency_contacts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own contacts" 
    ON emergency_contacts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" 
    ON emergency_contacts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts" 
    ON emergency_contacts FOR DELETE 
    USING (auth.uid() = user_id);

-- Call logs policies
CREATE POLICY "Users can view own call logs" 
    ON call_logs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call logs" 
    ON call_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call logs" 
    ON call_logs FOR UPDATE 
    USING (auth.uid() = user_id);

-- Location sharing policies
CREATE POLICY "Users can view own location shares" 
    ON location_shares FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own location shares" 
    ON location_shares FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own location shares" 
    ON location_shares FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own location shares" 
    ON location_shares FOR DELETE 
    USING (auth.uid() = user_id);

-- Location points policies
CREATE POLICY "Users can view own location points" 
    ON location_points FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own location points" 
    ON location_points FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Trigger function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    split_part(new.email, '@', 1)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Initial data: Default emergency services
INSERT INTO public.emergency_contacts (user_id, name, phone, relationship, is_emergency_service, contact_type, priority, avatar_color)
SELECT 
  id, 
  'Emergency Services', 
  '911', 
  'Emergency', 
  true, 
  'emergency', 
  0,
  '#DC2626'
FROM public.profiles
ON CONFLICT DO NOTHING;
