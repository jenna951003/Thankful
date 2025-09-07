interface NotificationSettingsScreenProps {
  onStepChange?: (step: number) => void
  currentStep?: number
}

'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useTranslationContext } from '../../contexts/TranslationContext'

const getTimeOptions = (t: any) => [
  { 
    id: 'morning', 
    time: '8:00', 
    label: t('onboarding.notifications.timeOptions.morning.label'), 
    description: t('onboarding.notifications.timeOptions.morning.description'),
    icon: '🌅'
  },
  { 
    id: 'night', 
    time: '21:00', 
    label: t('onboarding.notifications.timeOptions.night.label'), 
    description: t('onboarding.notifications.timeOptions.night.description'),
    icon: '🌙'
  }
]

export default function NotificationSettingsScreen({ onStepChange }: NotificationSettingsScreenProps) {
  const params = useParams()
  const locale = params.locale as string
  const { setNotifications, setStep } = useOnboarding()
  const { t } = useTranslationContext()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [weeklyReview, setWeeklyReview] = useState(true)
  const [showContent, setShowContent] = useState(false)
  
  const timeOptions = getTimeOptions(t)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    const selectedOption = timeOptions.find(option => option.id === selectedTime)
    setNotifications({
      dailyTime: selectedOption?.time || null,
      weeklyReview
    })
    
    // 컨텐츠 페이드아웃
    setShowContent(false)
    
    // 다음 스텝으로 이동
    setTimeout(() => {
      onStepChange?.(6)
    }, 400)
  }

  const handleBack = () => {
    // 컨텐츠 페이드아웃
    setShowContent(false)
    
    // 이전 스텝으로 이동
    setTimeout(() => {
      onStepChange?.(4)
    }, 400)
  }

  return (
    <div className="flex flex-col mb-[20vh] md:mb-[25vh] items-center w-full h-full text-center relative">
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
        
        .fade-time-options { 
          animation: fadeIn 0.8s ease-out 1.6s forwards; 
        }
        
        .fade-weekly { 
          animation: fadeIn 0.8s ease-out 2.0s forwards; 
        }
        
        .fade-buttons { 
          animation: fadeIn 0.8s ease-out 2.4s forwards; 
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

        .toggle-switch {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        /* 레트로 TV 질감 효과 - 스캔라인 */
        .toggle-switch::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          );
          z-index: 1;
          pointer-events: none;
        }

        /* 레트로 TV 질감 효과 - 노이즈 */
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 

          z-index: 2;
          pointer-events: none;
        }

        .toggle-switch.active {
          box-shadow: 0 0 20px rgba(77, 111, 94, 0.3);
          transform: scale(1.05);
        }

        .toggle-switch:active {
          transform: scale(0.98);
        }

        .toggle-switch.active:active {
          transform: scale(1);
        }

        .toggle-thumb {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 3;
        }

        .toggle-switch.active .toggle-thumb {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-start w-full max-w-md px-4">
        {/* 타이틀 */}
        <h1 className="text-lg md:text-xl -mx-2 font-bold text-gray-800 mb-1 md:mb-2 mt-6 font-noto-serif-kr tracking-wide fade-start fade-title">
          {t('onboarding.notifications.title')}
        </h1>

        {/* 부제목 */}
        <p className="text-base md:text-lg text-gray-600 mb-6 font-semibold font-noto-serif-kr leading-relaxed fade-start fade-subtitle">
          {t('onboarding.notifications.subtitle')}
        </p>

        {/* 시간 선택 옵션들 */}
        <div className="grid grid-cols-2 gap-3 mb-4 fade-start fade-time-options">
          {timeOptions.map((option) => {
            const isSelected = selectedTime === option.id
            return (
              <button
                key={option.id}
                onClick={() => setSelectedTime(option.id)}
                className={`h-15 md:h-18 py-3 pr-3 pl-1 rounded-lg font-noto-serif-kr option-card simple-button2 flex items-center relative
                           ${isSelected
                             ? 'bg-[#dad8c8] text-[#3f5a4d]'
                             : 'bg-white text-gray-700'
                           }`}
              >
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <img 
                      src={`/${option.id === 'morning' ? 'Morning' : 'Night'}.png`}
                      alt={option.label}
                      className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-extrabold text-[13px] md:text-[15px]">{option.label}</div>
                    <div className="text-[11px] md:text-[13px] font-extrabold text-gray-400">{option.description}</div>
                  </div>
                </div>
                
                {/* 체크 이미지 - 선택된 경우에만 표시 */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 check-icon">
                    <img 
                      src="/Check3.png" 
                      alt="Selected"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Retro Forest Progress Bar */}
        <div className="w-16 h-1 retro-lavender rounded-full mx-auto mb-4 fade-start fade-time-options"></div>

        {/* 일일 알림 설정 */}
        <div className="fade-start fade-weekly mb-3">
          <div className="flex h-16 md:h-20 items-center justify-between p-3 px-4 bg-white font-noto-serif-kr rounded-lg">
            <div className="text-left">
              <div className="font-extrabold text-[14px] md:text-[16px] text-gray-800">{t('onboarding.notifications.dailyNotification.title')}</div>
              <div className="text-[11px] md:text-[13px] font-bold text-gray-500">{t('onboarding.notifications.dailyNotification.description')}</div>
            </div>
            <button
              onClick={() => setSelectedTime(selectedTime ? null : 'morning')}
              className={`w-10 h-6 rounded-full toggle-switch ${
                selectedTime ? 'bg-[#4d6f5e] active' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full toggle-thumb ${
                selectedTime ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* 주간 리뷰 설정 */}
        <div className="fade-start fade-weekly mb-8">
          <div className="flex h-16 md:h-20 items-center justify-between p-3 px-4 bg-white font-noto-serif-kr rounded-lg">
            <div className="text-left">
              <div className="font-extrabold text-[14px] md:text-[16px] text-gray-800">{t('onboarding.notifications.weeklyReview.title')}</div>
              <div className="text-[11px] md:text-[13px] font-bold text-gray-500">{t('onboarding.notifications.weeklyReview.description')}</div>
            </div>
            <button
              onClick={() => setWeeklyReview(!weeklyReview)}
              className={`w-10 h-6 rounded-full toggle-switch ${
                weeklyReview ? 'bg-[#4d6f5e] active' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full toggle-thumb ${
                weeklyReview ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* 버튼들 */}
      <div className="w-full max-w-sm px-4 space-y-3 pb-4 fade-start fade-buttons md:max-w-md mx-auto">
        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          className="w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg simple-button"
          style={{ 
            background: '#4f8750'
          }}
        >
          {t('onboarding.notifications.nextButton')}
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