'use client'

import { useEffect } from 'react'

interface HtmlLangSetterProps {
  locale: string
}

export default function HtmlLangSetter({ locale }: HtmlLangSetterProps) {
  useEffect(() => {
    // HTML element의 lang 속성과 data-locale 속성을 현재 locale로 설정
    document.documentElement.lang = locale
    document.documentElement.setAttribute('data-locale', locale)
  }, [locale])

  return null // 실제 UI는 렌더링하지 않음
}