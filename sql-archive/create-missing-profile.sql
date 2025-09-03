-- Create missing profile for Google OAuth user
-- Run this in Supabase SQL Editor

-- First, let's check if the user exists in auth.users
SELECT 
    id, 
    email, 
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'jenna951003@gmail.com';

-- Check if profile already exists
SELECT * FROM profiles WHERE id = 'fd09cc62-5fb4-434b-b51a-1c1cd44ac0dc';

-- Create the missing profile manually
INSERT INTO profiles (
    id, 
    email, 
    display_name,
    avatar_url,
    created_at,
    updated_at
) VALUES (
    'fd09cc62-5fb4-434b-b51a-1c1cd44ac0dc',
    'jenna951003@gmail.com',
    'Jenna_1003_',
    'https://lh3.googleusercontent.com/a/ACg8ocIN3WbE4jR2d3ABVwkv-lxPEIMHQ3DHLwJsDMKVD22MmaQ1sA=s96-c',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

-- Create user settings
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
    'fd09cc62-5fb4-434b-b51a-1c1cd44ac0dc',
    true,
    '09:00',
    '[]',
    '{"gratitude": 7, "sermon": 2, "prayer": 5}',
    'light',
    'ko',
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO UPDATE SET
    updated_at = NOW();

-- Create streak records
INSERT INTO streaks (user_id, note_type, current_streak, longest_streak, last_recorded_date, created_at, updated_at) VALUES
    ('fd09cc62-5fb4-434b-b51a-1c1cd44ac0dc', 'gratitude', 0, 0, NULL, NOW(), NOW()),
    ('fd09cc62-5fb4-434b-b51a-1c1cd44ac0dc', 'sermon', 0, 0, NULL, NOW(), NOW()),
    ('fd09cc62-5fb4-434b-b51a-1c1cd44ac0dc', 'prayer', 0, 0, NULL, NOW(), NOW())
ON CONFLICT (user_id, note_type) DO UPDATE SET
    updated_at = NOW();

-- Verify the profile was created
SELECT 
    p.id,
    p.email,
    p.display_name,
    p.avatar_url,
    p.created_at,
    us.language,
    us.theme,
    s.note_type,
    s.current_streak
FROM profiles p
LEFT JOIN user_settings us ON p.id = us.user_id
LEFT JOIN streaks s ON p.id = s.user_id
WHERE p.id = 'fd09cc62-5fb4-434b-b51a-1c1cd44ac0dc';

SELECT '✅ Profile created successfully!' as status;
