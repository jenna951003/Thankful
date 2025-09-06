// 번역 키에 대한 fallback 값들을 정의
export const translationFallbacks: Record<string, string> = {
  // Welcome Screen fallbacks
  'onboarding.welcome.title': 'Welcome to Thankful',
  'onboarding.welcome.subtitle': '감사의 마음으로 채워가는\n영적 저널링',
  'onboarding.welcome.startButton': '시작하기',
  'onboarding.welcome.signInButton': '이미 계정이 있어요',
  
  // Common loading states
  'loading.pleaseWait': '잠시만 기다려주세요...',
  'loading.processing': '처리 중...',
  'loading.loading': '로딩 중...',
}

// 번역 키에 대한 안전한 fallback을 제공하는 함수
export function getTranslationFallback(key: string, locale: string = 'ko'): string {
  // fallback 값이 있으면 반환
  if (translationFallbacks[key]) {
    return translationFallbacks[key]
  }
  
  // 없으면 키의 마지막 부분을 사용자 친화적으로 변환
  const lastPart = key.split('.').pop() || key
  
  // camelCase를 단어로 분리 (예: startButton → Start Button)
  const friendlyText = lastPart
    .replace(/([A-Z])/g, ' $1')  // camelCase 분리
    .replace(/^./, str => str.toUpperCase())  // 첫 글자 대문자
    .trim()
  
  return friendlyText
}