'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { detectUserLocale } from '../utils/locale'

export default function LocaleDetector() {
  const router = useRouter()

  useEffect(() => {
    const handleLocaleDetection = async () => {
      // 이미 언어가 설정된 경우 스킵
      if (router.locale && router.locale !== 'en') {
        return
      }
      
      // 로컬스토리지에 이미 언어 설정이 있는지 확인
      const savedLocale = localStorage.getItem('preferredLocale')
      if (savedLocale && ['ko', 'es', 'pt', 'en'].includes(savedLocale)) {
        if (savedLocale !== router.locale) {
          router.push(router.asPath, router.asPath, { locale: savedLocale })
        }
        return
      }

      try {
        // 위치 기반 언어 감지
        const detectedLocale = await detectUserLocale()
        
        // 감지된 언어로 리다이렉트
        if (detectedLocale !== router.locale) {
          localStorage.setItem('preferredLocale', detectedLocale)
          router.push(router.asPath, router.asPath, { locale: detectedLocale })
        }
      } catch (error) {
        console.log('언어 감지 실패, 기본 영어 유지:', error)
      }
    }

    // 첫 로드시에만 실행
    if (router.isReady) {
      handleLocaleDetection()
    }
  }, [router.isReady, router.locale, router.asPath])

  return null // UI 없음
}