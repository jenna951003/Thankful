'use client'

import { User } from '@supabase/supabase-js'
import { Profile } from '../../utils/supabase/types'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useTranslation } from '../../hooks/useTranslation'

interface ProfileHeaderProps {
  user: User | null
  profile: Profile | null
  displayName?: string | null
  onProfileClick: () => void
}

export default function ProfileHeader({ user, profile, displayName, onProfileClick }: ProfileHeaderProps) {
  const { safeArea } = useDeviceDetection()
  const { t } = useTranslation()

  // 시간대별 인사말
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('home.greeting.morning')
    if (hour < 18) return t('home.greeting.afternoon')
    return t('home.greeting.evening')
  }

  // 프로필 이미지 또는 기본 아바타
  const getAvatarContent = () => {
    if (profile?.avatar_url) {
      return (
        <img 
          src={profile.avatar_url} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      )
    }
    
    // 이름의 첫 글자 또는 기본 이모지
    const userName = profile?.display_name || profile?.full_name || displayName || '익명'
    const firstChar = userName.charAt(0) || '👤'
    return (
      <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
        {firstChar}
      </div>
    )
  }

  return (
    <div 
      className="px-6 pt-4 pb-6"
      style={{ 
        paddingTop: `${safeArea.top + 16}px`
      }}
    >
      {/* 헤더 컨테이너 */}
      <div className="flex items-center justify-between">
        {/* 인사말 및 사용자 이름 */}
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-noto-serif-kr mb-1">
            {getGreeting()}
          </p>
          <h1 className="text-2xl font-bold text-gray-800 font-jua">
            {profile?.display_name || profile?.full_name || displayName || '익명 사용자'}님
          </h1>
        </div>

        {/* 프로필 아바타 */}
        <button
          onClick={onProfileClick}
          className="w-12 h-12 rounded-full overflow-hidden shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ 
            background: 'var(--retro-blue-gradient)',
          }}
        >
          {getAvatarContent()}
        </button>
      </div>

      {/* 구독 상태 표시 (Premium인 경우) */}
      {profile?.subscription_tier !== 'free' && (
        <div className="mt-3 flex justify-start">
          <div 
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ 
              background: profile?.subscription_tier === 'premium' 
                ? 'var(--retro-purple-gradient)' 
                : 'var(--retro-green-gradient)'
            }}
          >
            {profile?.subscription_tier === 'premium' ? '프리미엄' : '교회'}
          </div>
        </div>
      )}
    </div>
  )
}