-- Community messages table
CREATE TABLE IF NOT EXISTS public.community_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'general',
    location GEOMETRY(POINT, 4326),
    area_radius INTEGER DEFAULT 5000,
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
CREATE TABLE IF NOT EXISTS public.message_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES community_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, interaction_type)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_interactions ENABLE ROW LEVEL SECURITY;

-- Create Policies for community_messages
CREATE POLICY "Anyone can view community messages"
  ON public.community_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert community messages"
  ON public.community_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community messages"
  ON public.community_messages
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community messages"
  ON public.community_messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create Policies for message_interactions
CREATE POLICY "Anyone can view message interactions"
  ON public.message_interactions
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert message interactions"
  ON public.message_interactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own message interactions"
  ON public.message_interactions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own message interactions"
  ON public.message_interactions
  FOR DELETE
  USING (auth.uid() = user_id);
