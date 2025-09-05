'use client'

import { use } from 'react'
import OnboardingFlow from '../../../components/onboarding/OnboardingFlow'

interface OnboardingPageProps {
  params: Promise<{
    locale: string
  }>
}

export default function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = use(params)
  
  return <OnboardingFlow locale={locale} />
}