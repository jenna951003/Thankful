'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useTranslation } from '../../hooks/useTranslation'
import { getSavedDisplayName } from '../../utils/device'
import ProfileHeader from './ProfileHeader'
import DashboardContent from './DashboardContent'
import BottomNavigation from './BottomNavigation'
import ProfileModal from './ProfileModal'

interface HomePageProps {
  locale: string
}

export default function HomePage({ locale }: HomePageProps) {
  const { user, profile, loading } = useAuth()
  const { safeArea } = useDeviceDetection()
  const { t } = useTranslation()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [fadeIn, setFadeIn] = useState(false)
  
  // 비로그인 사용자도 홈페이지 사용 가능하도록 처리
  const savedDisplayName = getSavedDisplayName()
  const canShowHomePage = user ? !!profile : !!savedDisplayName

  useEffect(() => {
    // 페이지 로드 애니메이션
    const timer = setTimeout(() => {
      setFadeIn(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

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
      className={`min-h-screen transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
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
}