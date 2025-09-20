'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getTranslationFallback } from '../utils/translationFallbacks'

interface TranslationContextType {
  locale: string
  translations: any
  t: (key: string) => string
  isLoading: boolean
  fontClass: string
  buttonFontClass: string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export const useTranslationContext = () => {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider')
  }
  return context
}

interface TranslationProviderProps {
  children: React.ReactNode
  locale: string
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  locale
}) => {
  const [translations, setTranslations] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true)
        // 캐시 버스터 추가
        const cacheBuster = Date.now()
        const response = await fetch(`/locales/${locale}/common.json?v=${cacheBuster}`)
        const data = await response.json()

        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ [TranslationContext] Loaded translations for ${locale}:`, Object.keys(data))
        }

        setTranslations(data)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ [TranslationContext] Failed to load translations for ${locale}:`, error)
        }
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [locale])

  const t = (key: string): string => {
    // 번역 데이터가 아직 로딩 중이면 fallback 사용
    if (isLoading || !translations || Object.keys(translations).length === 0) {
      // fallback 로그는 debug 레벨로 변경하여 노이즈 감소
      if (process.env.NODE_ENV === 'development') {
        console.debug(`⏳ [Translation] Data not ready, using fallback: ${key} (locale: ${locale}, isLoading: ${isLoading})`)
      }
      return getTranslationFallback(key, locale)
    }

    const keys = key.split('.')
    let value = translations

    if (process.env.NODE_ENV === 'development') {
      console.debug(`🔍 [Translation] Looking for key: ${key} in locale: ${locale}`)
    }

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
        if (process.env.NODE_ENV === 'development') {
          console.debug(`  ✓ Found part ${i + 1}/${keys.length}: ${keys.slice(0, i + 1).join('.')}`)
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`🔍 [Translation] Key not found: ${key} (locale: ${locale})`)
          console.debug(`  ❌ Failed at part ${i + 1}/${keys.length}: '${k}' not found in:`, Object.keys(value || {}))
          console.debug(`  📊 Available translations:`, translations)
        }

        // fallback 값 시도
        const fallback = getTranslationFallback(key, locale)
        if (process.env.NODE_ENV === 'development') {
          console.debug(`  🔄 Using fallback: ${fallback}`)
        }
        return fallback
      }
    }

    const result = typeof value === 'string' ? value : key
    if (process.env.NODE_ENV === 'development') {
      console.debug(`  ✅ Final result for '${key}': ${result}`)
    }
    return result
  }

  // 로케일별 폰트 클래스 결정
  const getFontClass = (locale: string): string => {
    return locale === 'ko' ? 'font-noto-serif-kr' : 'font-sofadi-one'
  }

  // 로케일별 버튼 폰트 클래스 결정
  const getButtonFontClass = (locale: string): string => {
    return locale === 'ko' ? 'font-jua' : 'font-sofadi-one font-extrabold'
  }

  const value = {
    locale,
    translations,
    t,
    isLoading,
    fontClass: getFontClass(locale),
    buttonFontClass: getButtonFontClass(locale)
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}