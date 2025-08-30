import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

type TranslationKeys = {
  [key: string]: any
}

export function useTranslation() {
  const pathname = usePathname()
  const [translations, setTranslations] = useState<TranslationKeys>({})
  const [isLoading, setIsLoading] = useState(true)
  
  // pathname에서 locale 추출 (예: /ko/some-path -> ko)
  const locale = pathname.split('/')[1] || 'en'
  const validLocales = ['en', 'ko', 'es', 'pt']
  const currentLocale = validLocales.includes(locale) ? locale : 'en'

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/locales/${currentLocale}/common.json`)
        const data = await response.json()
        setTranslations(data)
      } catch (error) {
        console.error('번역 로딩 실패:', error)
        // 기본 영어 번역 로드
        try {
          const response = await fetch('/locales/en/common.json')
          const data = await response.json()
          setTranslations(data)
        } catch (fallbackError) {
          console.error('기본 번역 로딩도 실패:', fallbackError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [currentLocale])

  const t = (key: string): string => {
    if (isLoading) return key
    
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // 키를 찾을 수 없으면 키 자체 반환
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return { t, locale: currentLocale, isLoading }
}