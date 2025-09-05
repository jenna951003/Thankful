-- ==============================================
-- 이메일 존재 여부 확인을 위한 RPC 함수 생성
-- 비밀번호 찾기 모달에서 사용
-- ==============================================

-- 기존 함수 삭제 (있다면)
DROP FUNCTION IF EXISTS check_email_exists(text);

-- 이메일 존재 여부 확인 함수 생성
CREATE OR REPLACE FUNCTION check_email_exists(check_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- RLS 우회하여 실행
SET search_path = public
AS $$
DECLARE
    email_count integer;
BEGIN
    -- 입력값 검증
    IF check_email IS NULL OR check_email = '' THEN
        RETURN false;
    END IF;
    
    -- profiles 테이블에서 이메일 존재 여부 확인
    SELECT COUNT(*)
    INTO email_count
    FROM profiles
    WHERE LOWER(email) = LOWER(TRIM(check_email));
    
    -- 이메일이 존재하면 true, 아니면 false 반환
    RETURN email_count > 0;
END;
$$;

-- 함수 사용 권한 부여 (모든 인증된 사용자)
GRANT EXECUTE ON FUNCTION check_email_exists(text) TO authenticated;

-- 함수 사용 권한 부여 (익명 사용자도 가능)
GRANT EXECUTE ON FUNCTION check_email_exists(text) TO anon;

-- ==============================================
-- 함수 테스트용 쿼리 (실행 후 확인)
-- ==============================================

-- 테스트: 존재하는 이메일 확인
-- SELECT check_email_exists('test@example.com');

-- 테스트: 존재하지 않는 이메일 확인  
-- SELECT check_email_exists('nonexistent@example.com');

-- 함수 생성 확인
SELECT 
    proname as function_name,
    pg_get_function_identity_arguments(oid) as arguments,
    proowner::regrole as owner
FROM pg_proc 
WHERE proname = 'check_email_exists';

-- 권한 확인
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines 
WHERE routine_name = 'check_email_exists';

COMMENT ON FUNCTION check_email_exists(text) IS 
'비밀번호 재설정 시 이메일 존재 여부를 확인하는 함수. 보안상 존재하지 않는 이메일에 대해서도 적절한 메시지를 표시하기 위해 사용.';