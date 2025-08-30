'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import { isOnboardingCompleted } from '../utils/onboarding'

interface SplashPageClientProps {
  locale: string
}

export default function SplashPageClient({ locale }: SplashPageClientProps) {
  const { safeArea, isWebEnvironment } = useDeviceDetection()
  const router = useRouter()
  const [showBackground, setShowBackground] = useState(false)
  const [showText, setShowText] = useState(false)
  const [colorRevealProgress, setColorRevealProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  // 로케일별 감사 메시지
  const getMessage = () => {
    switch(locale) {
      case 'ko':
        return '주님, 감사합니다'
      case 'es':
        return 'Gracias, Señor'
      case 'pt':
        return 'Obrigado, Senhor'
      default:
        return 'Thank you, Lord'
    }
  }

  useEffect(() => {
    // 배경 이미지 페이드인
    const backgroundTimer = setTimeout(() => {
      setShowBackground(true)
    }, 0)

    // 1.2초 후 컬러 로딩 애니메이션 시작
    const colorAnimationTimer = setTimeout(() => {
      // 컬러 로딩 애니메이션 (2초 동안 0%에서 100%까지)
      const startTime = Date.now()
      const duration = 2000 // 2초
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        setColorRevealProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // 컬러 애니메이션 완료 후 텍스트 표시
          setTimeout(() => {
            setShowText(true)
            
            // 텍스트 표시 2초 후 페이드아웃 시작
            setTimeout(() => {
              console.log('🌅 Starting fade-out animation')
              setIsExiting(true)
              
              // 페이드아웃 완료 후 라우팅 (0.8초)
              setTimeout(() => {
                const completed = isOnboardingCompleted()
                console.log('🚀 SplashClient routing:', { locale, completed })
                
                if (completed) {
                  console.log('➡️ Navigating to main page:', `/${locale}`)
                  router.replace(`/${locale}`)
                } else {
                  console.log('➡️ Navigating to onboarding:', `/${locale}/onboarding/1`)
                  router.replace(`/${locale}/onboarding/1`)
                }
              }, 800) // 페이드아웃 애니메이션 시간
            }, 2000)
          }, 200) // 0.2초 후 텍스트 나타남
        }
      }
      
      requestAnimationFrame(animate)
    }, 1200)

    return () => {
      clearTimeout(backgroundTimer)
      clearTimeout(colorAnimationTimer)
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* 상단 세이프존 - 항상 표시 (페이드아웃 안됨) */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `${safeArea.top}px`,
          backgroundColor: isWebEnvironment ? 'blue' : 'red', 
          opacity: '0.8',
          zIndex: 2000
        }}
      />

      {/* 페이드아웃 컨텐츠 래퍼 */}
      <div 
        className={`min-h-screen transition-opacity duration-800 ease-out ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* 메인 콘텐츠 영역 */}
        <div className="flex-grow relative" style={{
          minHeight: '100vh'
        }}>
            {/* 배경 이미지 레이어 */}
            {/* 흑백 베이스 이미지 (Splash3.png) */}
            <div 
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: 'url(/Splash3.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                opacity: showBackground ? 1 : 0,
                transform: 'translateY(-5%)',
                zIndex: 1
              }}
            />
            
            {/* 컬러 오버레이 이미지 (Splash2.png) - 위에서 아래로 점진적 공개 */}
            <div 
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: 'url(/Splash2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                opacity: showBackground ? 1 : 0,
                transform: 'translateY(-5%)',
                zIndex: 2,
                maskImage: `linear-gradient(to bottom, 
                  rgba(0,0,0,1) 0%, 
                  rgba(0,0,0,1) ${Math.max(0, colorRevealProgress * 100 - 5)}%, 
                  rgba(0,0,0,0.7) ${colorRevealProgress * 100 - 2}%, 
                  rgba(0,0,0,0.3) ${colorRevealProgress * 100}%, 
                  rgba(0,0,0,0) ${colorRevealProgress * 100 + 3}%, 
                  rgba(0,0,0,0) 100%
                )`,
                WebkitMaskImage: `linear-gradient(to bottom, 
                  rgba(0,0,0,1) 0%, 
                  rgba(0,0,0,1) ${Math.max(0, colorRevealProgress * 100 - 5)}%, 
                  rgba(0,0,0,0.7) ${colorRevealProgress * 100 - 2}%, 
                  rgba(0,0,0,0.3) ${colorRevealProgress * 100}%, 
                  rgba(0,0,0,0) ${colorRevealProgress * 100 + 3}%, 
                  rgba(0,0,0,0) 100%
                )`
              }}
            />

            {/* 하단 감사 멘트 */}
            <div 
              className="absolute left-0 right-0 text-center z-10 transition-all duration-800 ease-out"
              style={{
                bottom: `${safeArea.bottom + 104}px`,
                opacity: showText ? 1 : 0,
                transform: showText ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <p 
                className={`text-3xl font-bold text-[#4f4f4f] drop-shadow-lg ${
                  locale === 'ko' ? 'font-nanum-brush-script' : 'font-fascinate'
                }`}
                style={{
                  textShadow: '2px 2px 2px rgba(255, 255, 255, 0.5)'
                }}
              >
                {getMessage()}
              </p>
            </div>
        </div>
      </div>

      {/* 하단 세이프존 - 항상 표시 (페이드아웃 안됨) */}
      <div 
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${safeArea.bottom}px`,
          backgroundColor: isWebEnvironment ? 'blue' : 'red', 
          opacity: '0.8',
          zIndex: 2000
        }}
      />
    </div>
  )
}