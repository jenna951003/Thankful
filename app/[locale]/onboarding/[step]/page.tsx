import WelcomeScreen from '../../../../components/onboarding/WelcomeScreen'
import FaithBackgroundScreen from '../../../../components/onboarding/FaithBackgroundScreen'
import GratitudeExperienceScreen from '../../../../components/onboarding/GratitudeExperienceScreen'
import InterestAreasScreen from '../../../../components/onboarding/InterestAreasScreen'
import NotificationSettingsScreen from '../../../../components/onboarding/NotificationSettingsScreen'
import FirstGratitudeScreen from '../../../../components/onboarding/FirstGratitudeScreen'
import SubscriptionScreen from '../../../../components/onboarding/SubscriptionScreen'

const stepComponents = {
  '1': WelcomeScreen,
  '2': FaithBackgroundScreen,
  '3': GratitudeExperienceScreen,
  '4': InterestAreasScreen,
  '5': NotificationSettingsScreen,
  '6': FirstGratitudeScreen,
  '7': SubscriptionScreen,
} as const

interface OnboardingStepProps {
  params: Promise<{
    locale: string
    step: string
  }>
}

export default async function OnboardingStep({ params }: OnboardingStepProps) {
  const { locale, step } = await params
  
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
  
  return <StepComponent />
}