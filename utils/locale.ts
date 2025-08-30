// 국가별 언어 매핑
const COUNTRY_TO_LOCALE: { [key: string]: string } = {
  // 한국어
  KR: 'ko',
  
  // 스페인어
  ES: 'es', // 스페인
  MX: 'es', // 멕시코  
  AR: 'es', // 아르헨티나
  CO: 'es', // 콜롬비아
  PE: 'es', // 페루
  VE: 'es', // 베네수엘라
  CL: 'es', // 칠레
  EC: 'es', // 에콰도르
  GT: 'es', // 과테말라
  CU: 'es', // 쿠바
  BO: 'es', // 볼리비아
  DO: 'es', // 도미니카공화국
  HN: 'es', // 온두라스
  PY: 'es', // 파라과이
  SV: 'es', // 엘살바도르
  NI: 'es', // 니카라과
  CR: 'es', // 코스타리카
  PA: 'es', // 파나마
  UY: 'es', // 우루과이
  
  // 포르투갈어
  BR: 'pt', // 브라질
  PT: 'pt', // 포르투갈
  
  // 영어 (기본값이므로 주요 영어권만 명시)
  US: 'en', // 미국
  GB: 'en', // 영국
  CA: 'en', // 캐나다
  AU: 'en', // 호주
  NZ: 'en', // 뉴질랜드
  IE: 'en', // 아일랜드
  ZA: 'en', // 남아프리카공화국
}

// IP 기반 위치 감지 (무료 API 사용)
export async function detectUserLocale(): Promise<string> {
  try {
    // ipapi.co를 사용한 위치 감지
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    if (data && data.country_code) {
      const countryCode = data.country_code.toUpperCase()
      const locale = COUNTRY_TO_LOCALE[countryCode]
      
      // 매핑된 언어가 있으면 반환, 없으면 기본 영어
      return locale || 'en'
    }
  } catch (error) {
    console.log('위치 감지 실패:', error)
  }
  
  // 브라우저 언어 설정 백업 체크
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.slice(0, 2)
    if (['ko', 'es', 'pt', 'en'].includes(browserLang)) {
      return browserLang
    }
  }
  
  // 기본값은 영어
  return 'en'
}

// 지원하는 언어인지 체크
export function isSupportedLocale(locale: string): boolean {
  return ['en', 'ko', 'es', 'pt'].includes(locale)
}