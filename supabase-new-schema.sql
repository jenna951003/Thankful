-- Supabase New Schema for Thankful App
-- Optimized for Authentication and Performance
-- Run this AFTER running supabase-reset.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================
-- CUSTOM TYPES
-- =====================================
CREATE TYPE note_type AS ENUM ('gratitude', 'sermon', 'prayer');
CREATE TYPE prayer_category AS ENUM ('healing', 'family', 'work', 'spiritual', 'world');
CREATE TYPE theme_type AS ENUM ('light', 'dark', 'auto');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'church');

-- =====================================
-- PROFILES TABLE (extends auth.users)
-- =====================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================
-- USER SETTINGS TABLE
-- =====================================
CREATE TABLE user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    language TEXT DEFAULT 'ko',
    theme theme_type DEFAULT 'light',
    daily_reminder_enabled BOOLEAN DEFAULT TRUE,
    daily_reminder_time TIME DEFAULT '09:00',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- User settings policies
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================
-- NOTES TABLE
-- =====================================
CREATE TABLE notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type note_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
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

-- =====================================
-- STREAKS TABLE
-- =====================================
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

-- Enable RLS
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Streaks policies
CREATE POLICY "Users can view their own streaks" ON streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" ON streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" ON streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================
-- INDEXES FOR PERFORMANCE
-- =====================================
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_type ON notes(type);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_public ON notes(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_streaks_user_type ON streaks(user_id, note_type);

-- =====================================
-- FUNCTIONS AND TRIGGERS
-- =====================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO profiles (id, email, full_name, display_name)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', '익명 사용자')
    );
    
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

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================
-- TRIGGERS
-- =====================================

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger for streak updates
CREATE TRIGGER on_note_created_update_streak
    AFTER INSERT ON notes
    FOR EACH ROW EXECUTE FUNCTION update_streak_on_note_insert();

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at 
    BEFORE UPDATE ON streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'New optimized schema created successfully!' AS status;