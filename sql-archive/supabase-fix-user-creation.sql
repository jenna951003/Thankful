-- Fix for "Database error saving new user" issue
-- Run this in Supabase SQL Editor

-- First, drop the trigger that depends on the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then drop the function
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a more robust user creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into profiles table with error handling
    BEGIN
        INSERT INTO profiles (id, email, display_name)
        VALUES (
            NEW.id, 
            COALESCE(NEW.email, ''),
            COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', '익명 사용자')
        );
    EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Initialize user settings with error handling
    BEGIN
        INSERT INTO user_settings (user_id)
        VALUES (NEW.id);
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to create user settings for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Initialize streak tracking with error handling
    BEGIN
        INSERT INTO streaks (user_id, note_type) VALUES
            (NEW.id, 'gratitude'),
            (NEW.id, 'sermon'),
            (NEW.id, 'prayer');
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to create streaks for user %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also, let's make sure the profiles table policies are correct
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Make sure the user_settings table policies are correct
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Make sure the streaks table policies are correct
DROP POLICY IF EXISTS "Users can insert their own streaks" ON streaks;
CREATE POLICY "Users can insert their own streaks" ON streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
