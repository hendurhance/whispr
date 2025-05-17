-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core profile table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  email_notifications BOOLEAN DEFAULT TRUE,
  allow_anonymous BOOLEAN DEFAULT TRUE,
  show_question_types BOOLEAN DEFAULT TRUE,
  display_social_links BOOLEAN DEFAULT FALSE,
  selected_theme TEXT DEFAULT 'purple-pink',
  selected_background TEXT DEFAULT 'black',
  total_views INTEGER DEFAULT 0,
  total_whisprs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile access control
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Performance optimization
CREATE INDEX idx_profiles_email_notifications ON profiles(user_id, email_notifications);

-- Weekly stats tracking
CREATE TABLE weekly_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  whisprs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE weekly_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own weekly stats" ON weekly_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert weekly stats" ON weekly_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can update weekly stats" ON weekly_stats FOR UPDATE USING (auth.uid() = user_id);

-- Social media links
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read social links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Users can insert their own social links" ON social_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own social links" ON social_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own social links" ON social_links FOR DELETE USING (auth.uid() = user_id);

-- Anonymous messages system
CREATE TABLE whisprs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_whispr_type CHECK (type IN ('question', 'compliment', 'roast', 'confession', 'rumor', 'suggestion', 'secret', 'hot_take', 'dare'))
);

-- Performance optimizations
CREATE INDEX idx_whisprs_user_id ON whisprs(user_id);
CREATE INDEX idx_whisprs_type ON whisprs(type);
CREATE INDEX idx_whisprs_created_at ON whisprs(created_at);
CREATE INDEX idx_whisprs_is_read ON whisprs(is_read);

ALTER TABLE whisprs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own whisprs" ON whisprs FOR SELECT USING (auth.uid() = user_id);

-- Public schema functions
CREATE OR REPLACE FUNCTION public.submit_anonymous_whispr(
  recipient_username TEXT,
  whispr_content TEXT,
  whispr_type TEXT
) RETURNS UUID AS $$
DECLARE
  recipient_id UUID;
  new_whispr_id UUID;
BEGIN
  SELECT user_id INTO recipient_id FROM profiles WHERE username = recipient_username;
  
  IF recipient_id IS NOT NULL THEN
    INSERT INTO whisprs (id, user_id, content, type)
    VALUES (uuid_generate_v4(), recipient_id, whispr_content, whispr_type)
    RETURNING id INTO new_whispr_id;
    
    UPDATE profiles
    SET total_whisprs = total_whisprs + 1
    WHERE user_id = recipient_id;
    
    INSERT INTO weekly_stats (user_id, date, whisprs)
    VALUES (recipient_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET whisprs = weekly_stats.whisprs + 1;
    
    RETURN new_whispr_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.mark_whispr_read(whispr_id UUID)
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

CREATE OR REPLACE FUNCTION public.delete_whispr(whispr_id UUID)
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