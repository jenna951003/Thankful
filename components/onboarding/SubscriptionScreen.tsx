interface SubscriptionScreenProps {
  onStepChange?: (step: number) => void
  currentStep?: number
}

'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useSubscriptionModal } from './OnboardingFlow'


export default function SubscriptionScreen({ onStepChange }: SubscriptionScreenProps) {
  const params = useParams()
  const locale = params.locale as string
  const { setStep } = useOnboarding()
  const [showContent, setShowContent] = useState(false)
  const { setIsModalOpen } = useSubscriptionModal()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleStartTrial = (e: React.MouseEvent) => {
    // 버튼 강제 blur 처리
    const button = e.currentTarget as HTMLElement
    setTimeout(() => {
      button.blur()
    }, 10)
    setIsModalOpen(true)
  }

  const handleNext = () => {
    // 컨텐츠 페이드아웃
    setShowContent(false)
    
    // 다음 스텝으로 이동 (8페이지 - 완료 페이지)
    setTimeout(() => {
      onStepChange?.(8)
    }, 400)
  }

  const handleExploreFirst = () => {
    // 컨텐츠 페이드아웃
    setShowContent(false)
    
    // 온보딩 완료 처리
    setTimeout(() => {
      // 홈으로 이동하거나 온보딩 완료 처리
      window.location.href = `/${locale}`
    }, 400)
  }

  const handleBack = () => {
    // 컨텐츠 페이드아웃
    setShowContent(false)
    
    // 이전 스텝으로 이동
    setTimeout(() => {
      onStepChange?.(6)
    }, 400)
  }

  return (
    <div className="flex flex-col mb-[20vh] items-center w-full h-full text-center relative">
      {/* CSS 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fade-start { opacity: 0; }
        
        .fade-title { 
          animation: fadeIn 0.8s ease-out 0.8s forwards; 
        }
        
        .fade-subtitle { 
          animation: fadeIn 0.8s ease-out 1.2s forwards; 
        }
        
        .fade-features { 
          animation: fadeIn 0.8s ease-out 1.6s forwards; 
        }
        
        .fade-buttons { 
          animation: fadeIn 0.8s ease-out 2.0s forwards; 
        }
        
        .simple-button {
          transition: transform 0.15s ease-out;
        }
        
        .simple-button:active {
          transform: scale(0.98);
        }

        /* Premium 배지 회전 애니메이션 */
        .premium-badge {
          transition: transform 0.15s ease-out;

        }

        button.premium-button:active ~ .premium-badge {
          transform:  scale(1.1) !important;
        }

        button.premium-button:hover ~ .premium-badge {
          transform:  scale(1.05);
        }

        /* 프리미엄 박스 효과 */
        .premium-box {
          transition: transform 0.15s ease-out;
        }

        .premium-box:hover {
          transform: scale(1.06);
        }

        .premium-box:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-start w-full max-w-md px-4">
        {/* 타이틀 */}
        <h1 className="text-lg -mx-2 font-bold text-gray-800 mb-1 mt-6 font-noto-serif-kr tracking-wide fade-start fade-title">
          더 풍성한 감사의 삶을 경험하세요!
        </h1>

        {/* 부제목 */}
        <p className="text-sm text-gray-600 mb-12 font-semibold font-noto-serif-kr leading-relaxed fade-start fade-subtitle">
          더 많은 도구로 감사를 깊이 기록해보세요
        </p>

        {/* 프리미엄 박스 이미지 */}
        <div className="mb-8 fade-start fade-features flex justify-center">
          <img 
            src="/PremiumBox2.png" 
            alt="Premium Features"
            className="w-full max-w-[212px] object-contain premium-box cursor-pointer"
          />
        </div>
      </div>

      {/* 버튼들 */}
      <div className="w-full max-w-sm px-4 space-y-3 pb-4 fade-start fade-buttons">
        {/* 무료 체험 시작 버튼 */}
        <div className="relative">
                  <button
          onClick={handleStartTrial}
          className="w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg simple-button premium-button"
          style={{ 
            background: 'linear-gradient(135deg,rgb(212, 207, 116) 0%, #a8644d 50%,rgb(55, 139, 90) 100%)',

          }}
        >
          무료 체험 시작
        </button>
          <div className="absolute -top-8 -right-6 w-16 h-16 rotate-24 premium-badge" style={{ zIndex: 10 }}>
            <img 
              src="/Premium3.png" 
              alt="Premium"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 뒤로 & 나중에 버튼 */}
        <div className="flex space-x-3">
          <button
            onClick={handleBack}
            className="flex-1 retro-card text-gray-700 font-semibold py-4 px-6 font-jua simple-button"
          >
            뒤로
          </button>

          <button
            onClick={handleNext}
            className="flex-1 retro-card text-gray-700 font-semibold py-4 px-6 font-jua simple-button"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  )
}