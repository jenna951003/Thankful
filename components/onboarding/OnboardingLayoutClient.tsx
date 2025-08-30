'use client'

import { useEffect, useState } from 'react'
import { OnboardingProvider } from '../../contexts/OnboardingContext'
import ProgressIndicator from './ProgressIndicator'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'

interface OnboardingLayoutClientProps {
  children: React.ReactNode
  locale: string
}

export default function OnboardingLayoutClient({ children, locale }: OnboardingLayoutClientProps) {
  const { safeArea, isWebEnvironment } = useDeviceDetection()
  const [showProgress, setShowProgress] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // UI 요소만 스테거드 애니메이션 (세이프존 제외)
    console.log('🎭 Starting UI-focused staggered fade-in')
    
    // 1단계: 프로그레스 바 (300ms 후)
    const timer1 = setTimeout(() => {
      console.log('🟠 Step 1: Showing progress bar')
      setShowProgress(true)
    }, 300)
    
    // 2단계: 메인 콘텐츠 (600ms 후)
    const timer2 = setTimeout(() => {
      console.log('🟡 Step 2: Showing main content')
      setShowContent(true)
    }, 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <OnboardingProvider>
      <div 
        className="min-h-screen relative overflow-hidden" 
        style={{ 
          background: 'var(--bg-base)',
          touchAction: 'pan-y',
          overscrollBehaviorX: 'none',
          userSelect: 'none'
        }}
      >
        {/* 상단 세이프존 - 항상 표시 */}
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

        {/* 프로그레스 인디케이터 */}
        <div 
          style={{ 
            position: 'fixed',
            top: `${safeArea.top + 32}px`,
            left: '20px',
            right: '20px',
            zIndex: 999,
            opacity: showProgress ? '1' : '0',
            transition: 'opacity 1.5s ease-out'
          }}
        >
          <ProgressIndicator />
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div 
          className="flex-grow relative"
          style={{
            minHeight: '100vh',
            paddingTop: `${safeArea.top + 60}px`,
            paddingBottom: `${safeArea.bottom + 20}px`,
            paddingLeft: '20px',
            paddingRight: '20px',
            opacity: showContent ? '1' : '0',
            transition: 'opacity 1.5s ease-out'
          }}
        >
          {children}
        </div>

        {/* 하단 세이프존 - 항상 표시 */}
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
    </OnboardingProvider>
  )
}