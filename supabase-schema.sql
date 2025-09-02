-- Supabase Database Schema for Thankful App
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE note_type AS ENUM ('gratitude', 'sermon', 'prayer');
CREATE TYPE prayer_category AS ENUM ('healing', 'family', 'work', 'spiritual', 'world');
CREATE TYPE theme_type AS ENUM ('light', 'dark', 'auto');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    favorite_note_type note_type DEFAULT 'gratitude',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Notes table
CREATE TABLE notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type note_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    canvas_data JSONB,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public notes" ON notes
    FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Streaks table
CREATE TABLE streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    note_type note_type NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_recorded_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, note_type)
);

-- Enable RLS for streaks
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Streaks policies
CREATE POLICY "Users can view their own streaks" ON streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" ON streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" ON streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- Prayer requests table
CREATE TABLE prayer_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    category prayer_category NOT NULL,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT TRUE,
    prayer_count INTEGER DEFAULT 0,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for prayer requests
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- Prayer requests policies
CREATE POLICY "Everyone can view prayer requests" ON prayer_requests
    FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can insert prayer requests" ON prayer_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own prayer requests" ON prayer_requests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayer requests" ON prayer_requests
    FOR DELETE USING (auth.uid() = user_id);

-- Community templates table
CREATE TABLE community_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type note_type NOT NULL,
    canvas_data JSONB NOT NULL,
    preview_image TEXT,
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for community templates
ALTER TABLE community_templates ENABLE ROW LEVEL SECURITY;

-- Community templates policies
CREATE POLICY "Everyone can view community templates" ON community_templates
    FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can insert templates" ON community_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" ON community_templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" ON community_templates
    FOR DELETE USING (auth.uid() = user_id);

-- User settings table
CREATE TABLE user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    daily_reminder_enabled BOOLEAN DEFAULT TRUE,
    daily_reminder_time TIME DEFAULT '09:00',
    prayer_times JSONB DEFAULT '[]',
    weekly_goals JSONB DEFAULT '{"gratitude": 7, "sermon": 2, "prayer": 5}',
    theme theme_type DEFAULT 'light',
    language TEXT DEFAULT 'ko',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- User settings policies
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Prayer participation table (tracks who prayed for what)
CREATE TABLE prayer_participation (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    prayer_request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, prayer_request_id)
);

-- Enable RLS for prayer participation
ALTER TABLE prayer_participation ENABLE ROW LEVEL SECURITY;

-- Prayer participation policies
CREATE POLICY "Users can view their own participation" ON prayer_participation
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own participation" ON prayer_participation
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own participation" ON prayer_participation
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_type ON notes(type);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_public ON notes(is_public) WHERE is_public = TRUE;

CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_streaks_user_type ON streaks(user_id, note_type);

CREATE INDEX idx_prayer_requests_category ON prayer_requests(category);
CREATE INDEX idx_prayer_requests_created_at ON prayer_requests(created_at DESC);
CREATE INDEX idx_prayer_requests_urgent ON prayer_requests(is_urgent) WHERE is_urgent = TRUE;

CREATE INDEX idx_templates_type ON community_templates(type);
CREATE INDEX idx_templates_featured ON community_templates(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_templates_downloads ON community_templates(download_count DESC);

-- Functions
-- Function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, display_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', '익명 사용자'));
    
    -- Initialize user settings
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id);
    
    -- Initialize streak tracking
    INSERT INTO streaks (user_id, note_type) VALUES
        (NEW.id, 'gratitude'),
        (NEW.id, 'sermon'),
        (NEW.id, 'prayer');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update streak when note is created
CREATE OR REPLACE FUNCTION update_streak_on_note_insert()
RETURNS TRIGGER AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    yesterday_date DATE := CURRENT_DATE - INTERVAL '1 day';
    current_streak_val INTEGER;
    last_date DATE;
BEGIN
    -- Get current streak info
    SELECT current_streak, last_recorded_date
    INTO current_streak_val, last_date
    FROM streaks
    WHERE user_id = NEW.user_id AND note_type = NEW.type;
    
    -- If no record exists, create one
    IF NOT FOUND THEN
        INSERT INTO streaks (user_id, note_type, current_streak, longest_streak, last_recorded_date)
        VALUES (NEW.user_id, NEW.type, 1, 1, today_date);
        RETURN NEW;
    END IF;
    
    -- Skip if already recorded today
    IF last_date = today_date THEN
        RETURN NEW;
    END IF;
    
    -- Update streak
    IF last_date = yesterday_date THEN
        -- Continue streak
        current_streak_val := current_streak_val + 1;
    ELSE
        -- Reset streak
        current_streak_val := 1;
    END IF;
    
    -- Update streak record
    UPDATE streaks SET
        current_streak = current_streak_val,
        longest_streak = GREATEST(longest_streak, current_streak_val),
        last_recorded_date = today_date,
        updated_at = NOW()
    WHERE user_id = NEW.user_id AND note_type = NEW.type;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for streak updates
CREATE TRIGGER on_note_created_update_streak
    AFTER INSERT ON notes
    FOR EACH ROW EXECUTE FUNCTION update_streak_on_note_insert();

-- Function to update prayer count
CREATE OR REPLACE FUNCTION update_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE prayer_requests
        SET prayer_count = prayer_count + 1,
            updated_at = NOW()
        WHERE id = NEW.prayer_request_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE prayer_requests
        SET prayer_count = GREATEST(0, prayer_count - 1),
            updated_at = NOW()
        WHERE id = OLD.prayer_request_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for prayer count updates
CREATE TRIGGER on_prayer_participation_change
    AFTER INSERT OR DELETE ON prayer_participation
    FOR EACH ROW EXECUTE FUNCTION update_prayer_count();

-- Function to update template download count
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE community_templates
    SET download_count = download_count + 1,
        updated_at = NOW()
    WHERE id = NEW.template_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create template downloads tracking table
CREATE TABLE template_downloads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES community_templates(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, template_id)
);

ALTER TABLE template_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own downloads" ON template_downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own downloads" ON template_downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for download count
CREATE TRIGGER on_template_download
    AFTER INSERT ON template_downloads
    FOR EACH ROW EXECUTE FUNCTION increment_download_count();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_templates_updated_at BEFORE UPDATE ON community_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();