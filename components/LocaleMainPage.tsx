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
  // 🎯 동기식 로딩 상태 초기화로 1차 깜빡임 완전 제거
  const [isLoginRedirect, setIsLoginRedirect] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.search.includes('login=success') || 
             sessionStorage.getItem('justLoggedIn') === 'true'
    }
    return false
  })
  
  const [isLoginLoading, setIsLoginLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlHasLoginSuccess = window.location.search.includes('login=success')
      const sessionHasJustLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true'
      const isFromLogin = urlHasLoginSuccess || sessionHasJustLoggedIn
      
      console.log('🎯 LOGIN LOADING CHECK:', {
        urlHasLoginSuccess,
        sessionHasJustLoggedIn,
        isFromLogin,
        currentUrl: window.location.href,
        sessionStorage: {
          justLoggedIn: sessionStorage.getItem('justLoggedIn'),
          homePageNoFadeIn: sessionStorage.getItem('homePageNoFadeIn')
        }
      })
      
      if (isFromLogin) {
        console.log('🎯 INSTANT: Login loading activated at render time')
        // sessionStorage 즉시 정리
        sessionStorage.removeItem('justLoggedIn')
        console.log('🎯 justLoggedIn flag removed from sessionStorage')
        return true
      }
    }
    return false
  })
  
  const [isLogoutLoading, setIsLogoutLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const isFromLogout = sessionStorage.getItem('justLoggedOut') === 'true'
      if (isFromLogout) {
        console.log('🎯 INSTANT: Logout loading activated at render time')
        sessionStorage.removeItem('justLoggedOut')
        return true
      }
    }
    return false
  })
  const [onboardingCheckTimeout, setOnboardingCheckTimeout] = useState<NodeJS.Timeout | null>(null)
  const [forceShowHomePage, setForceShowHomePage] = useState(false)
  const [showHomePageWithAnimation, setShowHomePageWithAnimation] = useState(false)

  // 🎯 안전장치: 8초 후 강제로 홈페이지 표시 (새로운 로그인 시퀀스에 맞춰 증가)
  useEffect(() => {
    console.log('🚨 Emergency timeout started - will force show homepage in 8 seconds')
    const emergencyTimer = setTimeout(() => {
      console.log('🚨 Emergency timeout triggered - forcing homepage display')
      setForceShowHomePage(true)
      setIsCheckingOnboarding(false)
      setIsRedirecting(false)
      setIsLoginLoading(false)
      setIsLogoutLoading(false)
    }, 8000)
    
    return () => {
      console.log('🚨 Emergency timeout cleared')
      clearTimeout(emergencyTimer)
    }
  }, [])

  useEffect(() => {
    let loginTimer: NodeJS.Timeout | null = null
    let logoutTimer: NodeJS.Timeout | null = null
    let authCheckInterval: NodeJS.Timeout | null = null
    
    // 🎯 동기식으로 이미 활성화된 로그인 로딩 상태 처리
    if (isLoginLoading) {
      console.log('🔵 Processing already activated login loading state')
      
      // 🎯 실제 로딩 시간 측정 시작
      const loadingStartTime = Date.now()
      console.log('🎯 Login loading measurement started')
      
      // 🎯 AuthContext 상태 변화 모니터링을 위한 체크 함수
      const checkAuthLoading = () => {
        const elapsedTime = Date.now() - loadingStartTime
        console.log(`🎯 Auth loading check: elapsed ${elapsedTime}ms, loading: ${loading}, user: ${!!user}, profile: ${!!profile}`)
        
        // 로딩이 완료되었고 사용자 정보가 있으면 실제 로딩 완료
        if (!loading && (user || profile)) {
          console.log('🎯 Real auth loading completed - calculating final duration')
          const actualLoadingTime = elapsedTime
          const minimumLoadingTime = 2000 // 최소 2초 보장
          const finalLoadingTime = Math.max(actualLoadingTime, minimumLoadingTime)
          
          console.log(`🎯 Loading times: actual=${actualLoadingTime}ms, minimum=${minimumLoadingTime}ms, final=${finalLoadingTime}ms`)
          
          // 남은 시간만큼 추가 대기
          const remainingTime = finalLoadingTime - elapsedTime
          if (remainingTime > 0) {
            console.log(`🎯 Waiting additional ${remainingTime}ms to ensure minimum duration`)
            loginTimer = setTimeout(() => {
              console.log('🔵 Login loading completed - hiding overlay')
              setIsLoginLoading(false)
              setIsLoginRedirect(false)
            }, remainingTime)
          } else {
            console.log('🔵 Login loading completed immediately - hiding overlay')
            setIsLoginLoading(false)
            setIsLoginRedirect(false)
          }
          return true // 완료됨
        }
        return false // 아직 로딩 중
      }
      
      // 🎯 주기적으로 상태 체크 (100ms마다)
      authCheckInterval = setInterval(() => {
        if (checkAuthLoading()) {
          clearInterval(authCheckInterval!)
        }
      }, 100)
      
      // 🎯 안전장치: 5초 후 강제 완료 (실제 로딩이 너무 오래 걸리는 경우)
      loginTimer = setTimeout(() => {
        console.log('🔵 Force completing login loading after 5 seconds')
        if (authCheckInterval) clearInterval(authCheckInterval)
        setIsLoginLoading(false)
        setIsLoginRedirect(false)
      }, 5000)
      
    }
    
    // 🎯 동기식으로 이미 활성화된 로그아웃 로딩 상태 처리
    if (isLogoutLoading) {
      console.log('🔴 Processing already activated logout loading state')
      
      // 강제로 최소 2초 지속
      logoutTimer = setTimeout(() => {
        console.log('🔴 Logout loading completed - hiding overlay')
        setIsLogoutLoading(false)
      }, 2000)
    }
    
    // 🎯 Cleanup 함수 - 모든 타이머와 인터벌 정리
    return () => {
      if (loginTimer) clearTimeout(loginTimer)
      if (logoutTimer) clearTimeout(logoutTimer)
      if (authCheckInterval) clearInterval(authCheckInterval)
      console.log('🔧 Cleaned up all timers and intervals')
    }
  }, [isLoginLoading, isLogoutLoading, loading, user, profile])

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
        
        // 3초 타임아웃 설정 (안전장치) - AuthContext 개선으로 더 빠르게
        const timeout = setTimeout(() => {
          console.log('⚠️ Onboarding check timeout - forcing homepage display')
          setIsCheckingOnboarding(false)
        }, 3000)
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
    
    return <LoadingOverlay 
      isVisible={true} 
      {...loadingProps}
      preRenderNextComponent={isLoginLoading ? () => <HomePage locale={locale} showWithLoginAnimation={true} /> : undefined}
      onAnimationComplete={() => {
        if (isLoginLoading) {
          console.log('🎯 Login overlay fadeout started - preparing HomePage animation')
          // 🎯 페이드아웃이 시작되는 시점에 HomePage 준비 (더 부드러운 전환)
          setTimeout(() => {
            console.log('🎯 Setting HomePage animation flag for smooth transition')
            setShowHomePageWithAnimation(true)
          }, 300) // 페이드아웃 중간 지점에서 HomePage 애니메이션 준비
        }
      }}
    />
  }

  // 온보딩이 완료되었으면 홈페이지 표시 (로그인 여부 상관없이)
  return <HomePage locale={locale} showWithLoginAnimation={showHomePageWithAnimation} />
}