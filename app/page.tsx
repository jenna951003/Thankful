'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 루트 페이지 - 적절한 로케일로 리다이렉트
export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // 브라우저 언어 감지 및 리다이렉트
    const getBrowserLocale = () => {
      if (typeof window === 'undefined') return 'en'

      const browserLocale = navigator.language.toLowerCase()

      // 언어-국가 매핑
      const localeMap: { [key: string]: string } = {
        'ko': 'ko', 'ko-kr': 'ko',
        'es': 'es', 'es-es': 'es', 'es-mx': 'es', 'es-ar': 'es',
        'pt': 'pt', 'pt-br': 'pt', 'pt-pt': 'pt',
      }

      return localeMap[browserLocale] || localeMap[browserLocale.split('-')[0]] || 'en'
    }

    const locale = getBrowserLocale()
    router.replace(`/${locale}`)
  }, [router])

  // 로딩 상태 표시
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(238, 234, 217)' }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🙏</div>
        <p className="text-gray-600">리다이렉트 중...</p>
      </div>
    </div>
  )
}