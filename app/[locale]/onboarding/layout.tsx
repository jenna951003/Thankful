import OnboardingLayoutClient from '../../../components/onboarding/OnboardingLayoutClient'

interface OnboardingLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function OnboardingLayout({ children, params }: OnboardingLayoutProps) {
  const { locale } = await params

  return <OnboardingLayoutClient locale={locale}>{children}</OnboardingLayoutClient>
}