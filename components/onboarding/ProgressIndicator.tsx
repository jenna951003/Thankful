'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TOTAL_ONBOARDING_STEPS } from '../../utils/onboarding'
import { useOnboarding } from '../../contexts/OnboardingContext'

export default function ProgressIndicator() {
  const params = useParams()
  const currentStep = parseInt(params.step as string) || 1
  const [shrinkingStep, setShrinkingStep] = useState<number | null>(null)
  const [fillingStep, setFillingStep] = useState<number | null>(null)
  const { setStep } = useOnboarding()

  useEffect(() => {
    const prevStep = parseInt(sessionStorage.getItem('onboarding_prev_step') || '1')
    
    // 실제로 단계가 변경되었을 때만 애니메이션
    if (currentStep !== prevStep) {
      // 전환 상태 해제
      setStep(currentStep)
      
      if (currentStep < prevStep) {
        // 뒤로가기 - 이전 단계 축소
        setShrinkingStep(prevStep)
        setFillingStep(null)
        setTimeout(() => setShrinkingStep(null), 800)
      } else if (currentStep > prevStep) {
        // 앞으로가기 - 현재 단계 채우기
        setFillingStep(currentStep)
        setShrinkingStep(null)
        setTimeout(() => setFillingStep(null), 800)
      }
    }
    
    sessionStorage.setItem('onboarding_prev_step', currentStep.toString())
  }, [currentStep])

  return (
    <div className="flex space-x-1.5">
      {Array.from({ length: TOTAL_ONBOARDING_STEPS }, (_, index) => {
        const stepNumber = index + 1
        
        let barClass = ''
        let barAnimation = ''
        
        if (stepNumber === shrinkingStep) {
          // 뒤로가기 축소 애니메이션
          barClass = 'w-full'
          barAnimation = 'progressShrink 0.8s ease-out forwards'
        } else if (stepNumber === fillingStep) {
          // 앞으로가기 채우기 애니메이션
          barClass = 'w-0'
          barAnimation = 'progressFill 0.8s ease-out forwards'
        } else if (stepNumber < currentStep) {
          // 완료된 바 - 애니메이션 없이 고정 (절대 재애니메이션 안함)
          barClass = 'w-full'
        } else if (stepNumber === currentStep) {
          // 현재 바 - 애니메이션 없이 완료 상태
          barClass = 'w-full'
        } else {
          // 미완료 바
          barClass = 'w-0 bg-transparent'
        }
        
        const hasBackground = stepNumber <= currentStep || stepNumber === shrinkingStep
        
        return (
          <div
            key={stepNumber}
            className="flex-1 h-1 rounded-full overflow-hidden bg-[#c8c6b1] relative retro-progress-bar"
          >
            <div
              className={`h-full transition-all duration-300 ease-out relative ${barClass}`}
              style={{
                background: hasBackground 
                  ? 'linear-gradient(90deg,rgb(162, 208, 162),rgb(114, 166, 122))' 
                  : 'transparent',
                animation: barAnimation || undefined
              }}
            />
          </div>
        )
      })}
      
      <style jsx>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes progressShrink {
          from { width: 100%; }
          to { width: 0%; }
        }

        /* 레트로 스크린 효과 */
        .retro-progress-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(255, 255, 255, 0.09) 1px,
            rgba(255, 255, 255, 0.06) 2px
          );
          z-index: 1;
          pointer-events: none;
        }

        .retro-progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: '';
          z-index: 2;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}