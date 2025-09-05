'use client'

import { use } from 'react'
import dynamic from 'next/dynamic'

// 온보딩 스크린 컴포넌트들을 동적 임포트
const WelcomeScreen = dynamic(() => import('../../../../components/onboarding/WelcomeScreen'), { ssr: false })
const GratitudeExperienceScreen = dynamic(() => import('../../../../components/onboarding/GratitudeExperienceScreen'), { ssr: false })
const UsagePurposeScreen = dynamic(() => import('../../../../components/onboarding/UsagePurposeScreen'), { ssr: false })
const InterestAreasScreen = dynamic(() => import('../../../../components/onboarding/InterestAreasScreen'), { ssr: false })
const NotificationSettingsScreen = dynamic(() => import('../../../../components/onboarding/NotificationSettingsScreen'), { ssr: false })
const FirstGratitudeScreen = dynamic(() => import('../../../../components/onboarding/FirstGratitudeScreen'), { ssr: false })
const SubscriptionScreen = dynamic(() => import('../../../../components/onboarding/SubscriptionScreen'), { ssr: false })
const OnboardingCompleteClient = dynamic(() => import('../../../../components/onboarding/OnboardingCompleteClient'), { ssr: false })

const stepComponents = {
  '1': WelcomeScreen,
  '2': GratitudeExperienceScreen,
  '3': UsagePurposeScreen,
  '4': InterestAreasScreen,
  '5': NotificationSettingsScreen,
  '6': FirstGratitudeScreen,
  '7': SubscriptionScreen,
  '8': OnboardingCompleteClient,
} as const

interface OnboardingStepProps {
  params: Promise<{
    locale: string
    step: string
  }>
}

export default function OnboardingStep({ params }: OnboardingStepProps) {
  const { locale, step } = use(params)
  
  const StepComponent = stepComponents[step as keyof typeof stepComponents]
  
  if (!StepComponent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">잘못된 단계입니다</h1>
          <p className="text-gray-600">유효한 온보딩 단계를 선택해주세요.</p>
        </div>
      </div>
    )
  }
  
  // OnboardingCompleteClient에 locale prop 전달
  if (step === '8') {
    return <StepComponent locale={locale} />
  }
  
  return <StepComponent />
}