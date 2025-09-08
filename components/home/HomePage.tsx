'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useTranslation } from '../../hooks/useTranslation'
import { getSavedDisplayName } from '../../utils/device'
import { resetOnboarding, isOnboardingCompleted, hasOnboardingData } from '../../utils/onboarding'
import { useTranslationContext } from '../../contexts/TranslationContext'
import LoadingOverlay from '../common/LoadingOverlay'
import ProfileHeader from './ProfileHeader'
import DashboardContent from './DashboardContent'
import BottomNavigation from './BottomNavigation'
import ProfileModal from './ProfileModal'

interface HomePageProps {
  locale: string
  showWithLoginAnimation?: boolean // 🎯 로그인 완료 후 애니메이션 플래그
}

const HomePage = memo(function HomePage({ locale, showWithLoginAnimation = false }: HomePageProps) {
  const router = useRouter()
  const { user, profile, loading, signOut, checkOnboardingStatus } = useAuth()
  const { safeArea } = useDeviceDetection()
  const { t } = useTranslation()
  const { t: tContext } = useTranslationContext()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  
  // 🎯 로그인 후 애니메이션 및 로딩 상태들 (단순화됨)
  const [isLoginLoading, setIsLoginLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const isFromLogin = sessionStorage.getItem('justLoggedIn') === 'true'
      if (isFromLogin) {
        console.log('🎯 Login animation detected - starting loading overlay')
        sessionStorage.removeItem('justLoggedIn')
        return true
      }
    }
    return false
  })
  const [isLoginFadingOut, setIsLoginFadingOut] = useState(false)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false)
  const [shouldShowWithAnimation, setShouldShowWithAnimation] = useState(showWithLoginAnimation || isLoginLoading)
  
  // 🔧 StrictMode 안전한 애니메이션 시스템 (ref 기반으로 완전 변경)
  const animationExecutedRef = useRef(false)
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialRenderRef = useRef(true)
  
  // 🔧 StrictMode에서 안전한 초기값 설정 (함수형 초기값 제거)
  const [isAnimating, setIsAnimating] = useState(showWithLoginAnimation)
  
  // 🔧 깜빡임 완전 방지를 위한 opacity 제어 (ref로 한 번만 결정)
  const getInitialOpacity = () => {
    if (showWithLoginAnimation) {
      if (initialRenderRef.current) {
        console.log('🎯 HomePage: Initial render with login animation (opacity-0)')
        initialRenderRef.current = false
      }
      return 'opacity-0'
    }
    if (initialRenderRef.current) {
      console.log('🎯 HomePage: Initial render without animation (opacity-100)')
      initialRenderRef.current = false
    }
    return 'opacity-100'
  }
  
  const [fadeInClass, setFadeInClass] = useState(getInitialOpacity)

  // 🎯 완전한 단일 실행 애니메이션 (깜빡임 방지)
  useEffect(() => {
    // 🔧 절대적 단일 실행 조건 - 모든 중복을 차단 (더 강화됨)
    if (!shouldShowWithAnimation || !isAnimating || animationExecutedRef.current) {
      if (animationExecutedRef.current) {
        console.log('🎯 HomePage: Animation already executed, BLOCKED duplicate (flicker-free)')
      } else if (!shouldShowWithAnimation) {
        console.log('🎯 HomePage: No login animation required, SKIPPING (flicker-free)')
      } else if (!isAnimating) {
        console.log('🎯 HomePage: Animation not active, WAITING (flicker-free)')
      }
      return
    }
    
    console.log('🎯 HomePage: Starting SINGLE animation execution (flicker-free)')
    animationExecutedRef.current = true // 🔧 즉시 플래그로 모든 중복 차단
    
    console.log('🎯 HomePage: Animation guard set - NO MORE EXECUTIONS ALLOWED (flicker-free)')
    
    // 이전 타이머 안전 정리
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
      animationTimerRef.current = null
    }
    
    // 🎯 완벽한 단일 애니메이션 실행 (깜빡임 완전 방지)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        console.log('🎯 HomePage: Executing smooth fade-in (single render, flicker-free)')
        setFadeInClass('opacity-100 transition-opacity duration-800 ease-out')
        
        // 🎯 애니메이션 완료 - setTimeout 제거로 자연 완료 (깜빡임 완전 방지)
        animationTimerRef.current = setTimeout(() => {
          console.log('🎯 HomePage: Animation completed naturally - no state changes (flicker-free)')
          // setIsAnimating(false) 제거 - 상태 변경으로 인한 리렌더링 방지
        }, 800)
      })
    })
    
    // Cleanup 함수 - StrictMode에서 안전한 정리
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
        animationTimerRef.current = null
      }
    }
  }, [shouldShowWithAnimation, isAnimating]) // 의존성 최소화
  
  // 비로그인 사용자도 홈페이지 사용 가능하도록 처리
  const [savedDisplayName, setSavedDisplayName] = useState<string | null>(null)
  
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const displayName = getSavedDisplayName()
    setSavedDisplayName(displayName)
  }, [])
  
  // 🎯 로그인 로딩 처리 (단순화된 로직)
  useEffect(() => {
    if (isLoginLoading && !loading && (user || profile)) {
      console.log('🎯 Login completed - starting fadeout in 2 seconds')
      
      setTimeout(() => {
        console.log('🎯 Login fadeout started')
        setIsLoginLoading(false)
        setIsLoginFadingOut(true)
      }, 2000)
    }
  }, [isLoginLoading, loading, user, profile])
  
  // 🎯 온보딩 체크 로직 (단순화됨)
  useEffect(() => {
    if (!loading && !isLoginLoading && !isLoginFadingOut) {
      // 로그인하지 않은 경우 로컬 온보딩 체크
      if (!user) {
        const localOnboardingCompleted = isOnboardingCompleted()
        if (!localOnboardingCompleted) {
          console.log('🎯 Not logged in and no onboarding - redirecting to onboarding')
          router.replace(`/${locale}/onboarding/1`)
          return
        }
      }
      
      // 로그인한 경우 DB 온보딩 체크
      if (user && profile) {
        const isComplete = checkOnboardingStatus()
        if (!isComplete) {
          console.log('🎯 Logged in but onboarding incomplete - redirecting to onboarding/2')
          router.replace(`/${locale}/onboarding/2`)
          return
        }
      }
    }
  }, [loading, user, profile, isLoginLoading, isLoginFadingOut, checkOnboardingStatus, router, locale])
  
  const canShowHomePage = user ? !!profile : !!savedDisplayName

  // 온보딩 초기화 함수
  const handleResetOnboarding = () => {
    if (confirm('온보딩을 초기화하고 처음부터 다시 진행하시겠습니까?')) {
      resetOnboarding()
      router.push(`/${locale}/onboarding/1`)
    }
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: 'var(--bg-base)',
          paddingTop: `${safeArea.top}px`,
          paddingBottom: `${safeArea.bottom}px`
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">🙏</div>
          <p className="text-gray-600 font-noto-serif-kr">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 진짜 오류 상황에만 오류 메시지 표시
  // 🎯 로딩 오버레이 표시 조건
  if (loading || isLoginLoading || isCheckingOnboarding) {
    return (
      <LoadingOverlay
        isVisible={!isLoginFadingOut}
        imageType={isLoginLoading ? 'login' : 'default'}
        message={isLoginLoading ? '로그인 중입니다...' : '잠시만 기다려주세요...'}
        minDuration={2000}
        onAnimationComplete={() => {
          if (isLoginFadingOut) {
            console.log('🎯 Login animation complete - showing HomePage with animation')
            setIsLoginFadingOut(false)
            setShouldShowWithAnimation(true)
          }
        }}
      />
    )
  }

  if (!canShowHomePage) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: 'var(--bg-base)',
          paddingTop: `${safeArea.top}px`,
          paddingBottom: `${safeArea.bottom}px`
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <p className="text-gray-600 font-noto-serif-kr">사용자 정보를 불러올 수 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2 font-noto-serif-kr">온보딩을 다시 진행해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`min-h-screen ${fadeInClass}`}
      style={{ 
        background: 'var(--bg-base)',
        paddingBottom: '80px' // 하단 네비게이션을 위한 여백
      }}
    >
      {/* 프로필 헤더 */}
      <ProfileHeader 
        user={user}
        profile={profile}
        displayName={savedDisplayName}
        onProfileClick={() => setIsProfileModalOpen(true)}
      />

      {/* 개발자 테스트 버튼들 (개발 환경에서만 표시) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-14 z-50 flex flex-col gap-2">
          <button
            onClick={handleResetOnboarding}
            className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-orange-600 transition-colors"
            style={{ fontSize: '10px' }}
          >
            온보딩 초기화
          </button>
        </div>
      )}

      {/* 대시보드 콘텐츠 */}
      <DashboardContent 
        activeTab={activeTab}
        user={user}
        profile={profile}
        displayName={savedDisplayName}
      />

      {/* 하단 네비게이션 */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 프로필 모달 */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        profile={profile}
        locale={locale}
      />

    </div>
  )
})

export default HomePage