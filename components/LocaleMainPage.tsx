'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { isOnboardingCompleted, hasOnboardingData } from '../utils/onboarding'
import HomePage from './home/HomePage'
import LoadingOverlay from './common/LoadingOverlay'

interface LocaleMainPageProps {
  locale: string
}

export default function LocaleMainPage({ locale }: LocaleMainPageProps) {
  const router = useRouter()
  const { user, profile, loading, checkOnboardingStatus } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)

  useEffect(() => {
    // 온보딩 상태 확인
    const checkOnboarding = () => {
      // 로컬스토리지에서 온보딩 완료 여부 확인
      const localOnboardingCompleted = isOnboardingCompleted()
      const hasLocalData = hasOnboardingData()
      
      console.log('📊 Onboarding status check:', { 
        localOnboardingCompleted, 
        hasLocalData,
        user: !!user,
        profile: !!profile,
        dbOnboardingCompleted: profile?.onboarding_completed
      })
      
      // 1. 로그인하지 않은 상태
      if (!loading && !user) {
        // 로컬스토리지에 온보딩이 완료되어 있으면 홈페이지 표시
        if (localOnboardingCompleted) {
          console.log('✅ Not logged in but onboarding completed - showing homepage')
          setIsCheckingOnboarding(false)
          return
        }
        // 온보딩이 완료되지 않았으면 온보딩으로 리다이렉트
        console.log('➡️ Redirecting to onboarding (not logged in)')
        setIsRedirecting(true)
        router.replace(`/${locale}/onboarding/1`)
        return
      }
      
      // 2. 로그인한 상태
      if (!loading && user && profile) {
        // DB에서 온보딩 완료 여부 확인
        if (checkOnboardingStatus()) {
          console.log('✅ Logged in and onboarding completed - showing homepage')
          setIsCheckingOnboarding(false)
          return
        }
        // 온보딩이 완료되지 않았으면 온보딩으로 리다이렉트
        console.log('➡️ Redirecting to onboarding step 2 (logged in)')
        setIsRedirecting(true)
        router.replace(`/${locale}/onboarding/2`)
        return
      }
      
      // 로딩이 끝났는데도 결정할 수 없으면 기본적으로 표시
      if (!loading) {
        setIsCheckingOnboarding(false)
      }
    }

    checkOnboarding()
  }, [user, profile, loading, checkOnboardingStatus, router, locale])

  // 로딩 중이거나 리다이렉트 중일 때
  if (loading || isRedirecting || isCheckingOnboarding) {
    return <LoadingOverlay isVisible={true} message="잠시만 기다려주세요..." />
  }

  // 온보딩이 완료되었으면 홈페이지 표시 (로그인 여부 상관없이)
  return <HomePage locale={locale} />
}