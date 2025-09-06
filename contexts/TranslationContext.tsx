'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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
        console.log(`✅ [TranslationContext] Loaded translations for ${locale}:`, Object.keys(data))
        setTranslations(data)
      } catch (error) {
        console.error(`❌ [TranslationContext] Failed to load translations for ${locale}:`, error)
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [locale])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`🔍 [Translation] Key not found: ${key} (locale: ${locale})`)
        return key
      }
    }
    
    const result = typeof value === 'string' ? value : key
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