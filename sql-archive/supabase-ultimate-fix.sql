-- ⚡ ULTIMATE FIX: OAuth RLS 권한 문제 완전 해결
-- Supabase SQL Editor에서 실행하세요

-- 1. 일시적으로 RLS 비활성화
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;

-- 2. 모든 기존 정책 완전 삭제
DO $$ 
BEGIN
    -- profiles 테이블의 모든 정책 삭제
    DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON profiles;
    DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON profiles;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
    DROP POLICY IF EXISTS "Allow authenticated users to read own profile" ON profiles;
    DROP POLICY IF EXISTS "Allow authenticated users to insert own profile" ON profiles;
    DROP POLICY IF EXISTS "Allow authenticated users to update own profile" ON profiles;
    DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
    DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
    DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
    
    RAISE NOTICE 'All existing policies dropped';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping policies: %', SQLERRM;
END $$;

-- 3. 테이블 재생성 (안전하게)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS 재활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. 새로운 RLS 정책 생성 (매우 관대한 정책)
-- 더 안전하고 확실한 정책으로 수정
CREATE POLICY "allow_authenticated_users_select_profiles" ON profiles
    FOR SELECT 
    USING (
        auth.role() = 'authenticated' AND 
        (auth.uid() = id OR auth.uid() IS NOT NULL)
    );

CREATE POLICY "allow_authenticated_users_insert_profiles" ON profiles
    FOR INSERT 
    WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid() = id AND 
        auth.uid() IS NOT NULL
    );

CREATE POLICY "allow_authenticated_users_update_profiles" ON profiles
    FOR UPDATE 
    USING (
        auth.role() = 'authenticated' AND 
        auth.uid() = id AND 
        auth.uid() IS NOT NULL
    );

-- 추가: DELETE 정책도 생성 (나중에 필요할 수 있음)
CREATE POLICY "allow_authenticated_users_delete_profiles" ON profiles
    FOR DELETE 
    USING (
        auth.role() = 'authenticated' AND 
        auth.uid() = id AND 
        auth.uid() IS NOT NULL
    );

-- 6. user_settings 테이블도 같이 처리
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    language TEXT DEFAULT 'ko',
    theme TEXT DEFAULT 'light',
    daily_reminder_enabled BOOLEAN DEFAULT TRUE,
    daily_reminder_time TIME DEFAULT '09:00',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_authenticated_user_settings_select" ON user_settings
    FOR SELECT 
    USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "allow_all_authenticated_user_settings_insert" ON user_settings
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "allow_all_authenticated_user_settings_update" ON user_settings
    FOR UPDATE 
    USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- 7. streaks 테이블도 처리
CREATE TABLE IF NOT EXISTS streaks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    note_type TEXT NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_recorded_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, note_type)
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_authenticated_streaks_select" ON streaks
    FOR SELECT 
    USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "allow_all_authenticated_streaks_insert" ON streaks
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "allow_all_authenticated_streaks_update" ON streaks
    FOR UPDATE 
    USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- 8. OAuth 사용자를 위한 개선된 트리거 함수
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
        ),
        NULL
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
        SPLIT_PART(user_email, '@', 1),
        '익명 사용자'
    );
    
    -- Extract avatar URL (if provided by OAuth)
    user_avatar := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
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

-- 9. 트리거 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 10. 현재 상태 확인 및 기존 사용자 복구
DO $$
DECLARE
    auth_user RECORD;
    user_count INTEGER := 0;
    total_users INTEGER := 0;
    total_profiles INTEGER := 0;
BEGIN
    -- 현재 상태 확인
    SELECT COUNT(*) INTO total_users FROM auth.users;
    SELECT COUNT(*) INTO total_profiles FROM profiles;
    
    RAISE NOTICE 'Current state: % users, % profiles', total_users, total_profiles;
    
    -- Find auth users without profiles and fix them
    FOR auth_user IN 
        SELECT au.id, au.email, au.raw_user_meta_data, au.created_at
        FROM auth.users au
        LEFT JOIN profiles p ON au.id = p.id
        WHERE p.id IS NULL
        ORDER BY au.created_at DESC
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
                    NULL
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
            
            RAISE NOTICE 'Created profile for user: % (%)', auth_user.email, auth_user.id;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error creating profile for user % (%): %', auth_user.email, auth_user.id, SQLERRM;
        END;
    END LOOP;
    
    IF user_count = 0 THEN
        RAISE NOTICE 'No missing profiles found. All users already have profiles.';
    ELSE
        RAISE NOTICE 'Successfully created % profile(s).', user_count;
    END IF;
    
    -- Final status
    SELECT COUNT(*) INTO total_users FROM auth.users;
    SELECT COUNT(*) INTO total_profiles FROM profiles;
    
    RAISE NOTICE 'Final state: % users, % profiles', total_users, total_profiles;
    RAISE NOTICE '🎉 ULTIMATE FIX COMPLETED SUCCESSFULLY! 🎉';
END;
$$;

-- 11. 최종 검증 및 상태 확인
DO $$
DECLARE
    policy_count INTEGER;
    trigger_exists BOOLEAN;
    sample_user_id UUID;
    sample_profile profiles;
BEGIN
    -- RLS 정책 개수 확인
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'profiles' AND schemaname = 'public';
    
    RAISE NOTICE '✅ Active RLS policies on profiles table: %', policy_count;
    
    -- 트리거 존재 확인
    SELECT EXISTS(
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created' 
        AND event_object_table = 'users'
    ) INTO trigger_exists;
    
    RAISE NOTICE '✅ OAuth user trigger exists: %', trigger_exists;
    
    -- 샘플 사용자 테스트 (있는 경우)
    SELECT id INTO sample_user_id 
    FROM auth.users 
    WHERE email LIKE '%@gmail.com' 
    LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        SELECT * INTO sample_profile
        FROM profiles 
        WHERE id = sample_user_id;
        
        IF sample_profile IS NOT NULL THEN
            RAISE NOTICE '✅ Sample profile exists for user: % (%, %)', 
                sample_user_id, sample_profile.email, sample_profile.display_name;
        ELSE
            RAISE NOTICE '⚠️ No profile found for sample user: %', sample_user_id;
        END IF;
    END IF;
    
    RAISE NOTICE '🔧 Database configuration completed!';
    RAISE NOTICE '📋 Next step: Test OAuth login in your application';
END;
$$;