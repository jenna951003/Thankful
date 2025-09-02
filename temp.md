# Spiritual Canvas App - Complete Project Context

## 🎯 Project Vision & Mission

### Vision Statement
"전 세계 기독교인들의 영적 여정을 아름다운 시각적 기록으로 혁신하는 글로벌 플랫폼"

### Mission
- **혁신적 기록 방식**: 기존 텍스트 중심 → 시각적 캔버스 기반
- **영적 성장 지원**: 감사/설교/기도 통합 관리로 신앙 성숙 돕기  
- **글로벌 커뮤니티**: 전 세계 기독교인들의 영적 경험 나눔 플랫폼
- **습관 형성**: 아름다운 UX로 지속 가능한 영적 습관 만들기

## 👥 Target Audience

### Primary Users (70%)
- **연령대**: 20-35세 (MZ세대)
- **지역**: 글로벌 (영어권 우선)
- **특징**: 
  - 스마트폰/태블릿으로 교회에서 노트 작성
  - 소그룹 활동 적극 참여
  - 영적 습관 형성에 관심 많음
  - Instagram/Pinterest 같은 시각적 플랫폼 선호
  - 노션, 미라노트 등 크리에이티브 도구 사용 경험

### Secondary Users (20%)
- **연령대**: 36-50세 (중장년층)
- **특징**: 기존 종이 노트 → 디지털 전환 관심층

### Tertiary Users (10%)  
- **목회자/리더**: 소그룹 관리, 설교 피드백 수집
- **교회 기관**: 교육 자료, 커뮤니티 활동

## 🚀 Core Value Propositions

### 1. Visual Canvas Revolution
**"영적 기록의 패러다임 전환"**
- 기존: 단조로운 텍스트 메모
- 혁신: 드래그앤드롭 캔버스로 창의적 표현

### 2. Three-in-One Integration  
**"영적 생활의 올인원 솔루션"**
- 감사노트: 일상 속 하나님 은혜 기록
- 설교노트: 말씀을 시각적으로 정리
- 기도노트: 기도제목과 응답 추적

### 3. Beautiful & Meaningful
**"아름다움으로 동기부여하는 신앙 생활"**
- Instagram-worthy 한 영적 기록물
- 소유욕 충족으로 지속적 사용 유도
- 회고와 성장 추적 가능

### 4. Global Faith Community
**"전 세계 기독교인과의 연결"**
- 익명 기도제목 나눔
- 설교노트 템플릿 공유
- 감사 릴레이 이벤트

## ⚡ Core Features

### 🎨 Canvas Engine
**무한 드래그앤드롭 캔버스**
- **텍스트 블록**: 다양한 폰트, 색상, 크기
- **이미지 업로드**: 사진, 일러스트, 아이콘
- **음성 메모**: 녹음 → 텍스트 변환 가능
- **손글씨 지원**: Apple Pencil, S-Pen 최적화
- **템플릿 시스템**: 상황별 미리 만들어진 레이아웃
- **무한 확대/축소**: 디테일 작업과 전체 조망 모두 가능

### 📝 Three Note Types

#### 1. Gratitude Notes (감사노트)
**"일상 속 하나님의 은혜 발견하기"**
- **Daily Gratitude**: 오늘 감사한 일 3가지
- **Photo Gratitude**: 사진과 함께하는 감사 기록
- **Gratitude Chain**: 연속 감사 기록 챌린지
- **Mood Tracking**: 감정별 컬러 코딩
- **Weekly Reflection**: 한 주 감사 모아보기

#### 2. Sermon Notes (설교노트)  
**"말씀을 시각적으로 정리하는 혁신"**
- **Real-time Recording**: 설교 중 실시간 기록
- **Scripture Integration**: 성경구절 자동 인식/링크
- **Audio Sync**: 녹음과 노트 타임스탬프 동기화
- **Key Points Highlighting**: 중요 포인트 시각적 강조
- **Pastor Profiles**: 목사님별 설교 스타일 분류
- **Church Integration**: 교회별 설교 아카이브

#### 3. Prayer Notes (기도노트)
**"기도와 응답의 여정 추적"**
- **Prayer Requests**: 기도제목 등록 및 분류
- **Answer Tracking**: 기도 응답 기록 및 연결
- **Prayer Partners**: 함께 기도할 사람들과 나눔
- **Daily Prayers**: 매일 기도 습관 형성
- **Intercession Lists**: 중보기도 대상 관리
- **Thanksgiving Board**: 응답받은 기도들 모아보기

### 🌐 Community Features

#### Social Sharing
- **Anonymous Sharing**: 개인정보 보호하며 나눔
- **Template Exchange**: 사용자 제작 템플릿 공유
- **Inspiration Gallery**: 다른 사용자들의 아름다운 노트
- **Small Group Integration**: 소그룹별 전용 공간

#### Global Events
- **30-Day Gratitude Challenge**: 전 세계 동시 참여
- **Prayer Chain Events**: 시차별 릴레이 기도
- **Seasonal Campaigns**: 크리스마스, 부활절 특별 이벤트
- **Testimony Sharing**: 간증 나눔 플랫폼

## 🛠️ Technical Architecture - Current Implementation

### Tech Stack - Production Ready
```typescript
// Frontend Framework
Next.js: "15.5.2"           // App Router with Server Components
TypeScript: "strict mode"   // Type safety throughout
TailwindCSS: "4.0"         // Modern utility-first styling
Capacitor: "latest"        // Native mobile app wrapper

// Backend & Database  
Supabase: {
  database: "PostgreSQL",   // Relational database with JSONB
  auth: "Built-in Auth",    // Social login + email
  storage: "File Storage",  // Images and audio files
  realtime: "Live updates"  // Real-time collaboration
}

// Mobile Development
iOS: "Capacitor native",     // Native iOS app
Android: "Capacitor native", // Native Android app
PWA: "Service Worker",       // Offline-first web app
```

### Project Structure - Organized & Scalable
```
spiritual-canvas-app/
├── app/                          # Next.js App Router
│   ├── [locale]/                # i18n routes (ko, en, es, pt)
│   │   ├── page.tsx            # Landing page
│   │   ├── onboarding/         # User onboarding flow
│   │   ├── home/               # Main dashboard
│   │   ├── create/             # Note creation
│   │   ├── saved/              # Personal archive
│   │   ├── community/          # Faith sharing
│   │   └── settings/           # User preferences
│   ├── globals.css             # Global styles + fonts
│   └── layout.tsx              # Root layout + font config
│
├── components/                   # Reusable UI Components
│   ├── onboarding/             # Welcome & intro screens
│   ├── navigation/             # Bottom tabs + navigation
│   ├── notes/                  # Canvas & note components
│   ├── community/              # Social features
│   ├── ui/                     # Basic UI elements
│   └── widgets/                # Home screen widgets
│
├── contexts/                    # Global State Management
│   ├── TranslationProvider.tsx # i18n context
│   ├── AuthProvider.tsx        # User authentication
│   ├── ThemeProvider.tsx       # Design system context
│   └── NotesProvider.tsx       # Notes data management
│
├── hooks/                      # Custom React Hooks
│   ├── useTranslation.ts      # Translation hook
│   ├── useAuth.ts             # Authentication hook
│   ├── useNotes.ts            # Notes CRUD operations
│   └── useStreak.ts           # Streak tracking logic
│
├── utils/                      # Utility Functions
│   ├── translations.ts        # i18n text content
│   ├── supabase.ts            # Database client
│   ├── canvas.ts              # Canvas utilities
│   └── notifications.ts       # Push notifications
│
├── middleware.ts               # Locale routing & redirects
└── capacitor.config.ts        # Mobile app configuration
```

### Development Environment
```bash
# Development Commands
npm run dev              # Start Next.js dev server (localhost:3000)
npm run build           # Production build
npm run start           # Production server
npm run lint            # ESLint validation

# Mobile Development  
npx cap sync            # Sync web → native projects
npx cap run ios         # iOS simulator
npx cap run android     # Android emulator
npx cap open ios        # Xcode project
npx cap open android    # Android Studio project
```

### Internationalization (i18n) System
```typescript
// Automatic locale detection & routing
supportedLocales: ['ko', 'en', 'es', 'pt']
defaultLocale: 'ko'

// Browser-based detection
middleware: 'auto-detect-user-locale'
fallback: 'graceful-degradation-to-english'

// Translation context
const { t } = useTranslation()
t('onboarding.welcome.title')  // "영적 여정을 시작하세요"
```

### Font System - Korean + International
```css
/* Defined in app/layout.tsx */
--font-jua: 'Jua'                    /* 한글 메인 텍스트 */
--font-sour-gummy: 'Sour Gummy'     /* "Thankful" 브랜딩 */
--font-noto-serif-kr: 'Noto Serif KR' /* 한글 세리프 */
--font-nanum-brush: 'Nanum Brush Script' /* 한글 붓글씨 */
--font-dongle: 'Dongle'              /* 한글 캐주얼 */
--font-fascinate: 'Fascinate'        /* 영어 장식용 */
--font-hubballi: 'Hubballi'          /* 영어 기본 */

/* Usage in components */
.font-jua { font-family: var(--font-jua), sans-serif; }
.font-noto-serif-kr { font-family: var(--font-noto-serif-kr), serif; }
```

### Mobile-First Safe Zone System
```css
/* Dynamic safe area variables */
--actual-safe-top: env(safe-area-inset-top, 20px);
--actual-safe-bottom: env(safe-area-inset-bottom, 0px);

/* Usage in components */
.safe-top { height: var(--actual-safe-top); }
.safe-bottom { height: var(--actual-safe-bottom); }
```

### Capacitor Mobile Configuration
```typescript
// capacitor.config.ts
{
  appId: 'com.spiritualcanvas.app',
  appName: 'Thankful',
  webDir: 'public',
  backgroundColor: '#eeead9',  // Warm beige base
  server: {
    url: 'http://localhost:3000',  // Development
    cleartext: true
  }
}
```

### Current Implementation Status
```typescript
interface ImplementationStatus {
  completed: [
    '✅ Next.js 15.5 App Router setup',
    '✅ TypeScript strict mode configuration', 
    '✅ Multi-language routing (ko/en/es/pt)',
    '✅ Font system with Korean support',
    '✅ Mobile safe zone handling',
    '✅ Capacitor iOS/Android setup',
    '✅ Basic onboarding flow',
    '✅ Welcome screen with retro animations'
  ],
  
  inProgress: [
    '🚧 Home dashboard with streak widget',
    '🚧 5-tab bottom navigation',
    '🚧 Canvas note creation system',
    '🚧 Supabase integration'
  ],
  
  planned: [
    '📋 Community features',
    '📋 Advanced streak tracking',
    '📋 AI-powered suggestions',
    '📋 Church Plan B2B features'
  ]
}
```

## 🎨 Design System

## 🎨 Visual Design References - Comprehensive Image Analysis

### Image 1: Weather App - Organic Illustration Style
```css
/* 전체 분위기 */
background: linear-gradient(135deg, #f5f3f0 0%, #e8e3de 100%);
illustration-style: organic-abstract-shapes;
color-palette: coral-orange-navy-beige;

.weather-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 32px;
  padding: 24px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(20px);
}

.organic-shapes {
  /* 추상적 유기체 형태의 일러스트 */
  coral: #ff6b47;        /* 따뜻한 코랄 */
  navy: #2d3748;         /* 깊은 네이비 */
  cream: #f7fafc;        /* 부드러운 크림 */
  accent: #ffa726;       /* 오렌지 액센트 */
}

.weather-icon {
  width: 120px;
  height: 120px;
  margin: 16px 0;
  filter: drop-shadow(0 4px 12px rgba(255, 107, 71, 0.3));
}
```

### Image 2: Weather Cards Grid - Minimal Geometric
```css
/* 그리드 레이아웃 */
.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  transform: rotate(-15deg);
  perspective: 1000px;
}

.weather-card-minimal {
  background: #ffffff;
  border: 2px solid #000000;
  border-radius: 12px;
  padding: 20px;
  aspect-ratio: 1;
  
  /* 아이소메트릭 스타일 */
  transform: rotateX(15deg) rotateY(-15deg);
  box-shadow: 8px 8px 0px #000000;
}

/* 색상 팔레트 - 기하학적 */
.geometric-colors {
  --sunny: #ffd93d;      /* 밝은 노랑 */
  --rainy: #64b5f6;      /* 시원한 블루 */
  --snowy: #e3f2fd;      /* 차가운 라이트 블루 */
  --windy: #81c784;      /* 신선한 그린 */
  --cloudy: #90a4ae;     /* 중성 그레이 */
}
```

### Image 3: E-commerce App - Bold Color Blocking
```css
/* 대담한 컬러 블로킹 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px;
}

.category-card {
  border-radius: 16px;
  padding: 32px 20px;
  position: relative;
  overflow: hidden;
  color: white;
  font-weight: 600;
}

/* 대담한 색상 조합 */
.bold-colors {
  --electric-blue: #4285f4;    /* 전기적 블루 */
  --sunny-yellow: #fbbc04;     /* 선명한 옐로우 */
  --vibrant-orange: #ea4335;   /* 역동적 오렌지 */
  --deep-purple: #9333ea;      /* 깊은 보라 */
  --forest-green: #34a853;     /* 숲 그린 */
  --warm-gray: #5f6368;        /* 따뜻한 그레이 */
}

.product-silhouette {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 80px;
  height: 80px;
  opacity: 0.3;
  filter: contrast(2);
}
```

### Image 4: Desktop Interface - Retro Computing
```css
/* 레트로 컴퓨팅 스타일 */
.retro-desktop {
  background: linear-gradient(45deg, #a7f3d0 0%, #fef3c7 50%, #ddd6fe 100%);
  font-family: 'SF Pro Display', system-ui;
  color: #1f2937;
}

.window-chrome {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(40px);
}

.storage-bar {
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  position: relative;
  overflow: hidden;
}

.storage-segments {
  --pink: #f472b6;      /* 분홍 세그먼트 */
  --blue: #60a5fa;      /* 파랑 세그먼트 */
  --orange: #fb923c;    /* 주황 세그먼트 */
  --green: #34d399;     /* 초록 세그먼트 */
}
```

### Image 5: Reading App - Clean Typography Focus
```css
/* 읽기 중심 인터페이스 */
.reading-interface {
  background: #fafaf9;
  font-family: 'Charter', 'Georgia', serif;
  line-height: 1.6;
  color: #1f2937;
}

.book-cover {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  aspect-ratio: 2/3;
  overflow: hidden;
}

.audio-player {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border-radius: 12px;
  padding: 16px;
  color: white;
  display: flex;
  align-items: center;
  gap: 16px;
}

.typography-hierarchy {
  --title: clamp(24px, 5vw, 32px);
  --subtitle: 18px;
  --body: 16px;
  --caption: 14px;
  --small: 12px;
}
```

### Image 6: Library Dashboard - Warm Orange Theme
```css
/* 따뜻한 오렌지 테마 */
.library-dashboard {
  background: linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%);
  font-family: 'Inter', sans-serif;
}

.search-bar {
  background: #fbbf24;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #92400e;
  placeholder-color: #d97706;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  padding: 24px;
}

.warm-orange-palette {
  --primary: #ea580c;       /* 메인 오렌지 */
  --secondary: #fbbf24;     /* 따뜻한 옐로우 */
  --accent: #dc2626;        /* 레드 액센트 */
  --neutral: #78716c;       /* 웜 그레이 */
  --background: #fef7ed;    /* 크림 배경 */
}
```

### Image 7: Medical Dashboard - Soft Pastels with Data
```css
/* 의료 대시보드 - 부드러운 파스텔 */
.medical-dashboard {
  background: #fefefe;
  color: #374151;
  font-family: 'SF Pro Text', system-ui;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* 의료용 파스텔 색상 */
.medical-pastels {
  --patients-yellow: #fef3c7;    /* 환자 - 연한 노랑 */
  --visits-pink: #fce7f3;        /* 방문 - 연한 분홍 */
  --condition-green: #d1fae5;    /* 상태 - 연한 그린 */
  --sessions-blue: #dbeafe;      /* 세션 - 연한 블루 */
}

.chart-container {
  height: 200px;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: end;
  gap: 8px;
}
```

### Image 8: Product Cards - Minimalist E-commerce
```css
/* 미니멀 이커머스 카드 */
.product-showcase {
  background: #f8fafc;
  padding: 40px 20px;
}

.product-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.product-card {
  background: #ffffff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-right: 1px solid #e2e8f0;
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  margin-bottom: 16px;
  object-fit: cover;
  filter: saturate(0.9);
}

.minimalist-colors {
  --text-primary: #1a202c;      /* 거의 검정 */
  --text-secondary: #4a5568;    /* 미드 그레이 */
  --border: #e2e8f0;           /* 라이트 그레이 */
  --accent: #3182ce;           /* 차분한 블루 */
}
```

### Image 9: Article Cards - Editorial Layout
```css
/* 에디토리얼 레이아웃 */
.article-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 40px;
  background: #1a202c;
}

.article-card {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  color: white;
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-8px);
}

.gradient-overlays {
  --team-building: linear-gradient(45deg, #fbbf24, #f59e0b);
  --productivity: linear-gradient(45deg, #34d399, #059669);
  --leadership: linear-gradient(45deg, #60a5fa, #2563eb);
}

.article-meta {
  padding: 24px;
  font-size: 14px;
  color: #9ca3af;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Image 10: Survey App - Colorful Question Cards
```css
/* 설문 앱 - 컬러풀 질문 카드 */
.survey-interface {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 20px;
  background: #f1f5f9;
}

.question-card {
  border-radius: 20px;
  padding: 32px 24px;
  color: #1f2937;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

/* 질문별 색상 테마 */
.question-themes {
  --social: linear-gradient(135deg, #fbbf24, #f59e0b);
  --financial: linear-gradient(135deg, #a78bfa, #8b5cf6);
  --balance: linear-gradient(135deg, #60a5fa, #3b82f6);
  --physical: linear-gradient(135deg, #34d399, #10b981);
  --goals: linear-gradient(135deg, #f87171, #ef4444);
  --family: linear-gradient(135deg, #fb7185, #e11d48);
}

.question-number {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}
```

### Image 11: Podcast App - Creative Layout
```css
/* 팟캐스트 앱 - 창의적 레이아웃 */
.podcast-interface {
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  color: white;
  font-family: 'SF Pro Display', system-ui;
}

.hero-section {
  background: linear-gradient(135deg, #00d4aa, #00b894);
  padding: 40px 24px;
  border-radius: 0 0 32px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.podcast-player {
  background: #2d3748;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.waveform-animation {
  width: 200px;
  height: 100px;
  background: radial-gradient(circle, #00d4aa, #00b894);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.podcast-colors {
  --primary-teal: #00d4aa;      /* 메인 틸 */
  --secondary-teal: #00b894;    /* 세컨드 틸 */
  --dark-bg: #1a202c;          /* 다크 배경 */
  --card-bg: #2d3748;          /* 카드 배경 */
  --text-light: #e2e8f0;       /* 라이트 텍스트 */
}
```

### Image 12: Social Challenge App - Playful Design
```css
/* 소셜 챌린지 앱 - 놀이적 디자인 */
.challenge-app {
  background: #fef3c7;
  font-family: 'Comic Neue', cursive;
  color: #1f2937;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #fbbf24;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.challenge-timer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.timer-unit {
  background: white;
  border: 2px solid #1f2937;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 4px 4px 0px #1f2937;
}

.playful-colors {
  --sunshine-yellow: #fbbf24;   /* 햇살 노랑 */
  --sky-blue: #60a5fa;          /* 하늘 파랑 */
  --grass-green: #34d399;       /* 풀 초록 */
  --sunset-orange: #fb923c;     /* 노을 주황 */
  --cherry-red: #f87171;        /* 체리 빨강 */
}

.completion-button {
  background: #fbbf24;
  border: 3px solid #1f2937;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  box-shadow: 4px 4px 0px #1f2937;
  transform: translateY(-2px);
}
```

### Image 13: Art Gallery App - Sophisticated Minimalism
```css
/* 아트 갤러리 앱 - 세련된 미니멀리즘 */
.gallery-interface {
  background: #fefefe;
  font-family: 'Playfair Display', serif;
  color: #1f2937;
}

.artwork-card {
  background: #ffffff;
  border-radius: 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 40px;
}

.artwork-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  filter: saturate(1.1) contrast(1.05);
}

.artwork-info {
  padding: 32px;
  text-align: center;
}

.artwork-title {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 8px;
  font-style: italic;
}

.artist-name {
  font-size: 16px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.sophisticated-palette {
  --gallery-white: #fefefe;     /* 갤러리 화이트 */
  --charcoal: #1f2937;          /* 차콜 */
  --warm-gray: #6b7280;         /* 웜 그레이 */
  --soft-shadow: rgba(0, 0, 0, 0.08);  /* 부드러운 그림자 */
}
```

### Image 14: Mobile Cards - Soft Pastels & Illustrations
```css
/* 모바일 카드 - 부드러운 파스텔 & 일러스트 */
.mobile-card-layout {
  background: linear-gradient(135deg, #fce7f3, #e0e7ff, #fef3c7);
  padding: 20px;
  display: grid;
  gap: 16px;
}

.illustrated-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-illustration {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.nutrition-card { background: linear-gradient(135deg, #fef3c7, #fbbf24); }
.radar-card { background: linear-gradient(135deg, #1f2937, #374151); }
.stats-card { background: linear-gradient(135deg, #dbeafe, #60a5fa); }

.soft-pastel-palette {
  --cream-yellow: #fef3c7;      /* 크림 옐로우 */
  --powder-blue: #dbeafe;       /* 파우더 블루 */
  --cotton-pink: #fce7f3;       /* 코튼 핑크 */
  --mint-green: #d1fae5;        /* 민트 그린 */
  --lavender: #e0e7ff;          /* 라벤더 */
}
```

### Image 15: Fashion App - Bold Geometric Patterns
```css
/* 패션 앱 - 대담한 기하학적 패턴 */
.fashion-interface {
  background: #fef7ed;
  font-family: 'Inter', sans-serif;
}

.geometric-hero {
  background: linear-gradient(45deg, #10b981, #f59e0b, #ef4444);
  border-radius: 20px;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.geometric-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background-image: 
    radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, #ffffff 2px, transparent 2px);
  background-size: 20px 20px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  padding: 24px;
}

.fashion-colors {
  --electric-green: #10b981;    /* 전기적 그린 */
  --solar-yellow: #f59e0b;      /* 솔라 옐로우 */
  --passion-red: #ef4444;       /* 패션 레드 */
  --midnight: #1f2937;          /* 미드나잇 */
  --cream: #fef7ed;             /* 크림 */
}

.size-selector {
  display: flex;
  gap: 8px;
  margin: 16px 0;
}

.size-option {
  width: 40px;
  height: 40px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-option.active {
  background: #f87171;
  border-color: #ef4444;
  color: white;
}
```

### Image 16: Banking App - Clean Financial Interface
```css
/* 뱅킹 앱 - 깔끔한 금융 인터페이스 */
.banking-interface {
  background: linear-gradient(135deg, #ecfdf5, #fef3c7);
  font-family: 'SF Pro Display', system-ui;
  color: #1f2937;
}

.balance-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.balance-card {
  border-radius: 20px;
  padding: 24px;
  color: white;
  position: relative;
  overflow: hidden;
}

.primary-card {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.secondary-card {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.card-pattern {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.transaction-list {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 12px;
}

.financial-colors {
  --success-green: #10b981;     /* 성공 그린 */
  --warning-yellow: #f59e0b;    /* 경고 옐로우 */
  --error-red: #ef4444;         /* 에러 레드 */
  --info-blue: #3b82f6;         /* 정보 블루 */
  --neutral-gray: #6b7280;      /* 중립 그레이 */
  --background-mint: #ecfdf5;   /* 배경 민트 */
}

.send-money-section {
  margin: 24px 0;
}

.contact-avatars {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 16px 0;
}

.contact-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Typography & Interaction Patterns Summary
```css
/* 전체적인 타이포그래피 트렌드 */
.typography-trends {
  /* 헤드라인 */
  headline: 'SF Pro Display', 'Inter', system-ui;
  weight-headline: 600-700;
  size-headline: clamp(24px, 6vw, 48px);
  
  /* 바디 텍스트 */
  body: 'SF Pro Text', 'Inter', sans-serif;
  weight-body: 400-500;
  size-body: 16px;
  
  /* 캡션 */
  caption: 'SF Pro Text', system-ui;
  weight-caption: 500-600;
  size-caption: 14px;
}

/* 공통 인터랙션 패턴 */
.interaction-patterns {
  /* 카드 호버 효과 */
  card-hover: translateY(-4px) + shadow-increase;
  
  /* 버튼 프레스 */
  button-press: scale(0.98) + slight-shadow-decrease;
  
  /* 로딩 애니메이션 */
  loading: gentle-pulse + color-shift;
  
  /* 전환 애니메이션 */
  transition: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Reference Style 2: Minimal Timeline Aesthetic
```css
/* 배경과 전체 분위기 */
background: #f0ede4;  /* 크림 베이지 */
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;

/* 시간 표시 스타일 */
.time-display {
  font-size: 72px;
  font-weight: 300;
  color: #2c3e50;
  font-family: 'Georgia', serif;
  margin-bottom: 8px;
  letter-spacing: -2px;
}

.date-location {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 400;
  margin-bottom: 48px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 데이터 시각화 바들 */
.data-visualization {
  display: flex;
  align-items: end;
  gap: 8px;
  margin-bottom: 64px;
  height: 200px;
}

.data-bar {
  width: 12px;
  border-radius: 6px 6px 2px 2px;
  transition: all 0.3s ease;
}

.data-bar:hover {
  transform: scaleY(1.05);
  opacity: 0.8;
}

/* 바 색상들 */
.bar-orange { background: #e67e22; height: 120px; }
.bar-red { background: #e74c3c; height: 80px; }
.bar-green { background: #27ae60; height: 150px; }
.bar-blue { background: #3498db; height: 90px; }
.bar-brown { background: #8b4513; height: 140px; }
.bar-teal { background: #16a085; height: 70px; }

/* 하단 아이콘들 */
.bottom-icons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.icon-circle {
  width: 48px;
  height: 48px;
  background: #2c3e50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  transition: all 0.2s ease;
}

.icon-circle:hover {
  background: #34495e;
  transform: scale(1.1);
}
```

### Reference Style 3: Modern Tab Navigation
```css
/* 하단 네비게이션 컨테이너 */
.bottom-navigation {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 32px 32px 0 0;
  padding: 20px 24px;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* 탭 아이템들 */
.tab-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  flex: 1;
}

.tab-item.active {
  background: rgba(52, 73, 94, 0.1);
  color: #2c3e50;
}

.tab-item.inactive {
  color: #95a5a6;
}

/* 중앙 플러스 버튼 (FAB) */
.floating-action-button {
  position: absolute;
  left: 50%;
  top: -20px;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 300;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.floating-action-button:hover {
  transform: translateX(-50%) scale(1.05);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
}

.floating-action-button:active {
  transform: translateX(-50%) scale(0.95);
}
```

### Typography & Spacing Guidelines
```css
/* 텍스트 계층 구조 */
.text-hero {
  font-size: clamp(32px, 8vw, 48px);
  font-weight: 700;
  line-height: 1.2;
  color: #2c3e50;
}

.text-title {
  font-size: clamp(20px, 5vw, 28px);
  font-weight: 600;
  line-height: 1.3;
  color: #34495e;
}

.text-body {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: #5d6d7e;
}

.text-caption {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: #7f8c8d;
}

/* 간격 시스템 */
.spacing-xs { margin: 8px; }
.spacing-sm { margin: 16px; }
.spacing-md { margin: 24px; }
.spacing-lg { margin: 32px; }
.spacing-xl { margin: 48px; }

/* 레이아웃 그리드 */
.container {
  max-width: 400px;  /* 모바일 최적 */
  margin: 0 auto;
  padding: 0 20px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

### Animation & Interaction Patterns
```css
/* 부드러운 전환 애니메이션 */
.gentle-transition {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.spring-bounce {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.fade-slide-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeSlideUp 0.6s ease-out forwards;
}

@keyframes fadeSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 호버 효과들 */
.lift-on-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.glow-on-hover:hover {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

/* 터치 피드백 */
.touch-feedback:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}
```

### Typography - 감성적 폰트 조합
```css
/* Headers - Korean Serif */
font-family: 'Noto Serif KR', serif  /* 한글 제목 */

/* Friendly Headers */
font-family: 'Jua', sans-serif       /* 친근한 제목 */

/* Body Text */
font-family: 'Sour Gummy', sans-serif  /* 본문 텍스트 */

/* UI Labels */
font-family: 'Inter', sans-serif     /* 인터페이스 텍스트 */
```

## 📱 Mobile App Architecture & Navigation

### Bottom Navigation Bar (5-Tab Design)
```typescript
interface BottomNavigation {
  tabs: [
    {
      id: 'home',
      icon: '🏠',
      label: 'Home',
      component: HomeScreen
    },
    {
      id: 'create',
      icon: '+',
      label: 'Create', 
      isMainAction: true,
      modal: CreateNoteModal, // 감사/설교/기도 선택 모달
      style: 'floating-action-button'
    },
    {
      id: 'saved',
      icon: '📝',
      label: 'Saved',
      component: SavedNotesScreen
    },
    {
      id: 'community', 
      icon: '🤝',
      label: 'Community',
      component: CommunityScreen
    },
    {
      id: 'settings',
      icon: '⚙️', 
      label: 'Settings',
      component: SettingsScreen
    }
  ]
}
```

### Home Screen - Spiritual Dashboard
```tsx
interface HomeScreenFeatures {
  // 주간 스트릭 체커 (상단 메인 위젯)
  weeklyStreak: {
    gratitudeStreak: number,    // 감사노트 연속 기록
    sermonStreak: number,       // 설교노트 연속 기록  
    prayerStreak: number,       // 기도노트 연속 기록
    weekProgress: WeekDay[],    // 일주일 진행상황
    animation: 'gentle-pulse'   // 부드러운 펄스 애니메이션
  }

  // 슬라이드업 모달 (더보기 버튼)
  detailModal: {
    monthlyStats: MonthlyView,  // 월별 통계 (슬라이드 가능)
    streakHistory: StreakChart, // 연속 기록 히스토리
    spiritualGrowth: GrowthMetrics, // 영적 성장 지표
    achievements: BadgeSystem   // 성취 배지 시스템
  }

  // 퀵 액세스 위젯들
  quickWidgets: [
    TodayVerse,        // 오늘의 말씀
    RecentNotes,       // 최근 작성 노트들
    PrayerReminders,   // 기도제목 리마인더
    UpcomingEvents,    // 교회 일정/이벤트
    FaithMilestones    // 신앙 이정표
  ]
}
```

### Create Note Modal (Floating Action)
```tsx
interface CreateNoteModal {
  layout: 'slide-up-modal',
  animation: 'spring-bounce',
  options: [
    {
      type: 'gratitude',
      icon: '🙏',
      title: '감사 노트',
      subtitle: '오늘의 감사한 일을 기록해보세요',
      color: 'retro-sage',
      quickTemplate: GratitudeQuickStart
    },
    {
      type: 'sermon', 
      icon: '📖',
      title: '설교 노트',
      subtitle: '말씀을 마음에 새겨보세요',
      color: 'retro-coral',
      quickTemplate: SermonQuickStart
    },
    {
      type: 'prayer',
      icon: '🕊️', 
      title: '기도 노트',
      subtitle: '기도제목과 응답을 기록해보세요', 
      color: 'retro-teal',
      quickTemplate: PrayerQuickStart
    }
  ]
}
```

### Saved Notes Screen - Personal Archive
```tsx
interface SavedNotesScreen {
  views: [
    'timeline',    // 시간순 보기 (기본)
    'category',    // 카테고리별 분류
    'favorite',    // 즐겨찾기
    'search'       // 검색 및 필터
  ],

  features: {
    smartSearch: 'AI 기반 내용 검색',
    tagSystem: '감정/주제별 태그',
    exportOptions: 'PDF/이미지 내보내기',
    reflectionMode: '회고록 자동 생성',
    memoryLane: '1년 전 오늘의 노트'
  }
}
```

### Community Screen - Faith Sharing Platform  
```tsx
interface CommunityScreen {
  sections: [
    {
      name: 'inspiration-gallery',
      title: '영감 갤러리',
      description: '아름다운 노트들을 구경해보세요',
      content: 'curated-beautiful-notes'
    },
    {
      name: 'prayer-circle', 
      title: '기도 서클',
      description: '익명으로 기도제목을 나눠보세요',
      content: 'anonymous-prayer-requests'
    },
    {
      name: 'template-exchange',
      title: '템플릿 나눔',
      description: '사용자 제작 템플릿을 공유하세요',
      content: 'user-generated-templates'
    },
    {
      name: 'small-groups',
      title: '소그룹 공간', 
      description: '우리 소그룹만의 특별한 공간',
      content: 'private-group-rooms'
    }
  ]
}
```

### Settings Screen - Personalization Hub
```tsx
interface SettingsScreen {
  categories: {
    spiritual: {
      title: '영적 생활',
      options: [
        'daily-reminders',     // 매일 알림 설정
        'bible-translation',   // 성경 번역본 선택  
        'church-integration',  // 교회 연동
        'prayer-times',        // 기도 시간 설정
        'spiritual-goals'      // 영적 목표 설정
      ]
    },
    
    interface: {
      title: '인터페이스',
      options: [
        'theme-customization', // 테마 커스터마이징
        'font-settings',       // 폰트 크기/종류
        'language-selection',  // 다국어 지원
        'accessibility',       // 접근성 설정
        'gesture-controls'     // 제스처 설정
      ]
    },

    privacy: {
      title: '프라이버시',
      options: [
        'data-backup',         // 데이터 백업
        'sharing-preferences', // 공유 설정
        'anonymous-mode',      // 익명 모드
        'data-export',         // 데이터 내보내기
        'account-deletion'     // 계정 삭제
      ]
    }
  }
}
```

## 📊 Business Model

### Freemium Structure
```yaml
Free Tier:
  - 월 10개 노트 작성
  - 기본 템플릿 5개
  - 개인 사용만 가능
  - 광고 표시

Premium ($5.99/month):
  - 무제한 노트 작성  
  - 프리미엄 템플릿 100+
  - 클라우드 백업 무제한
  - 소그룹 공유 기능
  - 광고 제거
  - 우선 고객 지원

Church Plan ($29.99/month):
  - 교회 전체 계정
  - 관리자 대시보드
  - 설교 아카이브 기능
  - 출석체크 연동
  - 커스텀 브랜딩
```

### Revenue Streams
1. **구독 수익** (80%): 월간/연간 구독
2. **교회 플랜** (15%): B2B 기업 고객  
3. **인앱 구매** (5%): 특별 템플릿, 아이콘 팩

### Growth Strategy
**Year 1**: MVP 출시 + 얼리어답터 확보 (1,000명)
**Year 2**: 커뮤니티 기능 강화 + 교회 파트너십 (10,000명)
**Year 3**: AI 기능 추가 + 글로벌 확장 (100,000명)

## 🎯 Success Metrics

### Product Metrics
- **DAU/MAU Ratio**: 0.3+ (높은 사용자 참여도)
- **Retention Rate**: 30일 40%+, 90일 25%+
- **Notes per User**: 월평균 15개+
- **Sharing Rate**: 주간 20%+ 사용자가 노트 공유

### Business Metrics  
- **Conversion Rate**: Free → Premium 5%+
- **Churn Rate**: 월간 5% 이하
- **ARPU**: $3+ (Average Revenue Per User)
- **Church Acquisition**: 월 10개 교회+

### Community Metrics
- **Template Sharing**: 월 1,000개+ 사용자 제작 템플릿
- **Prayer Requests**: 일일 500개+ 익명 기도제목
- **Global Events**: 분기별 10,000명+ 참여

## 🚧 Development Roadmap - Updated with UI Focus

### Phase 1: MVP with Retro Emotional UI (Month 1-4)
**"Beautiful Foundation"**
- [x] 레트로 감성 디자인 시스템 구축
- [x] 5-Tab 네비게이션 구조 구현
- [x] 홈 스크린 주간 스트릭 위젯
- [x] 기본 캔버스 엔진 (감성적 색상 팔레트)
- [x] 3가지 노트 타입 기본 구현
- [x] Supabase 인증 및 데이터 저장
- [x] 감정적 애니메이션 및 마이크로 인터랙션

### Phase 2: Enhanced Emotional Experience (Month 5-8)  
**"Delightful Interactions"**
- [ ] 슬라이드업 통계 모달 (월별/주별 뷰)
- [ ] 50개 감성적 템플릿 라이브러리
- [ ] AI 기반 컨텍스트 인식 (시간/위치)
- [ ] 성취 배지 시스템 (레트로 스타일)
- [ ] 음성 녹음 및 손글씨 지원
- [ ] 오프라인 모드 완벽 지원
- [ ] 개인화된 동기부여 시스템

### Phase 3: Community & Sharing (Month 9-12)
**"Connected Faith Community"**
- [ ] 커뮤니티 탭 완전 구현
- [ ] 익명 기도제목 나눔 플랫폼
- [ ] 템플릿 마켓플레이스 
- [ ] 소그룹 전용 공간
- [ ] 실시간 기도 서클
- [ ] 간증 나눔 갤러리
- [ ] 글로벌 감사 챌린지 이벤트

### Phase 4: AI & Advanced Features (Month 13-16)
**"Intelligent Spiritual Companion"**  
- [ ] AI 영적 코치 (개인 맞춤 가이드)
- [ ] 스마트 성경구절 연결
- [ ] 감정 AI 분석 (노트 패턴 인식)
- [ ] 예측적 템플릿 추천
- [ ] 자동 회고록 생성
- [ ] Church Plan B2B 기능
- [ ] 다국어 지원 (10개국)

### Phase 5: Ecosystem & Platform (Month 17-24)
**"Complete Spiritual Ecosystem"**
- [ ] Apple Watch / Galaxy Watch 연동
- [ ] Siri / Google Assistant 통합
- [ ] 교회 시스템 API 연동
- [ ] 웨어러블 기기 알림
- [ ] 스마트홈 기기 연동 (기도 시간)
- [ ] AR 기능 (성경 구절 오버레이)
- [ ] 블록체인 기반 영적 성장 증명서

## 🔒 Privacy & Security

### Data Protection
- **GDPR Compliant**: 유럽 개인정보보호법 준수
- **End-to-End Encryption**: 민감한 기도제목 암호화
- **Anonymous Options**: 완전 익명 사용 가능
- **Data Ownership**: 사용자 데이터 완전 소유권

### Content Moderation
- **AI Moderation**: 부적절한 내용 자동 필터링
- **Community Guidelines**: 명확한 커뮤니티 규칙
- **Report System**: 신고 및 대응 시스템
- **Pastor Review**: 교회 공식 계정 인증

## 🏠 Home Screen - Spiritual Dashboard Detailed Specs

### Weekly Streak Widget (Main Focus)
```tsx
interface WeeklyStreakWidget {
  layout: 'top-priority-position',
  height: '200px',
  
  streakDisplay: {
    gratitude: {
      currentStreak: number,
      weeklyProgress: boolean[], // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
      color: '--retro-sage',
      icon: '🙏',
      motivation: 'Thank God daily'
    },
    sermon: {
      currentStreak: number, 
      weeklyProgress: boolean[],
      color: '--retro-coral',
      icon: '📖', 
      motivation: 'Treasure His Word'
    },
    prayer: {
      currentStreak: number,
      weeklyProgress: boolean[],
      color: '--retro-teal', 
      icon: '🕊️',
      motivation: 'Pray without ceasing'
    }
  },

  visualization: {
    type: 'gentle-circular-progress',
    animation: 'subtle-glow-pulse',
    completedDays: 'filled-with-joy-colors',
    pendingDays: 'soft-outlined-circles'
  },

  interaction: {
    onTap: 'expand-to-detailed-view',
    onLongPress: 'quick-create-note',
    onSwipe: 'navigate-between-weeks'
  }
}
```

### Slide-up Modal (More Details)
```tsx
interface DetailModal {
  trigger: 'more-button-below-streak-widget',
  animation: 'smooth-slide-up-spring',
  height: '80vh',
  
  content: {
    monthlyView: {
      navigation: 'horizontal-swipe-months',
      visualization: 'calendar-heatmap',
      colors: 'retro-emotional-palette',
      metrics: [
        'notes-per-day',
        'streak-lengths', 
        'spiritual-consistency',
        'growth-patterns'
      ]
    },

    statisticsPanel: {
      cards: [
        {
          title: '이번 달 총 기록',
          value: 'total-notes-count',
          trend: 'compared-to-last-month',
          visualization: 'simple-bar-chart'
        },
        {
          title: '가장 긴 연속 기록',
          value: 'longest-streak-ever',
          achievement: 'personal-best-badge',
          visualization: 'streak-timeline'
        },
        {
          title: '영적 성장 지수',
          value: 'calculated-growth-score',
          explanation: 'based-on-consistency-depth',
          visualization: 'radial-progress'
        }
      ]
    },

    achievements: {
      recentBadges: Badge[],
      nextGoals: Goal[], 
      milestones: Milestone[],
      encouragement: 'personalized-message'
    }
  }
}
```

### Additional Home Widgets
```tsx
interface HomeWidgets {
  todayVerse: {
    position: 'below-streak-widget',
    content: 'daily-bible-verse',
    style: 'retro-card-with-gentle-shadow',
    interaction: 'tap-to-create-verse-note',
    personalization: 'user-selected-translation'
  },

  recentNotes: {
    title: '최근 작성한 노트',
    layout: 'horizontal-scroll-cards',
    count: 3,
    preview: 'thumbnail-with-title',
    action: 'tap-to-view-full-note'
  },

  prayerReminders: {
    title: '기도 제목 알림',
    display: 'urgent-and-upcoming-prayers',
    style: 'subtle-notification-cards',
    action: 'tap-to-mark-prayed'
  },

  upcomingEvents: {
    title: '다가오는 일정',
    content: 'church-events-and-personal-spiritual-goals',
    integration: 'church-calendar-sync',
    style: 'timeline-format'
  },

  faithMilestone: {
    title: '신앙 여정',
    content: 'spiritual-growth-timeline',
    visualization: 'beautiful-journey-map',
    celebration: 'milestone-achievements'
  },

  quickActions: {
    position: 'floating-bottom-right',
    buttons: [
      'quick-gratitude',
      'voice-prayer', 
      'share-testimony',
      'find-community'
    ],
    style: 'expandable-fab-menu'
  }
}
```

### Home Screen Emotional Design
```tsx
interface EmotionalDesign {
  colorScheme: {
    morning: 'warm-sunrise-pastels',
    afternoon: 'gentle-daylight-tones', 
    evening: 'peaceful-sunset-hues',
    night: 'calming-moonlight-palette'
  },

  animations: {
    pageLoad: 'gentle-fade-up-sequence',
    widgetInteraction: 'soft-bounce-feedback',
    streakUpdate: 'celebratory-sparkle-effect',
    achievement: 'joyful-confetti-burst'
  },

  micro-interactions: {
    scrolling: 'parallax-gentle-movement',
    cardHover: 'subtle-lift-and-glow',
    buttonPress: 'satisfying-spring-compression',
    achievement: 'warm-success-ripple'
  },

  motivationalElements: {
    emptyState: 'encouraging-onboarding-illustration',
    lowActivity: 'gentle-motivation-message',
    streakBreak: 'compassionate-restart-encouragement',
    achievement: 'celebration-with-biblical-blessing'
  }
}
```

## 🎯 Enhanced UX Patterns

### Smart Context Awareness
```tsx
interface ContextualBehavior {
  timeBasedUI: {
    sunday: 'sermon-note-prominent-suggestion',
    weekday: 'gratitude-morning-prayer-evening',
    bedtime: 'reflection-and-prayer-mode',
    mealtime: 'gratitude-for-food-prompt'
  },

  locationAware: {
    atChurch: 'sermon-note-auto-suggest',
    atHome: 'prayer-and-gratitude-focus',
    commuting: 'voice-note-optimization',
    travel: 'travel-gratitude-templates'
  },

  habitualLearning: {
    userPatterns: 'learn-preferred-times-and-styles',
    autoSuggestions: 'predict-likely-next-actions',
    templateRecommendation: 'suggest-based-on-history',
    reminderOptimization: 'perfect-timing-notifications'
  }
}
```

### Accessibility & Inclusivity  
```tsx
interface AccessibilityFeatures {
  visualAccessibility: {
    highContrast: 'optional-high-contrast-mode',
    fontSize: 'scalable-text-sizes',
    colorBlind: 'colorblind-friendly-alternatives',
    screenReader: 'comprehensive-aria-labels'
  },

  motorAccessibility: {
    largeTargets: 'minimum-44px-touch-targets',
    gestureAlternatives: 'button-alternatives-to-gestures',
    voiceControl: 'voice-command-integration',
    oneHanded: 'optimized-for-one-handed-use'
  },

  cognitiveAccessibility: {
    simpleLanguage: 'clear-simple-instructions',
    consistentNavigation: 'predictable-interface-patterns',
    progressIndicators: 'clear-progress-feedback',
    errorPrevention: 'validate-before-errors-occur'
  }
}
```

## 🎪 Marketing Strategy

### Content Marketing
- **Faith-based YouTubers**: 기독교 인플루언서 협업
- **Church Partnerships**: 대형 교회와 파일럿 프로그램
- **Seminary Programs**: 신학교 학생들 무료 이용
- **Christian Conferences**: 기독교 컨퍼런스 부스 참가

### Digital Marketing  
- **Instagram Ads**: 아름다운 노트 예시로 광고
- **TikTok Challenges**: #GratitudeChallenge 바이럴
- **Pinterest Presence**: 템플릿 갤러리 공유
- **Christian Podcasts**: 팟캐스트 광고 + 스폰서십

### Community Building
- **Beta Testing**: 100명 얼리어답터 모집
- **Ambassador Program**: 파워 유저 대사 프로그램  
- **Small Group Pilots**: 10개 소그룹 파일럿 테스트
- **Testimonials**: 사용자 간증 수집 및 홍보

## 🤝 Team & Resources

### Required Skills
- **Frontend Developer**: React + Canvas 전문성
- **Backend Developer**: Node.js + MongoDB 경험
- **UI/UX Designer**: 종교 앱 디자인 경험 우대
- **Community Manager**: 기독교 커뮤니티 관리
- **Marketing Specialist**: 기독교 마케팅 노하우

### Advisory Board
- **목회자**: 대형 교회 담임목사 자문
- **Tech Advisor**: 실리콘밸리 시니어 개발자
- **Investor**: 종교 기술 투자 경험자
- **Designer**: 신앙 기반 앱 디자인 전문가

## 🔮 Future Vision

### Long-term Goals (3-5 Years)
- **Global Platform**: 100만+ 활성 사용자
- **Multi-faith Expansion**: 가톨릭, 정교회 버전
- **AI Pastor**: 개인 맞춤형 영적 가이드
- **VR Chapel**: 가상현실 예배 공간
- **Publishing Platform**: 영적 여정 책 출간

### Impact Metrics
- **Lives Transformed**: 영적 성장 간증 수집
- **Churches Empowered**: 1,000개 교회 디지털 전환
- **Global Unity**: 전 세계 기독교인 연결
- **Faith Revival**: MZ세대 신앙 회복 기여

---

## 📋 Development Notes - Claude Code Integration

### Technical Decisions - Based on Current Setup
- **Why Next.js 15.5?** App Router provides better performance + SEO for global reach
- **Why Capacitor over React Native?** Single codebase, easier maintenance, web-first approach
- **Why Supabase over Firebase?** Better TypeScript integration, PostgreSQL power, row-level security
- **Why Tailwind 4?** Perfect for rapid prototyping + consistent design system
- **Why Multi-language from start?** Global market strategy, easier to implement early

### Design Decisions - Retro Emotional Rationale  
- **Why Retro Pastels?** Emotional comfort + differentiation from clinical tech apps
- **Why Korean Font Priority?** Primary market understanding + cultural sensitivity
- **Why 5-Tab Navigation?** Optimal for thumb reach + clear feature separation
- **Why Canvas-based Notes?** Visual expression matches spiritual creativity needs
- **Why Streak Tracking?** Gamification drives habit formation in faith practices

### Business Decisions - Market Strategy
- **Why Freemium Model?** Lower barrier to entry + viral growth potential  
- **Why Church B2B Focus?** Stable revenue + organic user acquisition
- **Why Global Launch?** Avoid Korean market size limitations
- **Why Community Features?** Network effects drive retention + word-of-mouth growth

### Claude Code Workflow Optimization
```bash
# 프로젝트 시작 명령어
cd spiritual-canvas-app
npm run dev  # 개발 서버 실행

# Claude Code 최적 사용법
claude --context .claude/context.md,CLAUDE.md "구현할 기능"

# 예시 명령어들
claude "홈 스크린 StreakWidget 컴포넌트 만들어줘 - 현재 폰트와 색상 시스템 사용"
claude "5-tab BottomTabs 네비게이션 구현 - Capacitor 세이프존 적용"  
claude "레트로 스타일 캔버스 에디터 - Fabric.js 통합"
claude "커뮤니티 탭 전체 구현 - 현재 i18n 시스템 활용"

# 모바일 테스트  
npx cap sync && npx cap run ios
```

### Current Implementation Priorities
```typescript
interface NextSteps {
  immediate: [
    '🚨 BottomTabs navigation (5-tab system)',
    '🚨 StreakWidget with slide-up modal', 
    '🚨 Basic canvas note creation',
    '🚨 Supabase authentication setup'
  ],
  
  thisWeek: [
    '📱 Canvas editor with Fabric.js',
    '📱 Note type selection modal',
    '📱 Template system foundation',
    '📱 Basic CRUD operations'
  ],
  
  thisMonth: [
    '🎨 Community tab implementation',
    '🎨 Advanced streak analytics', 
    '🎨 Voice recording integration',
    '🎨 Offline sync capabilities'
  ]
}
```

### Testing & Quality Assurance
```bash  
# 현재 테스트 도구들
/test page                   # Font + safe zone testing
npm run lint                # Code quality check
npm run build               # Production build validation

# 추가 필요한 테스트
- 캔버스 성능 테스트 (대용량 이미지)
- 다국어 UI 레이아웃 테스트  
- iOS/Android 네이티브 기능 테스트
- 오프라인 동기화 테스트
- 교회 플랜 권한 시스템 테스트
```

### File Naming Conventions
```typescript
// 현재 프로젝트 스타일을 따르는 명명 규칙

// 페이지 컴포넌트
app/[locale]/home/page.tsx           // 소문자, kebab-case
app/[locale]/community/page.tsx      

// UI 컴포넌트  
components/navigation/BottomTabs.tsx  // PascalCase
components/widgets/StreakWidget.tsx   

// 훅과 유틸리티
hooks/useStreak.ts                   // camelCase
utils/canvas-helpers.ts              // kebab-case

// 컨텍스트
contexts/NotesProvider.tsx           // PascalCase + Provider suffix
```

This context should provide Claude Code with comprehensive understanding of both your vision AND current implementation! 🚀

**주요 통합 포인트:**
1. **현재 기술 스택 완전 반영** (Next.js 15.5, Capacitor, 다국어)
2. **기존 파일 구조와 호환** (App Router, 컴포넌트 조직)
3. **현재 폰트 시스템 활용** (한글 우선, 레트로 감성)
4. **Safe Zone 시스템 통합** (모바일 최적화)
5. **Claude Code 워크플로우 최적화** (명령어 예시 포함)

**이제 Claude Code가 현재 프로젝트 상태를 완벽히 이해하고 즉시 작업 가능합니다!** ✨