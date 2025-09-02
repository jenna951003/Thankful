# 🗄️ Supabase 데이터베이스 설정 가이드

새로운 인증 시스템을 위해 데이터베이스를 완전히 초기화하고 최적화된 스키마로 교체합니다.

## 📋 단계별 실행 가이드

### 1단계: Supabase 대시보드 접속
1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. `thankful` 프로젝트 선택
3. 좌측 메뉴에서 **"SQL Editor"** 클릭

### 2단계: 기존 데이터베이스 초기화 (필수)
**⚠️ 주의: 이 단계는 모든 기존 데이터를 삭제합니다!**

1. SQL Editor에서 **"New query"** 클릭
2. `supabase-reset.sql` 파일 내용을 복사하여 붙여넣기
3. **"Run"** 버튼 클릭하여 실행
4. 성공 메시지 확인: `Database has been completely reset. Ready for new schema!`

### 3단계: 새로운 최적화 스키마 적용
1. SQL Editor에서 새로운 쿼리 생성
2. `supabase-new-schema.sql` 파일 내용을 복사하여 붙여넣기
3. **"Run"** 버튼 클릭하여 실행
4. 성공 메시지 확인: `New optimized schema created successfully!`

## 🔧 새로운 스키마 특징

### 📊 테이블 구조
- **profiles**: 사용자 프로필 (구독 정보 포함)
- **user_settings**: 사용자 설정 (언어, 테마 등)
- **notes**: 감사/설교/기도 노트
- **streaks**: 연속 기록 추적

### 🔒 보안 기능
- **Row Level Security (RLS)** 모든 테이블에 적용
- **자동 프로필 생성** 회원가입 시 트리거 실행
- **연속 기록 자동 업데이트** 노트 생성 시 트리거 실행

### ⚡ 성능 최적화
- 주요 컬럼에 인덱스 적용
- 효율적인 쿼리 구조
- SSR 최적화된 타입 정의

## ✅ 설정 완료 확인

데이터베이스 설정이 완료되면 다음을 확인하세요:

1. **테이블 확인**: Supabase 대시보드 → "Database" → "Tables"
2. **필수 테이블**: `profiles`, `user_settings`, `notes`, `streaks`
3. **RLS 정책**: 각 테이블에 보안 정책 적용 확인

## 🚀 다음 단계

데이터베이스 설정 완료 후:
1. 개발 서버 재시작
2. 회원가입/로그인 기능 테스트
3. 새로운 인증 플로우 확인

---

💡 **문제 발생 시**: 
- SQL 실행 오류가 있다면 첫 번째 단계(reset)부터 다시 실행
- 각 단계마다 성공 메시지를 반드시 확인