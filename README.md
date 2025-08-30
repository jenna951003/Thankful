# Thankful - 감사 일기 앱

깔끔하게 새로 시작한 Next.js 프로젝트입니다.

## ✅ 구현된 기능

### 🛡️ 세이프존 시스템 (완벽 작동)
- **모든 모바일 기기 대응**: iPhone (14 Pro Max, 15 Pro, SE 등)
- **모든 Android 폰 대응**: Galaxy S, Pixel 등
- **모든 태블릿 대응**: iPad (Pro, Air, Mini), Galaxy Tab 등
- **가로/세로 모드 완벽 지원**
- **개발용 시각화**: 빨간색 오버레이로 세이프존 확인 가능

### 🎨 폰트 시스템 (완벽 작동)
- **Jua**: 한글 기본 텍스트
- **Fascinate**: 영어 장식용 폰트
- **Sour Gummy**: "Thankful" 브랜딩 전용
- **Hubballi**: 기본 영어 폰트
- **Dongle**: 한글 캐주얼 텍스트
- **Noto Serif KR**: 한글 세리프

### 🧪 테스트 페이지
- `/test` : 모든 폰트와 세이프존을 한번에 테스트할 수 있는 페이지
- CSS 클래스 방식과 인라인 스타일 방식 모두 테스트
- 세이프존 시각화 토글 기능

## 🚀 실행 방법

```bash
npm run dev
```

- 메인 페이지: http://localhost:3000
- 테스트 페이지: http://localhost:3000/test

## 📱 세이프존 사용법

```jsx
{/* 상단 세이프존 */}
<div style={{ height: 'var(--actual-safe-top)' }}></div>

{/* 하단 세이프존 */}
<div style={{ height: 'var(--actual-safe-bottom)' }}></div>
```

## 🎯 폰트 사용법

```jsx
{/* CSS 클래스 방식 */}
<p className="font-jua">한글 텍스트</p>
<p className="font-sour-gummy">Thankful</p>

{/* 인라인 스타일 방식 */}
<p style={{ fontFamily: 'Jua, sans-serif' }}>한글 텍스트</p>
```

## 🎉 완료된 작업

✅ 복잡한 이전 프로젝트 완전 삭제  
✅ 깔끔한 새 Next.js 프로젝트 생성  
✅ 모든 모바일+태블릿 세이프존 완벽 대응  
✅ Google Fonts 완벽 설정  
✅ 폰트+세이프존 테스트 페이지 생성  
✅ 모든 기능 정상 작동 확인

## 🛠️ 기술 스택

- **Next.js 15.5.2** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Google Fonts** (next/font/google)
- **React 19.1.0**

---

**이제 모든 폰트와 세이프존이 완벽하게 작동합니다! 🎊**