interface UsagePurposeScreenProps {
  onStepChange?: (step: number) => void
  currentStep?: number
}

'use client'

import { useParams } from 'next/navigation'
import { useTranslationContext } from '../../contexts/TranslationContext'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'

export default function UsagePurposeScreen({ onStepChange }: UsagePurposeScreenProps) {
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslationContext()
  const { setStep } = useOnboarding()
  const { isHomeButtonDevice } = useDeviceDetection()
  const [selectedPurpose, setSelectedPurpose] = useState<string>('')
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const purposes = [
    { id: 'personal', label: t('onboarding.usagePurpose.options.personal'), icon: '/Note.png' },
    { id: 'family', label: t('onboarding.usagePurpose.options.family'), icon: '/Family.png' },
    { id: 'church', label: t('onboarding.usagePurpose.options.church'), icon: '/Church.png' },
    { id: 'sermon', label: t('onboarding.usagePurpose.options.sermon'), icon: '/Sermon.png' }
  ]

  const handlePurposeSelect = (purposeId: string) => {
    setSelectedPurpose(purposeId)
  }

  const handleNext = () => {
    if (selectedPurpose) {
      // 컨텐츠 페이드아웃
      setShowContent(false)
      
      // 다음 스텝으로 이동
      setTimeout(() => {
        onStepChange?.(4)
      }, 400)
    }
  }

  const handleBack = () => {
    // 컨텐츠 페이드아웃
    setShowContent(false)
    
    // 이전 스텝으로 이동
    setTimeout(() => {
      onStepChange?.(2)
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
        
        .fade-options { 
          animation: fadeIn 0.8s ease-out 1.6s forwards; 
        }
        
        .fade-buttons { 
          animation: fadeIn 0.8s ease-out 2.0s forwards; 
        }
        
        .simple-button {
          transition: transform 0.15s ease-out, opacity 0.3s ease-out, background-color 0.3s ease-out;
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
        <h1 className="text-[18px] -mx-2 font-bold text-gray-800 mb-1 mt-6 tracking-wide fade-start fade-title">
          <span className="font-sour-gummy">Thankful </span>
          <span className="font-noto-serif-kr">{t('onboarding.usagePurpose.title')}</span>
        </h1>

        {/* 부제목 */}
        <p className="text-sm text-gray-600 mb-6 font-semibold font-noto-serif-kr leading-relaxed fade-start fade-subtitle">
          {t('onboarding.usagePurpose.subtitle')}
        </p>

        {/* 옵션들 */}
        <div className="space-y-3 mb-6 fade-start fade-options">
          {purposes.map((purpose) => (
            <button
              key={purpose.id}
              onClick={() => handlePurposeSelect(purpose.id)}
              className={`w-full h-15 p-3 rounded-lg font-noto-serif-kr option-card simple-button2 flex items-center relative
                         ${selectedPurpose === purpose.id 
                           ? 'bg-[#dad8c8] text-[#4d6f5e] ' 
                           : 'bg-white text-gray-700 '
                         }`}
            >
              <div className="flex items-center space-x-1 w-full">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <img 
                    src={purpose.icon} 
                    alt={purpose.label}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left flex-1 space-y-0.5">
                  <div className="font-extrabold text-gray-600 text-[14px]">{purpose.label}</div>
                </div>
              </div>
              
              {/* 체크 이미지 - 선택된 경우에만 표시 */}
              {selectedPurpose === purpose.id && (
                <div className="absolute -top-4 -right-4 w-12 h-12 check-icon">
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
      <div className="w-full max-w-sm space-y-3 px-4 pb-4 fade-start fade-buttons">
        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!selectedPurpose}
          className={`w-full retro-button button-screen-texture tracking-wider
                   font-semibold py-4 px-6 text-white font-jua text-lg
                   simple-button ${
                     selectedPurpose 
                       ? 'opacity-100' 
                       : 'opacity-50 cursor-not-allowed'
                   }`}
          style={{ 
            background: '#4f8750'
          }}
        >
          {t('onboarding.usagePurpose.nextButton')}
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