import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

const locales = ['ko', 'en', 'es', 'pt']

function getLocale(request: NextRequest): string {
  // 웹/앱 환경 감지
  const userAgent = request.headers.get('user-agent') || ''
  const isCapacitorApp = userAgent.includes('Capacitor') || userAgent.includes('CapacitorWebView')
  
  // Accept-Language 헤더에서 언어 감지
  const acceptLanguage = request.headers.get('accept-language') || ''
  const browserLocale = acceptLanguage
    .split(',')[0]
    .toLowerCase()
  
  // 환경별 언어 감지 로그 (개발용)
  console.log(`🌍 Language Detection:`)
  console.log(`   Environment: ${isCapacitorApp ? '📱 Mobile App' : '🌐 Web Browser'}`)
  console.log(`   Accept-Language: ${acceptLanguage}`)
  console.log(`   Detected: ${browserLocale}`)
  
  // 언어-국가 매핑 (스페인어/포르투갈어 사용 국가들 포함)
  const localeMap: { [key: string]: string } = {
    // 한국어
    'ko': 'ko',
    'ko-kr': 'ko',
    
    // 영어 (기본값)
    'en': 'en',
    'en-us': 'en',
    'en-gb': 'en',
    'en-ca': 'en',
    'en-au': 'en',
    'en-nz': 'en',
    'en-ie': 'en',
    'en-za': 'en',
    
    // 스페인어 사용 국가들
    'es': 'es',
    'es-es': 'es',     // 스페인
    'es-mx': 'es',     // 멕시코
    'es-ar': 'es',     // 아르헨티나
    'es-co': 'es',     // 콜롬비아
    'es-pe': 'es',     // 페루
    'es-ve': 'es',     // 베네수엘라
    'es-cl': 'es',     // 칠레
    'es-ec': 'es',     // 에콰도르
    'es-gt': 'es',     // 과테말라
    'es-cu': 'es',     // 쿠바
    'es-bo': 'es',     // 볼리비아
    'es-do': 'es',     // 도미니카공화국
    'es-hn': 'es',     // 온두라스
    'es-py': 'es',     // 파라과이
    'es-sv': 'es',     // 엘살바도르
    'es-ni': 'es',     // 니카라과
    'es-cr': 'es',     // 코스타리카
    'es-pa': 'es',     // 파나마
    'es-uy': 'es',     // 우루과이
    
    // 포르투갈어 사용 국가들
    'pt': 'pt',
    'pt-br': 'pt',     // 브라질
    'pt-pt': 'pt',     // 포르투갈
    'pt-ao': 'pt',     // 앙골라
    'pt-mz': 'pt',     // 모잠비크
    'pt-gw': 'pt',     // 기니비사우
    'pt-cv': 'pt',     // 카보베르데
    'pt-st': 'pt',     // 상투메프린시페
    'pt-tl': 'pt',     // 동티모르
  }
  
  // 매칭된 로케일 반환, 없으면 기본값 'en' (영어)
  const detectedLocale = localeMap[browserLocale] || 
                         localeMap[browserLocale.split('-')[0]] || 
                         'en'
  
  console.log(`   Final Locale: ${detectedLocale} ${isCapacitorApp ? '(from device settings)' : '(from browser settings)'}`)
  console.log(`   Redirect: /${detectedLocale}/`)
  
  return detectedLocale
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // 정적 파일 및 API 경로는 건너뛰기
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // 파일 확장자가 있는 경우
  ) {
    return
  }

  // Supabase 세션 업데이트 (인증 처리)
  await updateSession(request)

  // 로케일이 없는 경로인지 확인
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // 루트 경로는 그대로 두기 (SplashPage 표시용)
  if (pathname === '/') {
    return
  }

  // /splash를 브라우저 언어에 맞는 로케일로 리다이렉트
  if (pathname === '/splash') {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}/splash`, request.url))
  }

  // 로케일이 없는 경로면 로케일 추가하여 리다이렉트
  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    
    // /main, /onboarding 등 유효한 경로만 로케일 추가
    if (pathname.startsWith('/main') || pathname.startsWith('/onboarding')) {
      const newUrl = new URL(`/${locale}${pathname}`, request.url)
      return NextResponse.redirect(newUrl)
    }
    
    // 그 외 잘못된 경로는 404 처리를 위해 그대로 둠
    return
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}