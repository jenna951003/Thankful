/**
 * 온보딩 애니메이션 시스템 상수 정의
 * 모든 애니메이션 타이밍과 설정을 중앙에서 관리합니다.
 */

// 기본 애니메이션 지속시간 (ms)
export const ANIMATION_DURATION = {
  // 페이지 전환
  PAGE_TRANSITION: 400,
  CONTENT_FADE: 600,
  
  // 스테거드 애니메이션 기본 단위
  STAGGER_BASE: 400,
  STAGGER_DELAY: 400,
  
  // 프로그레스바
  PROGRESS_FILL: 800,
  PROGRESS_SHRINK: 800,
  
  // 버튼 상호작용
  BUTTON_PRESS: 150,
  BUTTON_TEXT_FADE: 200,
  
  // 체크 아이콘
  CHECK_APPEAR: 400,
  CHECK_DISAPPEAR: 300,
  
  // 모달
  MODAL_FADE: 500,
  
  // 로딩 오버레이
  LOADING_OVERLAY: 1500,
  
  // 완료 화면 처리
  COMPLETE_PROCESSING: 2000
} as const

// 애니메이션 지연시간 (ms)
export const ANIMATION_DELAY = {
  // 온보딩 레이아웃 스테거드 지연
  CONTENT: 150,
  BOTTOM_IMAGE: 300,
  
  // 웰컴 스크린 스테거드 지연
  WELCOME_ICON: 200,
  WELCOME_TITLE: 1000,
  WELCOME_SUBTITLE: 1400,
  WELCOME_START_BTN: 1800,
  WELCOME_SIGNIN_BTN: 2200,
  WELCOME_RESET_BTN: 2600,
  
  // 완료 화면 스테거드 지연
  COMPLETE_ICON: 800,
  COMPLETE_TITLE: 1200,
  COMPLETE_SUBTITLE: 1600,
  COMPLETE_BUTTON: 2000,
  
  // 첫 감사 화면 스테거드 지연
  GRATITUDE_TITLE: 800,
  GRATITUDE_SUBTITLE: 1200,
  GRATITUDE_INPUTS: 1600,
  GRATITUDE_TIP: 2000,
  GRATITUDE_MOOD: 2400,
  GRATITUDE_BUTTON: 2800
} as const

// CSS 애니메이션 커브
export const ANIMATION_EASING = {
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  SMOOTH: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  GENTLE: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
} as const

// 변환 값
export const TRANSFORM_VALUES = {
  SLIDE_UP: 'translateY(20px)',
  SLIDE_DOWN: 'translateY(-20px)',
  SCALE_DOWN: 'scale(0.98)',
  SCALE_UP: 'scale(1.02)',
  ROTATE_APPEAR: 'scale(0.5) rotate(-15deg)',
  ROTATE_DISAPPEAR: 'scale(0.5) rotate(15deg)',
  BUTTON_LIFT: 'translateY(-2px)'
} as const

// 스테거드 애니메이션 생성 헬퍼
export const createStaggeredDelays = (baseDelay: number, increment: number, count: number): number[] => {
  return Array.from({ length: count }, (_, index) => baseDelay + (index * increment))
}

// 애니메이션 상태 타입
export type AnimationPhase = 'entering' | 'entered' | 'exiting' | 'exited'

// 디바이스 성능에 따른 애니메이션 품질 설정
export const getAnimationConfig = () => {
  // 서버 사이드 렌더링 환경 체크
  if (typeof window === 'undefined') {
    return {
      REDUCE_MOTION: false,
      LOW_PERFORMANCE: false,
      ANIMATION_SCALE: 1.0,
      ENABLE_ADVANCED_EFFECTS: true
    }
  }

  // 저성능 기기 감지 (간단한 heuristic)
  const isLowPerformance = () => {
    const hardwareConcurrency = navigator?.hardwareConcurrency || 2
    const memory = (navigator as any)?.deviceMemory || 2
    return hardwareConcurrency < 4 || memory < 4
  }

  const lowPerf = isLowPerformance()
  
  return {
    REDUCE_MOTION: typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
    LOW_PERFORMANCE: lowPerf,
    ANIMATION_SCALE: lowPerf ? 0.7 : 1.0, // 저성능 기기는 애니메이션 30% 단축
    ENABLE_ADVANCED_EFFECTS: !lowPerf
  }
}

// 환경별 설정
export const ENV_CONFIG = {
  DEVELOPMENT: process.env.NODE_ENV === 'development',
  ENABLE_DEBUG: process.env.NODE_ENV === 'development',
  get ANIMATION_SCALE() {
    return getAnimationConfig().ANIMATION_SCALE
  }
}

// CSS 변수명 상수
export const CSS_VARIABLES = {
  ANIMATION_DURATION: '--animation-duration',
  ANIMATION_DELAY: '--animation-delay',
  ANIMATION_EASING: '--animation-easing',
  SAFE_TOP: '--actual-safe-top',
  SAFE_BOTTOM: '--actual-safe-bottom'
} as const