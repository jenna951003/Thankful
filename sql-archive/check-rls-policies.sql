-- RLS 정책 상태 확인 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 현재 활성화된 모든 RLS 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- 2. 테이블별 RLS 활성화 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_settings', 'streaks')
ORDER BY tablename;

-- 3. 트리거 상태 확인
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND trigger_name = 'on_auth_user_created';

-- 4. 간단한 권한 테스트 (현재 사용자 기준)
DO $$
DECLARE
    test_result TEXT;
BEGIN
    -- 현재 사용자 정보 확인
    RAISE NOTICE 'Current user: %', current_user;
    RAISE NOTICE 'Current role: %', current_setting('role', true);
    
    -- auth.uid() 함수 테스트
    BEGIN
        test_result := auth.uid()::text;
        RAISE NOTICE 'auth.uid() result: %', test_result;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'auth.uid() failed: %', SQLERRM;
    END;
    
    -- JWT 클레임 테스트
    BEGIN
        test_result := current_setting('request.jwt.claims', true);
        RAISE NOTICE 'JWT claims: %', test_result;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'JWT claims failed: %', SQLERRM;
    END;
    
END $$;

-- 5. 샘플 프로필 확인
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN email LIKE '%@gmail.com' THEN 1 END) as gmail_profiles
FROM profiles;

-- 6. 최근 auth 사용자 확인
SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data->>'provider' as oauth_provider
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;