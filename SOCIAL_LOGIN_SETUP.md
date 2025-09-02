# 소셜 로그인 설정 가이드

이 문서는 Thankful 앱에서 구글, 페이스북, 애플 소셜 로그인을 활성화하기 위한 설정 가이드입니다.

## 🚀 현재 구현 상태

✅ **완료된 부분:**
- AuthContext에 소셜 로그인 함수들 구현
- LoginModal과 SignUpModal에 소셜 로그인 버튼 연결
- OAuth 리다이렉트 처리 (`/auth/callback`)
- 에러 처리 및 사용자 피드백

🔧 **설정이 필요한 부분:**
- Supabase 대시보드에서 각 제공자 활성화
- OAuth 앱 생성 및 클라이언트 키 설정

---

## 1. Google 로그인 설정

### 1.1 Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **라이브러리**로 이동
4. **Google+ API** 검색 후 활성화

### 1.2 OAuth 클라이언트 ID 생성

1. **API 및 서비스** > **사용자 인증 정보**로 이동
2. **+ 사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
3. 애플리케이션 유형: **웹 애플리케이션** 선택
4. **승인된 자바스크립트 원본** 추가:
   - `http://localhost:3000` (개발용)
   - `https://your-domain.com` (프로덕션용)
5. **승인된 리디렉션 URI** 추가:
   - `http://localhost:3000/auth/callback` (개발용)
   - `https://your-domain.com/auth/callback` (프로덕션용)
6. **만들기** 클릭 후 클라이언트 ID 복사

### 1.3 Supabase 설정

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 프로젝트 선택
2. **Authentication** > **Providers** 메뉴로 이동
3. **Google** 제공자 클릭
4. **Enable sign in with Google** 토글 활성화
5. Google OAuth 설정 입력:
   - **Client ID**: Google에서 생성한 클라이언트 ID
   - **Client Secret**: Google에서 생성한 클라이언트 시크릿
6. **Save** 클릭

---

## 2. Facebook 로그인 설정

### 2.1 Facebook 개발자 콘솔 설정

1. [Facebook for Developers](https://developers.facebook.com/)에 접속
2. **내 앱** > **앱 만들기** 클릭
3. 앱 유형: **소비자** 또는 **기타** 선택
4. 앱 이름과 연락처 이메일 입력

### 2.2 Facebook 로그인 제품 추가

1. 대시보드에서 **+ 제품 추가** 클릭
2. **Facebook 로그인** > **설정** 클릭
3. **웹** 플랫폼 선택
4. **사이트 URL** 입력:
   - `http://localhost:3000` (개발용)
   - `https://your-domain.com` (프로덕션용)

### 2.3 OAuth 리디렉션 URI 설정

1. **Facebook 로그인** > **설정** 메뉴로 이동
2. **유효한 OAuth 리디렉션 URI** 추가:
   - `http://localhost:3000/auth/callback` (개발용)
   - `https://your-domain.com/auth/callback` (프로덕션용)
3. **변경 내용 저장** 클릭

### 2.4 Supabase 설정

1. Supabase 대시보드에서 **Authentication** > **Providers** 이동
2. **Facebook** 제공자 클릭
3. **Enable sign in with Facebook** 토글 활성화
4. Facebook 앱 설정 입력:
   - **App ID**: Facebook 앱 ID
   - **App Secret**: Facebook 앱 시크릿
5. **Save** 클릭

---

## 3. Apple 로그인 설정

### 3.1 Apple Developer 계정 설정

1. [Apple Developer](https://developer.apple.com/)에 로그인
2. **Certificates, Identifiers & Profiles**로 이동
3. **Identifiers** > **+** 버튼 클릭
4. **App IDs** 선택 후 **Continue**
5. 앱 정보 입력 및 **Sign In with Apple** 기능 활성화

### 3.2 Service ID 생성

1. **Identifiers** > **+** 버튼 클릭
2. **Services IDs** 선택 후 **Continue**
3. Service ID 정보 입력
4. **Sign In with Apple** 체크박스 활성화
5. **Configure** 버튼 클릭
6. **Primary App ID** 선택
7. **Website URLs** 추가:
   - Domain: `localhost` 또는 `your-domain.com`
   - Return URL: `http://localhost:3000/auth/callback` 또는 `https://your-domain.com/auth/callback`

### 3.3 Private Key 생성

1. **Keys** > **+** 버튼 클릭
2. Key 이름 입력
3. **Sign In with Apple** 체크박스 활성화
4. **Configure** 클릭 후 App ID 선택
5. **Save** 후 **Continue**
6. **Register** 클릭
7. 생성된 Key 파일 (.p8) 다운로드

### 3.4 Supabase 설정

1. Supabase 대시보드에서 **Authentication** > **Providers** 이동
2. **Apple** 제공자 클릭
3. **Enable sign in with Apple** 토글 활성화
4. Apple 설정 입력:
   - **Services ID**: Apple에서 생성한 Services ID
   - **Team ID**: Apple Developer 계정의 Team ID
   - **Key ID**: 생성한 Key의 ID
   - **Private Key**: .p8 파일의 내용
5. **Save** 클릭

---

## 4. 환경 변수 확인

`.env.local` 파일에 다음 환경 변수들이 올바르게 설정되어 있는지 확인하세요:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 5. 테스트 방법

### 5.1 개발 환경에서 테스트

1. `npm run dev` 명령어로 개발 서버 시작
2. 브라우저에서 `http://localhost:3000` 접속
3. 온보딩 화면에서 소셜 로그인 버튼 클릭
4. 각 제공자의 로그인 화면이 정상적으로 나타나는지 확인
5. 로그인 완료 후 `/auth/callback`으로 리다이렉트되는지 확인
6. 사용자 정보가 Supabase의 `auth.users` 테이블에 저장되는지 확인

### 5.2 일반적인 오류 해결

**"Provider not enabled" 오류:**
- Supabase 대시보드에서 해당 제공자가 활성화되어 있는지 확인
- 클라이언트 ID와 시크릿이 올바르게 입력되었는지 확인

**리디렉트 오류:**
- 각 제공자의 콘솔에서 리디렉트 URI가 정확히 설정되었는지 확인
- HTTP vs HTTPS 프로토콜이 일치하는지 확인

**권한 오류:**
- Facebook: 앱이 개발 모드인 경우, 개발자 계정만 로그인 가능
- Apple: Service ID와 App ID가 올바르게 연결되었는지 확인

---

## 6. 프로덕션 배포 시 주의사항

### 6.1 도메인 설정 업데이트

1. 각 제공자의 콘솔에서 프로덕션 도메인 추가
2. Supabase Site URL을 프로덕션 URL로 업데이트
3. 리디렉트 URI를 HTTPS로 변경

### 6.2 보안 고려사항

1. 클라이언트 시크릿을 안전하게 관리
2. HTTPS 사용 필수
3. CORS 설정 확인
4. CSP (Content Security Policy) 헤더 설정

---

## 7. 지원 및 문제 해결

문제가 발생하면 다음을 확인하세요:

1. Supabase 대시보드의 **Logs** 섹션에서 오류 확인
2. 브라우저 개발자 도구의 콘솔에서 JavaScript 오류 확인
3. 네트워크 탭에서 API 호출 상태 확인

추가 도움이 필요하면:
- [Supabase 문서](https://supabase.com/docs/guides/auth)
- [Next.js 인증 가이드](https://nextjs.org/docs/authentication)
- 각 제공자의 공식 문서 참조

---

## 8. 참고 링크

- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth 문서](https://developers.google.com/identity/protocols/oauth2)
- [Facebook 로그인 문서](https://developers.facebook.com/docs/facebook-login)
- [Apple Sign In 문서](https://developer.apple.com/sign-in-with-apple/)