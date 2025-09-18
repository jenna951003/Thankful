'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Profile } from '../../utils/supabase/types'
import { useAuth } from '../../contexts/AuthProvider'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useTranslation } from '../../hooks/useTranslation'
import LoadingOverlay from '../common/LoadingOverlay'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  profile: Profile | null
  locale: string
}

export default function ProfileModal({ isOpen, onClose, user, profile, locale }: ProfileModalProps) {
  const { signOut } = useAuth()
  const { safeArea } = useDeviceDetection()
  const { t } = useTranslation()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // 애니메이션 시간과 맞춤
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleLogout = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)
    setShowLogoutOverlay(true)

    try {
      // 완전한 로그아웃 처리
      await signOut()
      
      // 모든 로컬 데이터 클리어
      if (typeof window !== 'undefined') {
        // localStorage 완전 클리어
        localStorage.clear()
        
        // sessionStorage 완전 클리어
        sessionStorage.clear()
        
        // 쿠키 클리어 (도메인의 모든 쿠키)
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
        })
      }

      // 온보딩 페이지로 리다이렉션
      setTimeout(() => {
        router.replace(`/${locale}/onboarding/1`)
      }, 1500)
      
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
      setIsSigningOut(false)
      setShowLogoutOverlay(false)
    }
  }

  const getJoinDate = () => {
    if (!user) return '정보 없음'
    const date = new Date(user.created_at)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const menuItems = [
    {
      icon: '🔔',
      label: '알림 설정',
      action: () => console.log('알림 설정'),
      color: 'var(--retro-blue)'
    },
    {
      icon: '🌍',
      label: '언어 설정',
      action: () => console.log('언어 설정'),
      color: 'var(--retro-green)'
    },
    {
      icon: '🎨',
      label: '테마 설정',
      action: () => console.log('테마 설정'),
      color: 'var(--retro-purple)'
    },
    {
      icon: '💎',
      label: '구독 관리',
      action: () => console.log('구독 관리'),
      color: 'var(--retro-pink)'
    },
    {
      icon: '❓',
      label: '도움말',
      action: () => console.log('도움말'),
      color: 'var(--retro-orange)'
    }
  ]

  if (!isOpen) return null

  return (
    <>
      {/* 로그아웃 로딩 오버레이 */}
      <LoadingOverlay 
        isVisible={showLogoutOverlay}
        message="로그아웃 중입니다..."
      />
      
      {/* 모달 백드롭 */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleBackdropClick}
      >
        {/* 모달 컨테이너 */}
        <div
          ref={modalRef}
          className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 ease-out ${
            isVisible ? 'transform translate-y-0' : 'transform translate-y-full'
          }`}
          style={{
            background: 'var(--bg-base)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            paddingBottom: `${safeArea.bottom}px`,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          {/* 드래그 핸들 */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* 프로필 헤더 */}
          <div className="px-6 pb-6">
            <div className="flex items-center space-x-4 mb-6">
              {/* 프로필 이미지 */}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                style={{ background: 'var(--retro-blue-gradient)' }}
              >
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white font-bold text-xl">
                    {profile?.display_name?.charAt(0) || profile?.full_name?.charAt(0) || '👤'}
                  </div>
                )}
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 font-jua">
                  {profile?.display_name || profile?.full_name || '사용자'}
                </h2>
                <p className="text-sm text-gray-600 font-noto-serif-kr">
                  {user?.email || '정보 없음'}
                </p>
                <p className="text-xs text-gray-500 font-noto-serif-kr">
                  {getJoinDate()} 가입
                </p>
              </div>

              {/* 구독 배지 */}
              {profile?.subscription_tier !== 'free' && (
                <div 
                  className="px-2 py-1 rounded-full text-xs font-bold text-white"
                  style={{ 
                    background: profile?.subscription_tier === 'premium' 
                      ? 'var(--retro-purple-gradient)' 
                      : 'var(--retro-green-gradient)'
                  }}
                >
                  {profile?.subscription_tier === 'premium' ? 'Premium' : 'Church'}
                </div>
              )}
            </div>

            {/* 메뉴 항목들 */}
            <div className="space-y-2 mb-6">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ 
                      background: `${item.color}20`,
                      border: `2px solid ${item.color}40`
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left font-medium text-gray-800 font-noto-serif-kr">
                    {item.label}
                  </span>
                  <div className="text-gray-400">
                    →
                  </div>
                </button>
              ))}
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              disabled={isSigningOut}
              className="w-full flex items-center justify-center space-x-2 p-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
              style={{ 
                background: 'var(--retro-orange-gradient)',
                color: 'white'
              }}
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium font-noto-serif-kr">
                {isSigningOut ? '로그아웃 중...' : '로그아웃'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}