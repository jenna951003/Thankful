'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { useTranslation } from '../hooks/useTranslation'
import { resetOnboarding } from '../utils/onboarding'

interface LocaleMainPageProps {
  locale: string
}

export default function LocaleMainPage({ locale }: LocaleMainPageProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { safeArea, isWebEnvironment } = useDeviceDetection()
  const [showWelcome, setShowWelcome] = useState(true)

  const handleResetOnboarding = () => {
    resetOnboarding()
    router.replace('/')
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* 상단 세이프존 */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `${safeArea.top}px`,
          backgroundColor: isWebEnvironment ? 'blue' : 'red', 
          opacity: '0.8',
          zIndex: 1000
        }}
      />

      {/* 플로팅 원형 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-circle floating-circle-1" />
        <div className="floating-circle floating-circle-2" />
        <div className="floating-circle floating-circle-3" />
        <div className="floating-circle floating-circle-4" />
        <div className="floating-circle floating-circle-5" />
      </div>

      {/* 메인 콘텐츠 */}
      <div 
        className="flex flex-col items-center justify-center h-full text-center px-6 fade-in-staggered"
        style={{
          minHeight: '100vh',
          paddingTop: `${safeArea.top + 20}px`,
          paddingBottom: `${safeArea.bottom + 20}px`
        }}
      >
        {showWelcome ? (
          // 환영 메시지
          <div className="max-w-md mx-auto">
            {/* 메인 로고/아이콘 */}
            <div className="text-6xl mb-8">🙏</div>
            
            {/* 환영 메시지 */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-jua">
              {t('main.welcome.title')}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 font-noto-serif-kr leading-relaxed">
              {t('main.welcome.subtitle')}
            </p>

            {/* 장식 요소들 */}
            <div className="relative mb-12">
              <div className="w-20 h-20 retro-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white">✨</span>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-4 w-full">
              <button
                onClick={() => setShowWelcome(false)}
                className="w-full retro-button retro-button-ocean font-bold py-4 px-6 text-white font-jua text-lg"
              >
                {t('main.welcome.startButton')}
              </button>
              
              <button
                onClick={handleResetOnboarding}
                className="w-full retro-card text-gray-600 font-semibold py-3 px-6 font-noto-serif-kr text-sm"
              >
                {t('main.welcome.onboardingButton')}
              </button>
            </div>
          </div>
        ) : (
          // 메인 앱 콘텐츠 (개발 중)
          <div className="max-w-md mx-auto">
            <div className="text-5xl mb-8">🚧</div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4 font-jua">
              {t('main.development.title')}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 font-noto-serif-kr">
              {t('main.development.subtitle')}
            </p>

            <div className="space-y-4 w-full">
              <button
                onClick={() => setShowWelcome(true)}
                className="w-full retro-button font-semibold py-4 px-6 text-white font-jua"
              >
                {t('main.development.backButton')}
              </button>
              
              <button
                onClick={handleResetOnboarding}
                className="w-full retro-button retro-button-warm text-white font-semibold py-3 px-6 font-noto-serif-kr"
              >
                {t('main.development.retryButton')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 하단 세이프존 */}
      <div 
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${safeArea.bottom}px`,
          backgroundColor: isWebEnvironment ? 'blue' : 'red', 
          opacity: '0.8',
          zIndex: 1000
        }}
      />
    </div>
  )
}