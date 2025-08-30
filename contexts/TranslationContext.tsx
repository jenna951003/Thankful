'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface TranslationContextType {
  locale: string
  translations: any
  t: (key: string) => string
  isLoading: boolean
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
        const response = await fetch(`/locales/${locale}/common.json`)
        const data = await response.json()
        setTranslations(data)
      } catch (error) {
        console.error('Failed to load translations:', error)
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
        return key
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const value = {
    locale,
    translations,
    t,
    isLoading
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}