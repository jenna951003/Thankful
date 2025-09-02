'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useSubscriptionModal } from './OnboardingLayoutClient'

const premiumFeatures = [
  { 
    image: 'Prompt.png', 
    title: '1000+ 감사 프롬프트',
    description: '다양한 상황별 맞춤 질문들'
  },
  { 
    image: 'Ai.png', 
    title: 'AI 개인 맞춤 분석',
    description: '감사 패턴 분석과 인사이트 제공'
  },
  { 
    image: 'Report.png', 
    title: '감사 성장 리포트',
    description: '월간/연간 감사 여정 리포트'
  },
  { 
    image: 'Palette.png', 
    title: '감사/설교/기도 노트 꾸미기',
    description: '아름다운 템플릿으로 기록을 특별하게'
  },
  { 
    image: 'Community.png', 
    title: '믿음의 커뮤니티',
    description: '함께 나누는 감사의 교제'
  }
]

export default function SubscriptionScreen() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { startTransition, setStep } = useOnboarding()
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

  const handleExploreFirst = () => {
    // 전환 시작
    startTransition()
    
    // 페이드아웃 후 페이지 이동
    setTimeout(() => {
      setStep(8)
      router.push(`/${locale}/onboarding/8`)
    }, 400)
  }

  const handleBack = () => {
    // 전환 시작
    startTransition()
    
    // 페이드아웃 후 페이지 이동
    setTimeout(() => {
      setStep(6)
      router.push(`/${locale}/onboarding/6`)
    }, 400)
  }

  return (
    <div className="flex flex-col mb-[10vh] items-center w-full h-full text-center relative">
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
      `}</style>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-start w-full max-w-md px-4">
        {/* 타이틀 */}
        <h1 className="text-lg -mx-2 font-bold text-gray-800 mb-1 mt-6 font-noto-serif-kr tracking-wide fade-start fade-title">
          더 풍성한 감사의 삶을 경험하세요!
        </h1>

        {/* 부제목 */}
        <p className="text-sm text-gray-600 mb-4 font-semibold font-noto-serif-kr leading-relaxed fade-start fade-subtitle">
          더 많은 도구로 감사를 깊이 기록해보세요
        </p>

        {/* 프리미엄 기능들 */}
        <div className="space-y-3 mb-8 fade-start fade-features">
          {premiumFeatures.map((feature) => (
            <div 
              key={feature.title}
              className="flex items-center justify-between py-2  px-4 bg-white font-noto-serif-kr rounded-xl"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <img 
                    src={`/${feature.image}`} 
                    alt={feature.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="text-left flex-1">
                  <div className="font-extrabold text-[14px] text-gray-800">{feature.title}</div>
                  <div className="text-[11px] font-bold text-gray-500">{feature.description}</div>
                </div>
              </div>
            </div>
          ))}
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
            onClick={handleExploreFirst}
            className="flex-1 retro-card text-gray-700 font-semibold py-4 px-6 font-jua simple-button"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  )
}