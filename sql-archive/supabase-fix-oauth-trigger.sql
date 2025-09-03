-- Fix OAuth Profile Creation Trigger
-- This script updates the handle_new_user function to properly handle OAuth providers
-- Run this in Supabase SQL Editor

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create improved handle_new_user function that handles OAuth providers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_full_name TEXT;
    user_display_name TEXT;
    user_avatar TEXT;
BEGIN
    -- Extract email (always available)
    user_email := NEW.email;
    
    -- Extract name based on provider
    -- Google: uses 'name', 'given_name', 'family_name'
    -- Facebook: uses 'name'
    -- Apple: might not provide name
    -- Email signup: uses 'full_name'
    
    -- Try different fields for full name
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',  -- Email signup
        NEW.raw_user_meta_data->>'name',        -- Google, Facebook
        CONCAT(
            COALESCE(NEW.raw_user_meta_data->>'given_name', ''),
            CASE 
                WHEN NEW.raw_user_meta_data->>'given_name' IS NOT NULL 
                AND NEW.raw_user_meta_data->>'family_name' IS NOT NULL 
                THEN ' ' 
                ELSE '' 
            END,
            COALESCE(NEW.raw_user_meta_data->>'family_name', '')
        ),                                       -- Google alternative
        ''                                       -- Default empty
    );
    
    -- Clean up empty strings
    IF user_full_name = '' OR user_full_name = ' ' THEN
        user_full_name := NULL;
    END IF;
    
    -- Extract display name (with fallbacks)
    user_display_name := COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        user_full_name,
        NEW.raw_user_meta_data->>'preferred_username',
        SPLIT_PART(user_email, '@', 1),         -- Use email prefix as last resort
        '익명 사용자'
    );
    
    -- Extract avatar URL (if provided by OAuth)
    user_avatar := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',     -- Google uses 'picture'
        NEW.raw_user_meta_data->>'photo_url',
        NULL
    );
    
    -- Create profile with extracted data
    INSERT INTO profiles (id, email, full_name, display_name, avatar_url)
    VALUES (
        NEW.id, 
        user_email,
        user_full_name,
        user_display_name,
        user_avatar
    )
    ON CONFLICT (id) DO UPDATE SET
        -- Update if profile already exists (shouldn't happen, but safe guard)
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        updated_at = NOW();
    
    -- Initialize user settings (if not exists)
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Initialize streak tracking (if not exists)
    INSERT INTO streaks (user_id, note_type) 
    VALUES
        (NEW.id, 'gratitude'),
        (NEW.id, 'sermon'),
        (NEW.id, 'prayer')
    ON CONFLICT (user_id, note_type) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the auth process
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a function to manually fix existing OAuth users without profiles
CREATE OR REPLACE FUNCTION fix_missing_profiles()
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    status TEXT
) AS $$
DECLARE
    auth_user RECORD;
    user_count INTEGER := 0;
BEGIN
    -- Find auth users without profiles
    FOR auth_user IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN profiles p ON au.id = p.id
        WHERE p.id IS NULL
    LOOP
        BEGIN
            -- Extract data similar to trigger
            INSERT INTO profiles (id, email, full_name, display_name, avatar_url)
            VALUES (
                auth_user.id,
                auth_user.email,
                COALESCE(
                    auth_user.raw_user_meta_data->>'full_name',
                    auth_user.raw_user_meta_data->>'name',
                    ''
                ),
                COALESCE(
                    auth_user.raw_user_meta_data->>'display_name',
                    auth_user.raw_user_meta_data->>'name',
                    auth_user.raw_user_meta_data->>'full_name',
                    SPLIT_PART(auth_user.email, '@', 1),
                    '익명 사용자'
                ),
                COALESCE(
                    auth_user.raw_user_meta_data->>'avatar_url',
                    auth_user.raw_user_meta_data->>'picture',
                    NULL
                )
            );
            
            -- Also create settings and streaks
            INSERT INTO user_settings (user_id) 
            VALUES (auth_user.id)
            ON CONFLICT (user_id) DO NOTHING;
            
            INSERT INTO streaks (user_id, note_type) 
            VALUES
                (auth_user.id, 'gratitude'),
                (auth_user.id, 'sermon'),
                (auth_user.id, 'prayer')
            ON CONFLICT (user_id, note_type) DO NOTHING;
            
            user_count := user_count + 1;
            
            RETURN QUERY SELECT auth_user.id, auth_user.email, 'Profile created'::TEXT;
        EXCEPTION
            WHEN OTHERS THEN
                RETURN QUERY SELECT auth_user.id, auth_user.email, CONCAT('Error: ', SQLERRM)::TEXT;
        END;
    END LOOP;
    
    IF user_count = 0 THEN
        RETURN QUERY SELECT NULL::UUID, 'No missing profiles found'::TEXT, 'Success'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the fix function immediately to fix existing users
SELECT * FROM fix_missing_profiles();

-- Success message
SELECT 'OAuth trigger fixed and missing profiles created!' AS status;