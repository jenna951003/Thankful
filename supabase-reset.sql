-- Supabase Database Reset Script
-- WARNING: This will delete ALL existing data!
-- Run this in Supabase SQL Editor to reset the database

-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_note_created_update_streak ON notes;
DROP TRIGGER IF EXISTS on_prayer_participation_change ON prayer_participation;
DROP TRIGGER IF EXISTS on_template_download ON template_downloads;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
DROP TRIGGER IF EXISTS update_streaks_updated_at ON streaks;
DROP TRIGGER IF EXISTS update_prayer_requests_updated_at ON prayer_requests;
DROP TRIGGER IF EXISTS update_community_templates_updated_at ON community_templates;
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;

-- Drop all functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_streak_on_note_insert();
DROP FUNCTION IF EXISTS update_prayer_count();
DROP FUNCTION IF EXISTS increment_download_count();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop all tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS template_downloads CASCADE;
DROP TABLE IF EXISTS prayer_participation CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS community_templates CASCADE;
DROP TABLE IF EXISTS prayer_requests CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS note_type CASCADE;
DROP TYPE IF EXISTS prayer_category CASCADE;
DROP TYPE IF EXISTS theme_type CASCADE;

-- Success message
SELECT 'Database has been completely reset. Ready for new schema!' AS status;