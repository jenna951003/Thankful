'use client'

import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthProvider'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useTranslation } from '../../hooks/useTranslation'
import { getSavedDisplayName } from '../../utils/device'
import { resetOnboarding, isOnboardingCompleted, hasOnboardingData } from '../../utils/onboarding'
import { useTranslationContext } from '../../contexts/TranslationContext'
import LoadingOverlay from '../common/LoadingOverlay'
import ProfileHeader from './ProfileHeader'
import DashboardContent from './DashboardContent'
import CustomNavBar from '../CustomNavBar'
import ProfileModal from './ProfileModal'
import SafeAreaVisualizer from '../common/SafeAreaVisualizer'
import TopSafeAreaOverlay from '../common/TopSafeAreaOverlay'
import BottomSafeAreaOverlay from '../common/BottomSafeAreaOverlay'
import TimeBasedImageBar from './TimeBasedImageBar'
import { debugLogger } from '../../utils/debugLogger'

interface HomePageProps {
  locale: string
  showWithLoginAnimation?: boolean // 🎯 로그인 완료 후 애니메이션 플래그
}

function HomePage({ locale, showWithLoginAnimation = false }: HomePageProps) {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()

  // 디버그 로그는 중요한 상태 변화에만 출력
  const renderCountRef = useRef(0)
  renderCountRef.current++

  // 사용자 정보에서 displayName 추출 (useMemo로 메모이제이션)
  const getUserDisplayName = useMemo(() => {
    if (user?.user_metadata?.display_name) return user.user_metadata.display_name
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.email) {
      // 이메일에서 @ 앞부분을 이름으로 사용
      const emailName = user.email.split('@')[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    return null
  }, [user?.user_metadata?.display_name, user?.user_metadata?.full_name, user?.email])

  const checkOnboardingStatus = useCallback(() => true, []) // 임시로 항상 완료된 것으로 처리
  const { safeArea } = useDeviceDetection()
  const { t } = useTranslation()
  const { t: tContext } = useTranslationContext()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  // 단순화된 애니메이션 상태
  const [showContent, setShowContent] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // 로그인 후 애니메이션 감지 (한 번만 실행되도록 최적화)
  const [isFromLogin, setIsFromLogin] = useState(() => {
    if (typeof window !== 'undefined') {
      const fromLogin = sessionStorage.getItem('justLoggedIn') === 'true'
      if (fromLogin) {
        sessionStorage.removeItem('justLoggedIn')
        return true
      }
    }
    return false
  })

  // 애니메이션 딜레이 값 메모이제이션
  const animationDelay = useMemo(() => (isFromLogin ? 800 : 300), [isFromLogin])

  // 로딩 및 애니메이션 처리 (의존성 최적화)
  useEffect(() => {
    if (!loading && !isInitialLoading) {
      // AuthProvider 로딩 완료 후 애니메이션 시작
      const timer = setTimeout(() => {
        setShowContent(true)
      }, animationDelay)

      return () => clearTimeout(timer)
    } else if (!loading && isInitialLoading) {
      // AuthProvider 로딩이 완료되면 초기 로딩 상태 해제
      setIsInitialLoading(false)
    } else if (isInitialLoading) {
      // 최대 1초 후 강제로 로딩 완료 처리
      const timeout = setTimeout(() => {
        debugLogger.log('⏰ 로딩 타임아웃 - 강제로 화면 표시')
        setIsInitialLoading(false)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [loading, isInitialLoading, animationDelay])


  // 비로그인 사용자도 홈페이지 사용 가능하도록 처리
  const [savedDisplayName, setSavedDisplayName] = useState<string | null>(null)

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const displayName = getSavedDisplayName()
    setSavedDisplayName(displayName)
  }, [])

  // 최종 displayName 계산 (useMemo로 안정화)
  const finalDisplayName = useMemo(() => {
    const userDisplayName = getUserDisplayName
    return userDisplayName || savedDisplayName
  }, [getUserDisplayName, savedDisplayName])

  // 온보딩 체크 (단순화)
  useEffect(() => {
    if (loading) return // AuthProvider 로딩 중이면 대기

    if (user) {
      // 로그인된 사용자는 홈페이지 표시
      debugLogger.log('로그인된 사용자 - 홈페이지 표시')
      return
    }

    // 로그인하지 않은 경우 온보딩 체크
    const localOnboardingCompleted = isOnboardingCompleted()
    if (!localOnboardingCompleted) {
      debugLogger.log('온보딩 미완료 - 온보딩으로 이동')
      router.replace(`/${locale}/onboarding`)
    }
  }, [user, loading, locale, router])

  // 홈페이지 표시 조건
  const canShowHomePage = user || finalDisplayName || isOnboardingCompleted()

  // 온보딩 초기화 함수 (useCallback으로 메모이제이션)
  const handleResetOnboarding = useCallback(() => {
    if (confirm('온보딩을 초기화하고 처음부터 다시 진행하시겠습니까?')) {
      resetOnboarding()
      router.push(`/${locale}/onboarding`)
    }
  }, [locale, router])

  // 프로필 모달 열기 함수 (useCallback으로 메모이제이션)
  const handleProfileClick = useCallback(() => {
    setIsProfileModalOpen(true)
  }, [])

  // 첫 렌더링에만 로그 출력 (모든 Hook을 조건부 렌더링 전에 배치)
  useEffect(() => {
    if (renderCountRef.current === 1) {
      debugLogger.log('홈페이지 메인 렌더링')
    }
  }, [])

  // 로그인 후 로딩 화면 표시
  if (isFromLogin && (loading || isInitialLoading)) {
    return (
      <LoadingOverlay
        isVisible={true}
        imageType="login"
        message="로그인 중입니다..."
        minDuration={1500}
        onAnimationComplete={() => {
          setIsFromLogin(false)
        }}
      />
    )
  }

  // AuthProvider 로딩 중일 때 로딩 화면
  if (loading || isInitialLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'var(--bg-base)'
        }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-noto-serif-kr">로딩 중입니다...</p>
        </div>
      </div>
    )
  }

  if (!canShowHomePage) {
    debugLogger.log('🔴 HomePage: Cannot show homepage... early return', {
      canShowHomePage,
      user: !!user,
      finalDisplayName,
      savedDisplayName
    })
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
    <>
      {/* 세이프존 시각화 (개발 환경에서만) - 애니메이션 영향을 받지 않도록 독립 배치 */}
      <SafeAreaVisualizer />

      <div
        className={`min-h-screen transition-opacity duration-800 ease-out ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'var(--bg-base)',
          paddingBottom: '80px'
        }}
      >
        {/* 상단 세이프존 가림막 - 스크롤 시 페이드 */}
        <TopSafeAreaOverlay />

        {/* Time-based Image Bar */}
        {/* <TimeBasedImageBar className="pb-4" /> */}

        {/* 프로필 헤더 */}
        <div className={`transition-all duration-600 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: showContent ? '200ms' : '0ms' }}>
          <ProfileHeader
            user={user}
            profile={profile}
            displayName={finalDisplayName}
            onProfileClick={handleProfileClick}
            locale={locale}
            isLoading={loading}
          />
        </div>

        {/* 대시보드 콘텐츠 */}
        <div className={`transition-all duration-600 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: showContent ? '400ms' : '0ms' }}>
          <DashboardContent
            activeTab={activeTab}
            user={user}
            profile={profile}
            displayName={finalDisplayName}
          />
        </div>

        {/* 프로필 모달 */}
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          profile={profile}
          locale={locale}
        />

        {/* 하단 네비게이션 */}
        <div className={`transition-all duration-600 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: showContent ? '600ms' : '0ms' }}>
          <CustomNavBar
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab !== 'home') {
                if (tab === 'community') {
                  router.push(`/${locale}/community`);
                } else if (tab === 'saved') {
                  router.push(`/${locale}/saved`);
                } else if (tab === 'settings') {
                  router.push(`/${locale}/settings`);
                } else if (tab === 'write') {
                  debugLogger.log('Write tab selected');
                }
              } else {
                setActiveTab(tab);
              }
            }}
            showWithAnimation={true}
          />
        </div>

        {/* 하단 세이프존 가림막 */}
        <BottomSafeAreaOverlay />

      </div>
    </>
  )
}

export default memo(HomePage, (prevProps, nextProps) => {
  return prevProps.locale === nextProps.locale &&
         prevProps.showWithLoginAnimation === nextProps.showWithLoginAnimation
})