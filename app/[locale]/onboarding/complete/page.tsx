import OnboardingCompleteClient from '../../../../components/onboarding/OnboardingCompleteClient'

interface OnboardingCompleteProps {
  params: Promise<{
    locale: string
  }>
}

export default async function OnboardingComplete({ params }: OnboardingCompleteProps) {
  const { locale } = await params

  return <OnboardingCompleteClient locale={locale} />
}