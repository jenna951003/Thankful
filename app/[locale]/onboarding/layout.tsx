interface OnboardingLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function OnboardingLayout({ children, params }: OnboardingLayoutProps) {
  const { locale } = await params

  // OnboardingFlow가 자체적으로 모든 레이아웃을 관리하므로 단순히 children만 렌더링
  return <>{children}</>
}