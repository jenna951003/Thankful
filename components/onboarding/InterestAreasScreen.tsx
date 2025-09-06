interface InterestAreasScreenProps {
  onStepChange?: (step: number) => void
  currentStep?: number
}

'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useTranslationContext } from '../../contexts/TranslationContext'

const getInterestOptions = (t: any) => [
  { 
    id: 'daily', 
    label: t('onboarding.interests.options.daily'), 
    icon: '/1.png'
  },
  { 
    id: 'family', 
    label: t('onboarding.interests.options.family'), 
    icon: '/2.png'
  },
  { 
    id: 'guidance', 
    label: t('onboarding.interests.options.guidance'), 
    icon: '/3.png'
  },
  { 
    id: 'health', 
    label: t('onboarding.interests.options.health'), 
    icon: '/4.png'
  },
  { 
    id: 'dreams', 
    label: t('onboarding.interests.options.dreams'), 
    icon: '/5.png'
  },
  { 
    id: 'prayers', 
    label: t('onboarding.interests.options.prayers'), 
    icon: '/6.png'
  },
  { 
    id: 'community', 
    label: t('onboarding.interests.options.community'), 
    icon: '/7.png'
  },
  { 
    id: 'work', 
    label: t('onboarding.interests.options.work'), 
    icon: '/8.png'
  }
]

export default function InterestAreasScreen({ onStepChange }: InterestAreasScreenProps) {
  const params = useParams()
  const locale = params.locale as string
  const { setInterests, setStep } = useOnboarding()
  const { isHomeButtonDevice } = useDeviceDetection()
  const { t } = useTranslationContext()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [showContent, setShowContent] = useState(false)
  
  const interestOptions = getInterestOptions(t)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleToggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleNext = () => {
    setInterests(selectedInterests)
    
    // 컨텐츠 페이드아웃
    setShowContent(false)
    
    // 다음 스텝으로 이동
    setTimeout(() => {
      onStepChange?.(5)
    }, 400)
  }

  const handleBack = () => {
    // 컨텐츠 페이드아웃
    setShowContent(false)
    
    // 이전 스텝으로 이동
    setTimeout(() => {
      onStepChange?.(3)
    }, 400)
  }

  return (
    <div className={`flex flex-col ${isHomeButtonDevice ? 'mb-[10vh]' : 'mb-[20vh]'} items-center w-full h-full text-center relative`}>
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
        
        .fade-interests { 
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

        .simple-button2 {
          transition: all 0.5s ease-in-out;
        }

        .simple-button2:active {
          transform: translateY(-2px);
        }

        .option-card {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .check-icon {
          animation: checkAppear 0.4s ease-out forwards;
        }

        @keyframes checkAppear {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(-15deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-start w-full max-w-md px-4">
        {/* 타이틀 */}
        <h1 className="text-lg -mx-2 font-bold text-gray-800 mb-1 mt-6 font-noto-serif-kr tracking-wide fade-start fade-title">
          {t('onboarding.interests.title')}
        </h1>

        {/* 부제목 */}
        <p className="text-base text-gray-600 mb-6 font-semibold font-noto-serif-kr leading-relaxed fade-start fade-subtitle">
          {t('onboarding.interests.subtitle')}
        </p>

        {/* 관심 영역 선택 */}
        <div className="grid grid-cols-2 gap-3 mb-6 fade-start fade-interests">
          {interestOptions.map((interest) => (
            <button
              key={interest.id}
              onClick={() => handleToggleInterest(interest.id)}
              className={`h-14 p-3 rounded-lg font-noto-serif-kr option-card simple-button2 flex items-center relative
                         ${selectedInterests.includes(interest.id)
                           ? 'bg-[#dad8c8] text-[#4d6f5e]'
                           : 'bg-white text-gray-700'
                         }`}
            >
              <div className="flex items-center space-x-1 w-full">
                <div className="flex-shrink-0 w-15 h-15 flex items-center justify-center">
                  <img 
                    src={interest.icon} 
                    alt={interest.label}
                    className="w-15 h-15 object-contain"
                  />
                </div>
                <div className="text-left flex-1">
                  <div className="font-extrabold text-[13px]">{interest.label}</div>
                </div>
              </div>
              
              {/* 체크 이미지 - 선택된 경우에만 표시 */}
              {selectedInterests.includes(interest.id) && (
                <div className="absolute -top-3 -right-3 w-10 h-10 check-icon">
                  <img 
                    src="/Check3.png" 
                    alt="Selected"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="w-full max-w-sm px-4 space-y-3 pb-4 fade-start fade-buttons">
        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          className="w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg simple-button"
          style={{ 
            background: '#4f8750'
          }}
        >
          {t('onboarding.interests.nextButton')}
        </button>

        {/* 뒤로 가기 버튼 */}
        <button
          onClick={handleBack}
          className="w-full retro-card text-gray-700 font-semibold py-4 px-6 font-jua simple-button"
        >
          {t('onboarding.usagePurpose.backButton')}
        </button>
      </div>
    </div>
  )
}