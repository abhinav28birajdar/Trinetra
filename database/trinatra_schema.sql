-- Trinatra Safety App Database Schema
-- Complete SQL file for Supabase setup

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    phone_number TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    location_sharing_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Emergency contacts table
CREATE TABLE public.emergency_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    relationship TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safety groups/communities table
CREATE TABLE public.safety_groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    is_public BOOLEAN DEFAULT false,
    location GEOGRAPHY(POINT, 4326),
    radius_meters INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Group memberships table
CREATE TABLE public.group_memberships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.safety_groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(group_id, user_id)
);

-- Emergency alerts table
CREATE TABLE public.emergency_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('panic', 'medical', 'fire', 'police', 'custom')),
    message TEXT,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Live location sharing table
CREATE TABLE public.live_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    accuracy FLOAT,
    heading FLOAT,
    speed FLOAT,
    altitude FLOAT,
    is_sharing BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Chat messages table for group communication
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.safety_groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location', 'alert')),
    reply_to UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Call logs table
CREATE TABLE public.call_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    caller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_phone TEXT,
    call_type TEXT NOT NULL CHECK (call_type IN ('emergency', 'group', 'direct')),
    duration_seconds INTEGER DEFAULT 0,
    status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated', 'ringing', 'answered', 'ended', 'missed', 'failed')),
    call_started_at TIMESTAMP WITH TIME ZONE,
    call_ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safety tips and resources table
CREATE TABLE public.safety_tips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('personal', 'home', 'travel', 'digital', 'emergency')),
    priority INTEGER DEFAULT 1,
    is_featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User settings table
CREATE TABLE public.user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    notifications_enabled BOOLEAN DEFAULT true,
    emergency_alerts_enabled BOOLEAN DEFAULT true,
    location_sharing_default BOOLEAN DEFAULT true,
    auto_share_duration_minutes INTEGER DEFAULT 60,
    emergency_contact_alert BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    vibration_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Emergency contacts policies
CREATE POLICY "Users can manage own emergency contacts" ON public.emergency_contacts
    FOR ALL USING (auth.uid() = user_id);

-- Safety groups policies
CREATE POLICY "Users can view public groups" ON public.safety_groups
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create groups" ON public.safety_groups
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" ON public.safety_groups
    FOR UPDATE USING (auth.uid() = created_by);

-- Group memberships policies
CREATE POLICY "Users can view their group memberships" ON public.group_memberships
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join groups" ON public.group_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Emergency alerts policies
CREATE POLICY "Users can manage own alerts" ON public.emergency_alerts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Group members can view alerts in their area" ON public.emergency_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.group_memberships gm
            JOIN public.safety_groups sg ON gm.group_id = sg.id
            WHERE gm.user_id = auth.uid()
            AND ST_DWithin(sg.location, emergency_alerts.location, sg.radius_meters)
        )
    );

-- Live locations policies
CREATE POLICY "Users can manage own location" ON public.live_locations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Group members can view shared locations" ON public.live_locations
    FOR SELECT USING (
        is_sharing = true AND (
            user_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.group_memberships gm1
                JOIN public.group_memberships gm2 ON gm1.group_id = gm2.group_id
                WHERE gm1.user_id = auth.uid() AND gm2.user_id = live_locations.user_id
            )
        )
    );

-- Chat messages policies
CREATE POLICY "Group members can view messages" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.group_memberships
            WHERE group_id = chat_messages.group_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Group members can send messages" ON public.chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.group_memberships
            WHERE group_id = chat_messages.group_id AND user_id = auth.uid()
        )
    );

-- Call logs policies
CREATE POLICY "Users can view own call logs" ON public.call_logs
    FOR SELECT USING (auth.uid() = caller_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create call logs" ON public.call_logs
    FOR INSERT WITH CHECK (auth.uid() = caller_id);

-- Safety tips policies (public read)
CREATE POLICY "Anyone can view safety tips" ON public.safety_tips
    FOR SELECT USING (true);

-- User settings policies
CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Functions and Triggers

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all relevant tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.emergency_contacts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.safety_groups
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.emergency_alerts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.safety_tips
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for better performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_emergency_contacts_user_id ON public.emergency_contacts(user_id);
CREATE INDEX idx_group_memberships_user_id ON public.group_memberships(user_id);
CREATE INDEX idx_group_memberships_group_id ON public.group_memberships(group_id);
CREATE INDEX idx_emergency_alerts_user_id ON public.emergency_alerts(user_id);
CREATE INDEX idx_emergency_alerts_location ON public.emergency_alerts USING GIST(location);
CREATE INDEX idx_emergency_alerts_created_at ON public.emergency_alerts(created_at);
CREATE INDEX idx_live_locations_user_id ON public.live_locations(user_id);
CREATE INDEX idx_live_locations_location ON public.live_locations USING GIST(location);
CREATE INDEX idx_chat_messages_group_id ON public.chat_messages(group_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_call_logs_caller_id ON public.call_logs(caller_id);
CREATE INDEX idx_call_logs_recipient_id ON public.call_logs(recipient_id);
CREATE INDEX idx_call_logs_created_at ON public.call_logs(created_at);
CREATE INDEX idx_safety_groups_location ON public.safety_groups USING GIST(location);

-- Sample data for safety tips
INSERT INTO public.safety_tips (title, content, category, priority, is_featured) VALUES
('Emergency Numbers', 'Always keep important emergency numbers saved in your phone: Police (911), Fire Department, Medical Emergency, and trusted contacts.', 'emergency', 1, true),
('Personal Safety While Walking', 'Stay alert, avoid distractions like phones, stick to well-lit areas, and trust your instincts if something feels wrong.', 'personal', 2, true),
('Home Security Basics', 'Lock all doors and windows, install adequate lighting, consider security cameras, and never open doors to strangers.', 'home', 2, false),
('Travel Safety Tips', 'Research your destination, share your itinerary with trusted contacts, keep copies of important documents, and stay in well-reviewed accommodations.', 'travel', 3, false),
('Digital Privacy Protection', 'Use strong passwords, enable two-factor authentication, be cautious with public Wi-Fi, and regularly update your software.', 'digital', 2, false),
('What to Do During Natural Disasters', 'Have an emergency kit ready, know evacuation routes, follow official alerts, and stay informed through reliable news sources.', 'emergency', 1, true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'User profile information extending Supabase auth';
COMMENT ON TABLE public.emergency_contacts IS 'Emergency contacts for each user';
COMMENT ON TABLE public.safety_groups IS 'Community safety groups and neighborhoods';
COMMENT ON TABLE public.group_memberships IS 'User memberships in safety groups';
COMMENT ON TABLE public.emergency_alerts IS 'Emergency alerts and panic buttons';
COMMENT ON TABLE public.live_locations IS 'Real-time location sharing data';
COMMENT ON TABLE public.chat_messages IS 'Group chat messages for communities';
COMMENT ON TABLE public.call_logs IS 'Call history and emergency call logs';
COMMENT ON TABLE public.safety_tips IS 'Safety tips and educational content';
COMMENT ON TABLE public.user_settings IS 'User preferences and settings';
