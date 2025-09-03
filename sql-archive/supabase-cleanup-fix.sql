-- 🔧 CLEANUP & FIX: 기존 정책 완전 정리 후 재생성
-- Supabase SQL Editor에서 실행하세요

-- ========================================
-- 1단계: 완전한 정책 정리
-- ========================================

-- RLS 일시 비활성화
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_settings DISABLE ROW LEVEL SECURITY;  
ALTER TABLE IF EXISTS streaks DISABLE ROW LEVEL SECURITY;

-- 모든 정책 강제 삭제 (오류 무시)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- profiles 테이블의 모든 정책 삭제
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
            RAISE NOTICE 'Dropped policy: %', pol.policyname;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Failed to drop policy %: %', pol.policyname, SQLERRM;
        END;
    END LOOP;

    -- user_settings 테이블의 모든 정책 삭제  
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_settings' AND schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON user_settings', pol.policyname);
            RAISE NOTICE 'Dropped user_settings policy: %', pol.policyname;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Failed to drop user_settings policy %: %', pol.policyname, SQLERRM;
        END;
    END LOOP;

    -- streaks 테이블의 모든 정책 삭제
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'streaks' AND schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON streaks', pol.policyname);
            RAISE NOTICE 'Dropped streaks policy: %', pol.policyname;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Failed to drop streaks policy %: %', pol.policyname, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '✅ Policy cleanup completed';
END $$;

-- ========================================
-- 2단계: 테이블 존재 확인
-- ========================================

-- profiles 테이블
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

-- user_settings 테이블
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

-- streaks 테이블
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

-- ========================================
-- 3단계: 강화된 트리거 함수
-- ========================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_full_name TEXT;
    user_display_name TEXT;
    user_avatar TEXT;
BEGIN
    -- 기본 정보 추출
    user_email := COALESCE(NEW.email, '');
    
    -- OAuth 제공자별 이름 추출
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
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
    
    -- 빈 문자열 정리
    IF user_full_name = '' OR user_full_name = ' ' THEN
        user_full_name := NULL;
    END IF;
    
    -- 표시 이름
    user_display_name := COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        user_full_name,
        NEW.raw_user_meta_data->>'preferred_username',
        SPLIT_PART(user_email, '@', 1),
        '익명 사용자'
    );
    
    -- 아바타 URL
    user_avatar := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
        NEW.raw_user_meta_data->>'photo_url',
        NULL
    );
    
    -- 프로필 생성 (UPSERT)
    INSERT INTO profiles (id, email, full_name, display_name, avatar_url)
    VALUES (NEW.id, user_email, user_full_name, user_display_name, user_avatar)
    ON CONFLICT (id) DO UPDATE SET
        email = COALESCE(EXCLUDED.email, profiles.email),
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        updated_at = NOW();
    
    -- 사용자 설정 초기화
    INSERT INTO user_settings (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
    
    -- 스트릭 초기화
    INSERT INTO streaks (user_id, note_type) 
    VALUES (NEW.id, 'gratitude'), (NEW.id, 'sermon'), (NEW.id, 'prayer')
    ON CONFLICT (user_id, note_type) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- 4단계: RLS 재활성화 및 새 정책 생성
-- ========================================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- profiles 테이블 정책 (고유한 이름으로 생성)
DO $$
BEGIN
    -- SELECT 정책
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'profiles_authenticated_select_v2'
    ) THEN
        CREATE POLICY "profiles_authenticated_select_v2" ON profiles
            FOR SELECT 
            USING (
                (auth.role() = 'authenticated' AND auth.uid() = id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = id
            );
        RAISE NOTICE 'Created profiles SELECT policy';
    END IF;

    -- INSERT 정책
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'profiles_authenticated_insert_v2'
    ) THEN
        CREATE POLICY "profiles_authenticated_insert_v2" ON profiles
            FOR INSERT 
            WITH CHECK (
                (auth.role() = 'authenticated' AND auth.uid() = id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = id
            );
        RAISE NOTICE 'Created profiles INSERT policy';
    END IF;

    -- UPDATE 정책
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'profiles_authenticated_update_v2'
    ) THEN
        CREATE POLICY "profiles_authenticated_update_v2" ON profiles
            FOR UPDATE 
            USING (
                (auth.role() = 'authenticated' AND auth.uid() = id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = id
            );
        RAISE NOTICE 'Created profiles UPDATE policy';
    END IF;

    -- DELETE 정책
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'profiles_authenticated_delete_v2'
    ) THEN
        CREATE POLICY "profiles_authenticated_delete_v2" ON profiles
            FOR DELETE 
            USING (
                (auth.role() = 'authenticated' AND auth.uid() = id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = id
            );
        RAISE NOTICE 'Created profiles DELETE policy';
    END IF;

    RAISE NOTICE '✅ Profiles policies created successfully';
END $$;

-- user_settings 테이블 정책
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_settings' 
        AND policyname = 'user_settings_authenticated_select_v2'
    ) THEN
        CREATE POLICY "user_settings_authenticated_select_v2" ON user_settings
            FOR SELECT 
            USING (
                (auth.role() = 'authenticated' AND auth.uid() = user_id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = user_id
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_settings' 
        AND policyname = 'user_settings_authenticated_insert_v2'
    ) THEN
        CREATE POLICY "user_settings_authenticated_insert_v2" ON user_settings
            FOR INSERT 
            WITH CHECK (
                (auth.role() = 'authenticated' AND auth.uid() = user_id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = user_id
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_settings' 
        AND policyname = 'user_settings_authenticated_update_v2'
    ) THEN
        CREATE POLICY "user_settings_authenticated_update_v2" ON user_settings
            FOR UPDATE 
            USING (
                (auth.role() = 'authenticated' AND auth.uid() = user_id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = user_id
            );
    END IF;

    RAISE NOTICE '✅ User settings policies created successfully';
END $$;

-- streaks 테이블 정책
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'streaks' 
        AND policyname = 'streaks_authenticated_select_v2'
    ) THEN
        CREATE POLICY "streaks_authenticated_select_v2" ON streaks
            FOR SELECT 
            USING (
                (auth.role() = 'authenticated' AND auth.uid() = user_id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = user_id
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'streaks' 
        AND policyname = 'streaks_authenticated_insert_v2'
    ) THEN
        CREATE POLICY "streaks_authenticated_insert_v2" ON streaks
            FOR INSERT 
            WITH CHECK (
                (auth.role() = 'authenticated' AND auth.uid() = user_id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = user_id
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'streaks' 
        AND policyname = 'streaks_authenticated_update_v2'
    ) THEN
        CREATE POLICY "streaks_authenticated_update_v2" ON streaks
            FOR UPDATE 
            USING (
                (auth.role() = 'authenticated' AND auth.uid() = user_id)
                OR
                (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid = user_id
            );
    END IF;

    RAISE NOTICE '✅ Streaks policies created successfully';
END $$;

-- ========================================
-- 5단계: 기존 사용자 복구
-- ========================================

DO $$
DECLARE
    auth_user RECORD;
    user_count INTEGER := 0;
    total_users INTEGER;
    total_profiles INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_users FROM auth.users;
    SELECT COUNT(*) INTO total_profiles FROM profiles;
    
    RAISE NOTICE '📊 Current: % users, % profiles', total_users, total_profiles;
    
    FOR auth_user IN 
        SELECT au.id, au.email, au.raw_user_meta_data, au.created_at
        FROM auth.users au
        LEFT JOIN profiles p ON au.id = p.id
        WHERE p.id IS NULL
        ORDER BY au.created_at DESC
    LOOP
        BEGIN
            INSERT INTO profiles (id, email, full_name, display_name, avatar_url)
            VALUES (
                auth_user.id,
                COALESCE(auth_user.email, ''),
                COALESCE(
                    auth_user.raw_user_meta_data->>'full_name',
                    auth_user.raw_user_meta_data->>'name',
                    NULL
                ),
                COALESCE(
                    auth_user.raw_user_meta_data->>'display_name',
                    auth_user.raw_user_meta_data->>'name',
                    auth_user.raw_user_meta_data->>'full_name',
                    SPLIT_PART(COALESCE(auth_user.email, ''), '@', 1),
                    '익명 사용자'
                ),
                COALESCE(
                    auth_user.raw_user_meta_data->>'avatar_url',
                    auth_user.raw_user_meta_data->>'picture',
                    NULL
                )
            );
            
            INSERT INTO user_settings (user_id) VALUES (auth_user.id) ON CONFLICT (user_id) DO NOTHING;
            INSERT INTO streaks (user_id, note_type) 
            VALUES (auth_user.id, 'gratitude'), (auth_user.id, 'sermon'), (auth_user.id, 'prayer')
            ON CONFLICT (user_id, note_type) DO NOTHING;
            
            user_count := user_count + 1;
            RAISE NOTICE '✅ Created profile: % (%)', auth_user.email, auth_user.id;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Error for user %: %', auth_user.email, SQLERRM;
        END;
    END LOOP;
    
    SELECT COUNT(*) INTO total_profiles FROM profiles;
    RAISE NOTICE '📊 Final: % users, % profiles', total_users, total_profiles;
    
    IF user_count > 0 THEN
        RAISE NOTICE '✅ Created % new profiles', user_count;
    ELSE
        RAISE NOTICE '✅ All users already have profiles';
    END IF;
END $$;

-- ========================================
-- 6단계: 최종 검증
-- ========================================

DO $$
DECLARE
    policy_count INTEGER;
    trigger_exists BOOLEAN;
    sample_user auth.users%ROWTYPE;
    sample_profile profiles%ROWTYPE;
BEGIN
    -- 정책 개수 확인
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename = 'profiles';
    RAISE NOTICE '📋 Active policies: %', policy_count;
    
    -- 트리거 확인
    SELECT EXISTS(
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
    ) INTO trigger_exists;
    RAISE NOTICE '🔄 Trigger exists: %', trigger_exists;
    
    -- 샘플 확인
    SELECT * INTO sample_user FROM auth.users WHERE email LIKE '%@gmail.com' LIMIT 1;
    IF FOUND THEN
        SELECT * INTO sample_profile FROM profiles WHERE id = sample_user.id;
        IF FOUND THEN
            RAISE NOTICE '✅ Sample profile: % (%, %)', 
                sample_user.id, sample_profile.email, sample_profile.display_name;
        ELSE
            RAISE NOTICE '⚠️ No profile for user: %', sample_user.id;
        END IF;
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ===================================';
    RAISE NOTICE '🎉 CLEANUP & FIX COMPLETED!';
    RAISE NOTICE '🎉 ===================================';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Next: Refresh your application and test OAuth';
END $$;