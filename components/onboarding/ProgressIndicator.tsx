'use client'

import { useParams } from 'next/navigation'
import { TOTAL_ONBOARDING_STEPS } from '../../utils/onboarding'

export default function ProgressIndicator() {
  const params = useParams()
  const currentStep = parseInt(params.step as string) || 1

  return (
    <div className="flex space-x-1.5">
      {Array.from({ length: TOTAL_ONBOARDING_STEPS }, (_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep
        
        return (
          <div
            key={stepNumber}
            className="flex-1 h-1 rounded-full overflow-hidden bg-[#c8c6b1] relative retro-progress-bar"
          >
            <div
              className={`h-full transition-all duration-300 ease-out relative ${
                isCompleted 
                  ? 'w-full' 
                  : isActive 
                    ? 'animate-progress-fill'
                    : 'bg-transparent w-0'
              }`}
              style={{
                background: isCompleted || isActive ? 
                  'linear-gradient(90deg,rgb(165, 147, 90),rgb(78, 148, 50))' : 
                  'transparent',
                animation: isActive ? 'progressFill 0.8s ease-out forwards' : undefined
              }}
            />
          </div>
        )
      })}
      
      <style jsx>{`
        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        .animate-progress-fill {
          animation: progressFill 0.8s ease-out forwards;
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
          background: 
          z-index: 2;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}