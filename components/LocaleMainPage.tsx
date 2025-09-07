'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { isOnboardingCompleted, hasOnboardingData } from '../utils/onboarding'
import HomePage from './home/HomePage'
import LoadingOverlay from './common/LoadingOverlay'
import { useTranslationContext } from '../contexts/TranslationContext'

interface LocaleMainPageProps {
  locale: string
}

export default function LocaleMainPage({ locale }: LocaleMainPageProps) {
  const router = useRouter()
  const { user, profile, loading, checkOnboardingStatus } = useAuth()
  const { t } = useTranslationContext()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false)
  const [isLoginRedirect, setIsLoginRedirect] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)
  const [onboardingCheckTimeout, setOnboardingCheckTimeout] = useState<NodeJS.Timeout | null>(null)
  const [forceShowHomePage, setForceShowHomePage] = useState(false)

  // 최종 안전장치: 3초 후 강제로 홈페이지 표시
  useEffect(() => {
    console.log('🚨 Emergency timeout started - will force show homepage in 3 seconds')
    const emergencyTimer = setTimeout(() => {
      console.log('🚨 Emergency timeout triggered - forcing homepage display')
      setForceShowHomePage(true)
    }, 3000)
    
    return () => {
      console.log('🚨 Emergency timeout cleared')
      clearTimeout(emergencyTimer)
    }
  }, [])

  useEffect(() => {
    let loginTimer: NodeJS.Timeout | null = null
    let logoutTimer: NodeJS.Timeout | null = null
    
    // 로그인 후 리다이렉트인지 감지 (URL 체크)
    const isFromLogin = window.location.search.includes('login=success') || 
                       sessionStorage.getItem('justLoggedIn') === 'true'
    
    if (isFromLogin) {
      setIsLoginRedirect(true)
      setIsLoginLoading(true)
      sessionStorage.removeItem('justLoggedIn') // 한 번만 사용
      
      // 강제로 최소 2초 지속
      loginTimer = setTimeout(() => {
        setIsLoginLoading(false)
        setIsLoginRedirect(false)
      }, 2000)
    }
    
    // 로그아웃 감지
    const isFromLogout = sessionStorage.getItem('justLoggedOut') === 'true'
    
    if (isFromLogout) {
      setIsLogoutLoading(true)
      sessionStorage.removeItem('justLoggedOut') // 한 번만 사용
      
      // 강제로 최소 2초 지속
      logoutTimer = setTimeout(() => {
        setIsLogoutLoading(false)
      }, 2000)
    }
    
    // Cleanup 함수
    return () => {
      if (loginTimer) clearTimeout(loginTimer)
      if (logoutTimer) clearTimeout(logoutTimer)
    }
  }, [])

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
      
      // AuthContext loading이 완료되기 전에도 로컬스토리지 기반으로 빠른 결정
      if (!user && !loading) {
        // 로컬스토리지에 온보딩이 완료되어 있으면 홈페이지 표시
        if (localOnboardingCompleted) {
          console.log('✅ Not logged in but onboarding completed - showing homepage')
          return // isCheckingOnboarding이 이미 false이므로 HomePage 표시
        }
        // 온보딩이 완료되지 않았으면 온보딩으로 리다이렉트
        console.log('➡️ Redirecting to onboarding (not logged in)')
        setIsRedirecting(true)
        router.replace(`/${locale}/onboarding/1`)
        return
      }
      
      // 로그인한 상태에서만 체크 상태 활성화
      if (!loading && user && profile) {
        console.log('🔍 Starting onboarding check for logged in user:', user.email)
        setIsCheckingOnboarding(true)
        
        // 5초 타임아웃 설정 (안전장치)
        const timeout = setTimeout(() => {
          console.log('⚠️ Onboarding check timeout - forcing homepage display')
          setIsCheckingOnboarding(false)
        }, 5000)
        setOnboardingCheckTimeout(timeout)
        
        // DB에서 온보딩 완료 여부 확인
        const isOnboardingComplete = checkOnboardingStatus()
        console.log('📋 Onboarding status from DB:', isOnboardingComplete)
        
        if (isOnboardingComplete) {
          console.log('✅ Logged in and onboarding completed - showing homepage')
          clearTimeout(timeout)
          setOnboardingCheckTimeout(null)
          setIsCheckingOnboarding(false)
          return
        }
        
        // 온보딩이 완료되지 않았으면 온보딩으로 리다이렉트
        console.log('➡️ Redirecting to onboarding step 2 (logged in)')
        clearTimeout(timeout)
        setOnboardingCheckTimeout(null)
        setIsCheckingOnboarding(false)
        setIsRedirecting(true)
        router.replace(`/${locale}/onboarding/2`)
        return
      }
    }

    checkOnboarding()
    
    // Cleanup 함수 - 온보딩 체크 타임아웃도 정리
    return () => {
      if (onboardingCheckTimeout) {
        clearTimeout(onboardingCheckTimeout)
        setOnboardingCheckTimeout(null)
      }
    }
  }, [user, profile, loading, checkOnboardingStatus, router, locale])

  // 디버깅: 현재 로딩 상태들 출력
  console.log('🔍 Current loading states:', {
    loading,
    isRedirecting,
    isCheckingOnboarding,
    isLoginLoading,
    isLogoutLoading,
    forceShowHomePage,
    user: !!user,
    profile: !!profile
  })

  // 강제 홈페이지 표시가 활성화되면 모든 로딩 무시
  if (forceShowHomePage) {
    console.log('🚨 Force showing homepage - bypassing all loading states')
    return <HomePage locale={locale} />
  }

  // 로딩 중이거나 리다이렉트 중일 때 (로그인/로그아웃 전용 로딩 포함)
  if (loading || isRedirecting || isCheckingOnboarding || isLoginLoading || isLogoutLoading) {
    let loadingProps
    
    if (isLoginLoading) {
      loadingProps = {
        imageType: 'login' as const,
        message: t('loading.signingIn') || '로그인 중입니다...',
        minDuration: 2000
      }
    } else if (isLogoutLoading) {
      loadingProps = {
        imageType: 'logout' as const,
        message: t('loading.signingOut') || '로그아웃 중입니다...',
        minDuration: 2000
      }
    } else if (isLoginRedirect) {
      loadingProps = {
        imageType: 'login' as const,
        message: t('loading.signingIn'),
        minDuration: 2000
      }
    } else {
      loadingProps = {
        message: t('loading.pleaseWait') || '잠시만 기다려주세요...'
      }
    }
    
    return <LoadingOverlay isVisible={true} {...loadingProps} />
  }

  // 온보딩이 완료되었으면 홈페이지 표시 (로그인 여부 상관없이)
  return <HomePage locale={locale} />
}