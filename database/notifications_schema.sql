-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('message', 'location', 'emergency', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sender_name TEXT,
    related_data JSONB
);

-- Add community notifications column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'receive_community_notifications'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN receive_community_notifications BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at);

-- Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy for users to view only their own notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to insert notifications (for sending to others)
CREATE POLICY "Users can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy for users to update their own notifications (marking as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for users to delete their own notifications
CREATE POLICY "Users can delete their own notifications" 
ON public.notifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to send notification when a new message is created
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a notification for the recipient
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    sender_name,
    related_data
  )
  VALUES (
    NEW.recipient_id,
    COALESCE(NEW.sender_name, 'New message'),
    SUBSTRING(NEW.content FROM 1 FOR 100) || CASE WHEN LENGTH(NEW.content) > 100 THEN '...' ELSE '' END,
    'message',
    NEW.sender_name,
    jsonb_build_object('message_id', NEW.id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to send notification when a location is shared
CREATE OR REPLACE FUNCTION public.handle_location_share()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if the location is manually shared (not automatic updates)
  IF NEW.is_manually_shared = TRUE THEN
    -- Insert notifications for each emergency contact
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      sender_name,
      related_data
    )
    SELECT 
      ec.user_id,
      'Location shared',
      COALESCE(u.display_name, u.email, 'Someone') || ' shared their location with you',
      'location',
      COALESCE(u.display_name, u.email),
      jsonb_build_object(
        'coordinates', jsonb_build_object('latitude', NEW.latitude, 'longitude', NEW.longitude),
        'location_id', NEW.id
      )
    FROM 
      public.emergency_contacts ec
    JOIN
      auth.users u ON NEW.user_id = u.id
    WHERE 
      ec.is_primary = TRUE AND
      NEW.user_id = ec.contact_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace trigger for new messages
DROP TRIGGER IF EXISTS on_new_message ON public.messages;
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_message();

-- Create or replace trigger for location sharing
DROP TRIGGER IF EXISTS on_location_share ON public.user_locations;
CREATE TRIGGER on_location_share
  AFTER INSERT OR UPDATE ON public.user_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_location_share();
