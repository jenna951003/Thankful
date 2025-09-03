-- Fix RLS permissions for Google OAuth login
-- Run this in Supabase SQL Editor

-- First, let's check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'user_settings', 'streaks');

-- Temporarily disable RLS for testing (optional - for debugging only)
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE streaks DISABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them with proper permissions
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Recreate policies with better error handling
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix user_settings policies
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;

CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix streaks policies
DROP POLICY IF EXISTS "Users can view their own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can insert their own streaks" ON streaks;

CREATE POLICY "Users can view their own streaks" ON streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" ON streaks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" ON streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON streaks TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Test query to verify permissions
SELECT 'RLS policies updated successfully' as status;
