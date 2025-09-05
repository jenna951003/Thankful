'use client'

import { use } from 'react'
import OnboardingFlow from '../../../../components/onboarding/OnboardingFlow'

interface OnboardingStepProps {
  params: Promise<{
    locale: string
    step: string
  }>
}

export default function OnboardingStep({ params }: OnboardingStepProps) {
  const { locale, step } = use(params)
  
  const stepNumber = parseInt(step)
  
  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 8) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">잘못된 단계입니다</h1>
          <p className="text-gray-600">유효한 온보딩 단계를 선택해주세요.</p>
        </div>
      </div>
    )
  }
  
  return <OnboardingFlow initialStep={stepNumber} locale={locale} />
}