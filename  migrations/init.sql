CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to usernames (for checking availability)
CREATE POLICY "Public profiles are viewable by everyone." 
  ON profiles FOR SELECT 
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Add email_notifications column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE;

-- Add index for faster lookups if needed
CREATE INDEX IF NOT EXISTS idx_profiles_email_notifications ON profiles(user_id, email_notifications);


-- Add customization columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS allow_anonymous BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_question_types BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_social_links BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS selected_theme TEXT DEFAULT 'purple-pink';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS selected_background TEXT DEFAULT 'black';

-- Add view and whispr stats columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_views INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_whisprs INTEGER DEFAULT 0;


-- Create weekly stats table for whispr activity
CREATE TABLE IF NOT EXISTS weekly_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  whisprs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Add RLS policies for weekly_stats
ALTER TABLE weekly_stats ENABLE ROW LEVEL SECURITY;

-- Users can read their own weekly stats
CREATE POLICY "Users can read their own weekly stats"
  ON weekly_stats FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can insert/update weekly stats (you'll need a server function for this)
CREATE POLICY "System can insert weekly stats"
  ON weekly_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);  -- This allows users to create their own initial stats

CREATE POLICY "System can update weekly stats"
  ON weekly_stats FOR UPDATE
  USING (auth.uid() = user_id);  -- This allows users to update their own stats

-- Create social links table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for social_links
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Anyone can read social links
CREATE POLICY "Anyone can read social links"
  ON social_links FOR SELECT
  USING (true);

-- Users can insert their own social links
CREATE POLICY "Users can insert their own social links"
  ON social_links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own social links
CREATE POLICY "Users can update their own social links"
  ON social_links FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own social links
CREATE POLICY "Users can delete their own social links"
  ON social_links FOR DELETE
  USING (auth.uid() = user_id);

  -- Create whisprs table
CREATE TABLE IF NOT EXISTS whisprs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- The recipient
  content TEXT NOT NULL,
  type TEXT NOT NULL, -- 'question', 'confession', 'compliment', 'feedback', 'advice', 'suggestion', 'secret', 'opinion'
  is_read BOOLEAN DEFAULT FALSE,
  ip_address TEXT, -- Store IP for abuse prevention (optional)
  metadata JSONB DEFAULT '{}'::jsonb, -- For future extensibility
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add check constraint to ensure valid whispr types
ALTER TABLE whisprs ADD CONSTRAINT valid_whispr_type 
  CHECK (type IN ('question', 'compliment', 'roast', 'confession', 'rumor', 'suggestion', 'secret', 'hot_take', 'dare'));
-- Add index for faster user lookups
CREATE INDEX idx_whisprs_user_id ON whisprs(user_id);
CREATE INDEX idx_whisprs_type ON whisprs(type);
CREATE INDEX idx_whisprs_created_at ON whisprs(created_at);
CREATE INDEX idx_whisprs_is_read ON whisprs(is_read);

-- Enable Row Level Security
ALTER TABLE whisprs ENABLE ROW LEVEL SECURITY;

-- Users can only see whisprs directed to them
CREATE POLICY "Users can view their own whisprs"
  ON whisprs FOR SELECT
  USING (auth.uid() = user_id);

-- Add policy for anonymous submissions
-- This will be handled via a server function or edge function
-- Since anonymous users can't write directly to the database

-- Create function for submitting anonymous whisprs
CREATE OR REPLACE FUNCTION submit_anonymous_whispr(
  recipient_username TEXT,
  whispr_content TEXT,
  whispr_type TEXT
) RETURNS UUID AS $$
DECLARE
  recipient_id UUID;
  new_whispr_id UUID;
BEGIN
  -- Find the user_id based on username
  SELECT user_id INTO recipient_id
  FROM profiles
  WHERE username = recipient_username;
  
  -- If recipient found, insert the whispr
  IF recipient_id IS NOT NULL THEN
    INSERT INTO whisprs (id, user_id, content, type)
    VALUES (uuid_generate_v4(), recipient_id, whispr_content, whispr_type)
    RETURNING id INTO new_whispr_id;
    
    -- Update total_whisprs in the recipient's profile
    UPDATE profiles
    SET total_whisprs = total_whisprs + 1
    WHERE user_id = recipient_id;
    
    -- Add to weekly stats
    INSERT INTO weekly_stats (user_id, date, whisprs)
    VALUES (recipient_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET whisprs = weekly_stats.whisprs + 1;
    
    RETURN new_whispr_id;
  END IF;
  
  -- Return NULL if recipient not found
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create an API endpoint for anonymous submissions (using Supabase Edge Functions)
-- This would be implemented separately in your application code

-- Create a function to mark a whispr as read
CREATE OR REPLACE FUNCTION mark_whispr_read(whispr_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE whisprs
  SET is_read = TRUE
  WHERE id = whispr_id
  AND user_id = auth.uid()
  RETURNING 1 INTO updated_rows;
  
  RETURN updated_rows = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to delete a whispr
CREATE OR REPLACE FUNCTION delete_whispr(whispr_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  deleted_rows INTEGER;
BEGIN
  DELETE FROM whisprs
  WHERE id = whispr_id
  AND user_id = auth.uid()
  RETURNING 1 INTO deleted_rows;
  
  RETURN deleted_rows = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;