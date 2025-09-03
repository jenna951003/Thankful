-- EMERGENCY FIX: OAuth 로그인 후 profiles 테이블 접근 권한 문제 해결
-- Supabase SQL Editor에서 실행하세요

-- 1. 먼저 기존 테이블들이 있는지 확인하고 없으면 생성
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

-- 2. RLS 활성화 (이미 활성화되어 있어도 안전)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. 기존 정책들 삭제 후 재생성 (충돌 방지)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- 4. 새 RLS 정책 생성 (더 안전하고 포괄적)
CREATE POLICY "Enable read access for users based on user_id" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for users based on user_id" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 5. user_settings 테이블도 같이 처리
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

DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;

CREATE POLICY "Enable read access for users based on user_id" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. streaks 테이블도 처리
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

DROP POLICY IF EXISTS "Users can view their own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can insert their own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON streaks;

CREATE POLICY "Enable read access for users based on user_id" ON streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. OAuth 사용자를 위한 트리거 함수 (개선된 버전)
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
        ''
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

-- 8. 트리거 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 9. 기존 OAuth 사용자들을 위한 복구 함수
CREATE OR REPLACE FUNCTION fix_oauth_users()
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

-- 10. 즉시 기존 사용자들 복구 실행
SELECT * FROM fix_oauth_users();

-- Success message
SELECT 'Emergency fix completed! All tables, RLS policies, and triggers are now properly configured.' AS status;