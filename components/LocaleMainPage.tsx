'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { isOnboardingCompleted } from '../utils/onboarding'
import HomePage from './home/HomePage'
import LoadingOverlay from './common/LoadingOverlay'

interface LocaleMainPageProps {
  locale: string
}

export default function LocaleMainPage({ locale }: LocaleMainPageProps) {
  const router = useRouter()
  const { user, profile, loading, checkOnboardingStatus } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // 사용자가 로그인되어 있지 않으면 온보딩으로 리다이렉트
    if (!loading && !user) {
      setIsRedirecting(true)
      router.replace(`/${locale}/onboarding/1`)
      return
    }

    // 사용자는 있지만 온보딩이 완료되지 않았으면 온보딩으로 리다이렉트
    if (!loading && user && profile && !checkOnboardingStatus()) {
      setIsRedirecting(true)
      router.replace(`/${locale}/onboarding/2`)
      return
    }
  }, [user, profile, loading, checkOnboardingStatus, router, locale])

  // 로딩 중이거나 리다이렉트 중일 때
  if (loading || isRedirecting || !user || !profile) {
    return <LoadingOverlay isVisible={true} message="잠시만 기다려주세요..." />
  }

  // 온보딩이 완료된 사용자는 홈페이지 표시
  return <HomePage locale={locale} />
}