'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../../hooks/useTranslation'
import { completeOnboarding } from '../../utils/onboarding'

interface OnboardingCompleteClientProps {
  locale: string
}

export default function OnboardingCompleteClient({ locale }: OnboardingCompleteClientProps) {
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    // 온보딩 완료 상태 저장
    completeOnboarding()
    
    // 3초 후 로케일 메인 페이지로 이동
    const timer = setTimeout(() => {
      router.replace(`/${locale}`)
    }, 3000)

    return () => clearTimeout(timer)
  }, [router, locale])

  return (
    <div className="flex flex-col items-center justify-center h-full text-center fade-in-staggered">
      {/* 완료 애니메이션 배경 */}
      <div className="relative mb-8">
        {/* 중앙 체크 아이콘 */}
        <div className="w-24 h-24 retro-green rounded-full flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        {/* 플로팅 원형 요소들 */}
        <div className="floating-circle floating-circle-1" style={{ width: '24px', height: '24px' }} />
        <div className="floating-circle floating-circle-2" style={{ width: '16px', height: '16px' }} />
        <div className="floating-circle floating-circle-3" style={{ width: '20px', height: '20px' }} />
        <div className="floating-circle floating-circle-4" style={{ width: '12px', height: '12px' }} />
      </div>

      {/* 완료 메시지 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 font-jua">
        {t('onboarding.complete.title')}
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 font-noto-serif-kr">
        {t('onboarding.complete.subtitle')}
      </p>

      {/* 로딩 인디케이터 */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 retro-blue rounded-full animate-pulse"></div>
        <div className="w-3 h-3 retro-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 retro-yellow rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  )
}