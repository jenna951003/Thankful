# OAuth "Flow state not found" 오류 해결 가이드

## 🔍 **문제 원인**
"Flow state not found" 오류는 다음과 같은 이유로 발생합니다:

1. **브라우저 쿠키/스토리지 문제**
2. **잘못된 콜백 URL 설정**
3. **브라우저 보안 설정**
4. **개발 환경 특성**

## 🛠️ **해결 방법**

### 1. **즉시 시도할 수 있는 방법들**

#### A. 브라우저 캐시 및 쿠키 삭제
```
1. F12 개발자 도구 열기
2. Application 탭 → Storage → Clear storage
3. 또는 브라우저 설정에서 localhost 쿠키 삭제
4. 페이지 새로고침 후 다시 시도
```

#### B. 시크릿/프라이빗 브라우저 모드
```
1. Ctrl+Shift+N (Chrome) 또는 Ctrl+Shift+P (Firefox)
2. 시크릿 모드에서 http://localhost:3000 접속
3. OAuth 로그인 시도
```

#### C. 다른 브라우저 사용
```
- Chrome에서 안되면 Firefox, Safari 등 시도
- 각 브라우저마다 쿠키/스토리지 정책이 다름
```

### 2. **Supabase 설정 확인**

Supabase Dashboard에서 다음을 확인하세요:

```
1. Authentication → Providers → Google
2. Authorized redirect URIs에 다음이 포함되어야 함:
   - http://localhost:3000/auth/callback
   - http://localhost:3000/**
   
3. Site URL 설정:
   - http://localhost:3000
```

### 3. **Google OAuth 설정 확인**

Google Cloud Console에서:

```
1. APIs & Services → Credentials
2. OAuth 2.0 Client IDs 선택
3. Authorized redirect URIs:
   - http://localhost:3000/auth/callback
   - https://[your-project-ref].supabase.co/auth/v1/callback
```

## 🚀 **임시 해결책 (테스트용)**

현재 이메일/비밀번호 로그인은 정상 작동하므로, OAuth 문제를 우선 해결하기 위해:

1. **이메일 회원가입으로 계정 생성**
2. **Supabase 설정 점검**
3. **OAuth 재설정**

## 📝 **디버깅 체크리스트**

### 브라우저 콘솔에서 확인할 로그들:
```javascript
// AuthContext에서:
Starting Google OAuth...
OAuth response: { data: {...}, error: null }

// 콜백 페이지에서:
Starting auth callback handling...
URL params: { errorParam: "server_error", errorDescription: "Flow state not found" }
```

### 네트워크 탭에서 확인할 요청들:
```
1. /auth/callback 요청
2. Supabase auth API 호출들
3. Google OAuth 리다이렉션 체인
```

## ⚡ **빠른 테스트 방법**

1. 브라우저 개발자 도구 → Console 열기
2. 다음 명령어 실행:
```javascript
// 현재 세션 확인
window.supabase?.auth.getSession()

// 스토리지 상태 확인
localStorage.getItem('supabase.auth.token')
sessionStorage.clear()
localStorage.clear()
```

3. 페이지 새로고침 후 OAuth 재시도

---

**참고**: 이 오류는 주로 개발 환경에서 발생하며, 프로덕션 환경에서는 보통 정상 작동합니다.