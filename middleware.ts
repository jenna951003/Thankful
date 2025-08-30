import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'ko', 'es', 'pt']
const defaultLocale = 'en'

// 국가별 언어 매핑 (간소화된 버전)
const countryToLocale: { [key: string]: string } = {
  KR: 'ko',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es', CL: 'es',
  BR: 'pt', PT: 'pt',
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en'
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // 브라우저 언어 설정에서 감지 시도
    const acceptLanguage = request.headers.get('accept-language')
    let detectedLocale = defaultLocale

    if (acceptLanguage) {
      const browserLang = acceptLanguage.split(',')[0].split('-')[0]
      if (locales.includes(browserLang)) {
        detectedLocale = browserLang
      }
    }

    // 로케일 없으면 기본은 영어로 리디렉트
    return NextResponse.redirect(
      new URL(`/${detectedLocale || defaultLocale}${pathname}`, request.url)
    )
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|locales).*)',
  ],
}