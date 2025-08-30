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
            className="flex-1 h-1 rounded-full overflow-hidden bg-[#d8d3ba]"
          >
            <div
              className={`h-full transition-all duration-300 ease-out ${
                isCompleted 
                  ? 'w-full' 
                  : isActive 
                    ? 'animate-progress-fill'
                    : 'bg-transparent w-0'
              }`}
              style={{
                background: isCompleted || isActive ? 
                  'linear-gradient(90deg, #b8a085 0%,rgb(167, 168, 130) 25%, #87a674 50%, #7ba470 75%,rgb(73, 109, 67) 100%)' : 
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
      `}</style>
    </div>
  )
}