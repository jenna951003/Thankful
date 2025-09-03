-- Simple fix: Temporarily disable RLS for development
-- Run this in Supabase SQL Editor

-- Disable RLS on all user-related tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_participation DISABLE ROW LEVEL SECURITY;
ALTER TABLE template_downloads DISABLE ROW LEVEL SECURITY;

-- Grant full access to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify the changes
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_tables 
WHERE tablename IN (
    'profiles', 'user_settings', 'streaks', 'notes', 
    'prayer_requests', 'community_templates', 
    'prayer_participation', 'template_downloads'
);

SELECT '✅ RLS DISABLED - FULL ACCESS GRANTED' as status;