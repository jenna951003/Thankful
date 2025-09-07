'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useTranslation } from '../../hooks/useTranslation'
import { getSavedDisplayName } from '../../utils/device'
import { resetOnboarding } from '../../utils/onboarding'
import { useTranslationContext } from '../../contexts/TranslationContext'
import ProfileHeader from './ProfileHeader'
import DashboardContent from './DashboardContent'
import BottomNavigation from './BottomNavigation'
import ProfileModal from './ProfileModal'
import LoadingOverlay from '../common/LoadingOverlay'

interface HomePageProps {
  locale: string
}

export default function HomePage({ locale }: HomePageProps) {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const { safeArea } = useDeviceDetection()
  const { t } = useTranslation()
  const { t: tContext } = useTranslationContext()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [fadeIn, setFadeIn] = useState(true)
  const [isTestingLoading, setIsTestingLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("테스트 중입니다...")
  
  // 비로그인 사용자도 홈페이지 사용 가능하도록 처리
  const savedDisplayName = getSavedDisplayName()
  const canShowHomePage = user ? !!profile : !!savedDisplayName

  // 로딩 오버레이 테스트 함수
  const handleTestLoading = () => {
    const messages = [
      "테스트 중입니다...",
      "잠시만 기다려주세요...",
      "로딩 애니메이션 확인 중...",
      "UI 테스트 진행 중..."
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    setLoadingMessage(randomMessage)
    setIsTestingLoading(true)
    setTimeout(() => {
      setIsTestingLoading(false)
    }, 3000)
  }

  // 온보딩 초기화 함수
  const handleResetOnboarding = () => {
    if (confirm('온보딩을 초기화하고 처음부터 다시 진행하시겠습니까?')) {
      setLoadingMessage("초기화 중...")
      setIsTestingLoading(true)
      
      // 약간의 딜레이 후 초기화
      setTimeout(() => {
        resetOnboarding()
        setIsTestingLoading(false)
        router.push(`/${locale}/onboarding/1`)
      }, 1500)
    }
  }

  // 로그인 테스트 함수
  const handleTestLogin = () => {
    if (confirm('로그인 로딩 테스트를 진행하시겠습니까?')) {
      // 로그인 플래그 설정 
      sessionStorage.setItem('justLoggedIn', 'true')
      
      // 페이지 새로고침으로 로그인 로딩 테스트
      window.location.reload()
    }
  }

  // 로그아웃 테스트 함수
  const handleTestLogout = async () => {
    if (confirm('로그아웃 테스트를 진행하시겠습니까?')) {
      // 로그아웃 플래그 설정 (LocaleMainPage에서 감지하여 로딩 오버레이 표시)
      sessionStorage.setItem('justLoggedOut', 'true')
      
      await signOut()
      
      // 로그아웃 후 온보딩으로 이동 (LocaleMainPage의 로딩이 끝난 후)
      setTimeout(() => {
        router.push(`/${locale}/onboarding/1`)
      }, 2500) // 로딩 오버레이 시간보다 조금 더 길게 설정
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
      className={`min-h-screen transition-opacity duration-200 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
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
            onClick={handleTestLoading}
            className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-red-600 transition-colors"
            style={{ fontSize: '10px' }}
          >
            로딩 테스트
          </button>
          <button
            onClick={handleResetOnboarding}
            className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-orange-600 transition-colors"
            style={{ fontSize: '10px' }}
          >
            온보딩 초기화
          </button>
          <button
            onClick={handleTestLogin}
            className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-blue-600 transition-colors"
            style={{ fontSize: '10px' }}
          >
            로그인 테스트
          </button>
          <button
            onClick={handleTestLogout}
            className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-purple-600 transition-colors"
            style={{ fontSize: '10px' }}
          >
            로그아웃 테스트
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

      {/* 로딩 오버레이 테스트 */}
      <LoadingOverlay 
        isVisible={isTestingLoading} 
        message={loadingMessage}
        imageType={
          loadingMessage === tContext('loading.signingOut') ? 'logout' : 'default'
        }
        minDuration={2000}
      />
    </div>
  )
}