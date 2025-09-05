-- ==============================================
-- RLS (Row Level Security) 정책 설정
-- 4개 테이블: profiles, user_settings, notes, streaks
-- ==============================================

-- 1. PROFILES 테이블 RLS 설정
-- ==============================================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 업데이트 가능
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 생성 가능
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. USER_SETTINGS 테이블 RLS 설정
-- ==============================================

-- RLS 활성화
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON user_settings;

-- 사용자는 자신의 설정만 조회 가능
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 설정만 업데이트 가능
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 설정만 생성 가능
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 설정만 삭제 가능
CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- 3. NOTES 테이블 RLS 설정 (기존 정책 재확인/업데이트)
-- ==============================================

-- RLS 활성화 (이미 되어있을 수 있음)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view own notes" ON notes;
DROP POLICY IF EXISTS "Users can view public notes" ON notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON notes;
DROP POLICY IF EXISTS "Users can update own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON notes;

-- 사용자는 자신의 노트만 조회 가능
CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

-- 모든 사용자는 공개 노트 조회 가능 (is_public = true)
CREATE POLICY "Users can view public notes" ON notes
  FOR SELECT USING (is_public = true);

-- 사용자는 자신의 노트만 생성 가능
CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 노트만 업데이트 가능
CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 노트만 삭제 가능
CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- 4. STREAKS 테이블 RLS 설정
-- ==============================================

-- RLS 활성화
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can update own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can insert own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can delete own streaks" ON streaks;

-- 사용자는 자신의 스트릭만 조회 가능
CREATE POLICY "Users can view own streaks" ON streaks
  FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 스트릭만 업데이트 가능
CREATE POLICY "Users can update own streaks" ON streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 스트릭만 생성 가능
CREATE POLICY "Users can insert own streaks" ON streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 스트릭만 삭제 가능
CREATE POLICY "Users can delete own streaks" ON streaks
  FOR DELETE USING (auth.uid() = user_id);

-- ==============================================
-- 정책 확인용 쿼리 (실행 후 확인하세요)
-- ==============================================

-- 모든 테이블의 RLS 활성화 상태 확인
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'user_settings', 'notes', 'streaks')
ORDER BY tablename;

-- 각 테이블의 정책 확인
SELECT 
  t.tablename,
  p.policyname,
  p.cmd as command_type,
  p.qual as using_expression,
  p.with_check as with_check_expression
FROM pg_policies p
JOIN pg_tables t ON p.tablename = t.tablename
WHERE t.schemaname = 'public' 
  AND t.tablename IN ('profiles', 'user_settings', 'notes', 'streaks')
ORDER BY t.tablename, p.policyname;