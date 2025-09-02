# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code (claude.ai/code)에 대한 지침을 제공합니다.

## 명령어

### 개발
- `npm run dev` - Next.js 개발 서버 시작 (http://localhost:3000)
- `npm run build` - 프로덕션 Next.js 애플리케이션 빌드
- `npm run start` - 프로덕션 서버 시작
- `npm run lint` - Next.js 린팅 실행

### 모바일 개발 (Capacitor)
- `npx cap sync` - 웹 앱을 네이티브 프로젝트에 동기화
- `npx cap run ios` - iOS 시뮬레이터에서 앱 실행
- `npx cap run android` - Android 에뮬레이터에서 앱 실행

## 아키텍처

### 기술 스택
- **Next.js 15.5.2** App Router 사용
- **TypeScript** strict 모드 적용
- **Tailwind CSS 4** 스타일링
- **Capacitor** 네이티브 모바일 앱 (iOS/Android)
- **Google Fonts** next/font 통합

### 프로젝트 구조
- `/app` - Next.js App Router 페이지 및 레이아웃
  - `/[locale]` - 다국어 라우트 (ko, en, es, pt)
  - `/globals.css` - 전역 스타일 및 폰트 정의
- `/components` - React 컴포넌트
  - `/onboarding` - 온보딩 플로우 컴포넌트
- `/contexts` - 전역 상태용 React 컨텍스트
- `/hooks` - 커스텀 React 훅
- `/utils` - 유틸리티 함수
- `/middleware.ts` - 로케일 감지 및 라우팅

### 주요 기능

#### 다국어 지원 (i18n)
- 브라우저/기기 설정에서 자동 로케일 감지
- 지원 언어: 한국어(ko), 영어(en), 스페인어(es), 포르투갈어(pt)
- 미들웨어가 로케일 라우팅 및 리다이렉션 처리
- `TranslationProvider`를 통한 번역 컨텍스트 제공

#### 모바일 세이프존
- 기기 세이프 영역용 CSS 변수: `--actual-safe-top`, `--actual-safe-bottom`
- 모든 기기의 노치, 홈 인디케이터 완벽 지원
- 개발용 시각화 제공 (빨간색 오버레이)

#### 폰트 시스템
layout.tsx에 정의된 커스텀 폰트 변수:
- `font-jua` - 한글 메인 텍스트
- `font-sour-gummy` - "Thankful" 브랜딩
- `font-fascinate` - 영어 장식용
- `font-hubballi` - 영어 기본
- `font-dongle` - 한글 캐주얼
- `font-noto-serif-kr` - 한글 세리프
- `font-nanum-brush-script` - 한글 붓글씨

#### Capacitor 모바일 앱
- 배경색: #eeead9 (베이지)
- 웹 디렉토리: public
- 로컬 개발 URL: http://localhost:3000
- iOS 및 Android 프로젝트 구성 완료

### 개발 참고사항

#### 경로 임포트
프로젝트 루트에서 절대 경로 임포트시 `@/` 사용 (tsconfig.json에 설정됨)

#### 세이프존 사용법
```jsx
<div style={{ height: 'var(--actual-safe-top)' }}></div>
<div style={{ height: 'var(--actual-safe-bottom)' }}></div>
```

#### 폰트 사용법
```jsx
// CSS 클래스 방식
<p className="font-jua">한글 텍스트</p>

// 인라인 스타일 방식
<p style={{ fontFamily: 'Jua, sans-serif' }}>한글 텍스트</p>
```

#### 테스트
- `/test` 페이지에서 폰트 및 세이프존 검증 가능
- 현재 자동화된 테스트 스위트는 구성되지 않음