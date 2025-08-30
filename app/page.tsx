'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isOnboardingCompleted } from '../utils/onboarding'
import SplashPageClient from '../components/SplashPageClient'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // 로케일 감지 함수
    const detectLocale = () => {
      // 1. 브라우저 언어 감지
      const browserLanguage = navigator.language || navigator.languages?.[0] || 'en'
      
      // 2. 언어 코드 매핑
      const localeMap: { [key: string]: string } = {
        'ko': 'ko',
        'ko-KR': 'ko',
        'en': 'en', 
        'en-US': 'en',
        'en-GB': 'en',
        'es': 'es',
        'es-ES': 'es',
        'es-MX': 'es', 
        'pt': 'pt',
        'pt-BR': 'pt',
        'pt-PT': 'pt'
      }
      
      // 3. 매칭된 로케일 또는 기본값 반환
      const detectedLocale = localeMap[browserLanguage] || 
                           localeMap[browserLanguage.split('-')[0]] || 
                           'ko' // 기본값을 한국어로 설정
      
      return detectedLocale
    }

    // 5.4초 후 로케일 기반으로 라우팅 (텍스트 표시 2초 후)
    // 애니메이션 타이밍: 0s 이미지 → 1.2s 컬러로딩 → 3.4s 텍스트 → 5.4s 라우팅
    const timer = setTimeout(() => {
      const locale = detectLocale()
      const completed = isOnboardingCompleted()
      
      console.log('🚀 Splash routing:', { locale, completed })
      
      if (completed) {
        console.log('➡️ Navigating to main page:', `/${locale}`)
        router.replace(`/${locale}`)
      } else {
        console.log('➡️ Navigating to onboarding:', `/${locale}/onboarding/1`)
        router.replace(`/${locale}/onboarding/1`)
      }
    }, 5400)

    return () => clearTimeout(timer)
  }, [router])

  return <SplashPageClient locale="ko" />
}