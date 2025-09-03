-- Fix user creation trigger to ensure profiles are always created
-- Run this in Supabase SQL Editor

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a more robust user creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into profiles table with comprehensive error handling
    BEGIN
        INSERT INTO profiles (
            id, 
            email, 
            display_name,
            avatar_url,
            created_at,
            updated_at
        ) VALUES (
            NEW.id, 
            COALESCE(NEW.email, ''),
            COALESCE(
                NEW.raw_user_meta_data->>'display_name', 
                NEW.raw_user_meta_data->>'full_name',
                NEW.raw_user_meta_data->>'name',
                split_part(COALESCE(NEW.email, ''), '@', 1),
                '익명 사용자'
            ),
            COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Profile created for user: %', NEW.id;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        -- Don't fail the user creation, just log the error
    END;
    
    -- Initialize user settings with error handling
    BEGIN
        INSERT INTO user_settings (
            user_id,
            daily_reminder_enabled,
            daily_reminder_time,
            prayer_times,
            weekly_goals,
            theme,
            language,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            true,
            '09:00',
            '[]',
            '{"gratitude": 7, "sermon": 2, "prayer": 5}',
            'light',
            'ko',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'User settings created for user: %', NEW.id;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to create user settings for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Initialize streak tracking with error handling
    BEGIN
        INSERT INTO streaks (user_id, note_type, current_streak, longest_streak, last_recorded_date, created_at, updated_at) VALUES
            (NEW.id, 'gratitude', 0, 0, NULL, NOW(), NOW()),
            (NEW.id, 'sermon', 0, 0, NULL, NOW(), NOW()),
            (NEW.id, 'prayer', 0, 0, NULL, NOW(), NOW());
        
        RAISE NOTICE 'Streaks created for user: %', NEW.id;
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

-- Test the function with existing user (if needed)
-- This will create profile for existing users who don't have one
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT id, email, raw_user_meta_data 
        FROM auth.users 
        WHERE id NOT IN (SELECT id FROM profiles)
    LOOP
        BEGIN
            INSERT INTO profiles (
                id, 
                email, 
                display_name,
                avatar_url,
                created_at,
                updated_at
            ) VALUES (
                user_record.id, 
                COALESCE(user_record.email, ''),
                COALESCE(
                    user_record.raw_user_meta_data->>'display_name', 
                    user_record.raw_user_meta_data->>'full_name',
                    user_record.raw_user_meta_data->>'name',
                    split_part(COALESCE(user_record.email, ''), '@', 1),
                    '익명 사용자'
                ),
                COALESCE(user_record.raw_user_meta_data->>'avatar_url', ''),
                NOW(),
                NOW()
            );
            
            RAISE NOTICE 'Created missing profile for user: %', user_record.id;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Failed to create profile for existing user %: %', user_record.id, SQLERRM;
        END;
    END LOOP;
END $$;

SELECT '✅ User creation trigger fixed and missing profiles created!' as status;
