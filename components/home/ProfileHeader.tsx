'use client'

import { User } from '@supabase/supabase-js'
import { Profile } from '../../utils/supabase/types'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useTranslation } from '../../hooks/useTranslation'
import { useMemo, useCallback, memo } from 'react'
import { debugLogger } from '../../utils/debugLogger'

interface ProfileHeaderProps {
  user: User | null
  profile: Profile | null
  displayName?: string | null
  onProfileClick: () => void
  locale: string
  isLoading?: boolean
}

const ProfileHeader = memo(function ProfileHeader({ user, profile, displayName, onProfileClick, locale, isLoading = false }: ProfileHeaderProps) {
  const { safeArea } = useDeviceDetection()
  const { t } = useTranslation()

  // 닉네임 언어 감지 함수
  const detectNameLanguage = (name: string): 'korean' | 'english' => {
    if (!name) return 'korean'

    // 한글 문자 확인 (한글 유니코드 범위: 가-힣, ㄱ-ㅎ, ㅏ-ㅣ)
    const koreanRegex = /[가-힣ㄱ-ㅎㅏ-ㅣ]/
    return koreanRegex.test(name) ? 'korean' : 'english'
  }

  // 로케일별 폰트 매핑 함수
  const getLocaleFont = (textType: 'greeting' | 'name', targetLanguage?: 'korean' | 'english') => {
    const language = targetLanguage || (locale === 'ko' ? 'korean' : 'english')

    if (textType === 'greeting') {
      // 인사말은 로케일에 따라
      switch (locale) {
        case 'ko':
          return 'font-dongle'
        case 'en':
          return 'font-fascinate'
        case 'es':
        case 'pt':
          return 'font-hubballi'
        default:
          return 'font-noto-serif-kr'
      }
    } else {
      // 닉네임은 감지된 언어에 따라
      return language === 'korean' ? 'font-jua' : 'font-sofadi-one'
    }
  }

  // 로케일별 호칭 및 폰트 반환 함수
  const getHonorific = () => {
    switch (locale) {
      case 'ko':
        return { text: '님', font: 'font-jua' }
      case 'en':
        return { text: '', font: '' }
      case 'es':
        return { text: '', font: 'font-hubballi' } // 필요시 Sr./Sra. 추가 가능
      case 'pt':
        return { text: '', font: 'font-hubballi' } // 필요시 Sr./Sra. 추가 가능
      default:
        return { text: '님', font: 'font-jua' }
    }
  }

  // 시간대별 인사말 (TimeBasedImageBar와 동일한 5단계)
  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 6) {
      return t('home.greeting.dawn') // 새벽의 평안
    }
    if (hour < 12) {
      return t('home.greeting.morning') // 은혜로운 아침
    }
    if (hour < 18) {
      return t('home.greeting.afternoon') // 평안한 오후
    }
    if (hour < 22) {
      return t('home.greeting.evening') // 감사한 저녁
    }
    return t('home.greeting.night') // 조용한 밤
  }

  // 프로필 이미지 또는 기본 아바타 (useMemo로 메모이제이션)
  const avatarContent = useMemo(() => {
    if (profile?.avatar_url && profile.avatar_url.trim() !== '') {
      return (
        <img
          src={profile.avatar_url}
          alt="Profile"
          className="w-full h-full object-cover select-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          onError={(e) => {
            debugLogger.error('❌ 프로필 이미지 로드 실패:', profile.avatar_url)
          }}
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
  }, [profile, displayName]) // profile 객체 전체와 displayName으로 의존성 단순화

  // 로딩 스켈레톤 UI
  if (isLoading) {
    return (
      <div
        className="px-4 pt-2 pb-6"
        style={{
          paddingTop: `${safeArea.top + 8}px`
        }}
      >
        <div className="flex items-start justify-between mt-2">
          {/* 왼쪽: 프로필 + 인사말 로딩 */}
          <div className="flex items-start flex-grow">
            {/* 프로필 아바타 로딩 */}
            <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>

            {/* 인사말 로딩 */}
            <div className="ml-4 flex-grow mr-4 mt-0.5">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 알림 아이콘 로딩 */}
          <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="px-4 pt-2 pb-6"
      style={{
        paddingTop: `${safeArea.top + 8}px`
      }}
    >
      {/* 헤더 컨테이너 */}
      <div className="flex items-start justify-between mt-2">
        {/* 왼쪽: 프로필 + 인사말 */}
        <div className="flex items-start flex-grow">
          {/* 프로필 아바타 */}
          <button
            onClick={onProfileClick}
            onContextMenu={(e) => e.preventDefault()}
            className="w-14 h-14 rounded-full overflow-hidden shadow-lg transition-transform duration-200 active:scale-95 flex-shrink-0 select-none"
            style={{
              background: (profile?.avatar_url && profile.avatar_url.trim() !== '')
                ? 'transparent'
                : 'var(--retro-blue-gradient)',
              touchAction: 'pan-y',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            {avatarContent}
          </button>

          {/* 인사말 및 사용자 이름 */}
          <div className="ml-4 flex-grow mr-4 mt-0.5 select-none" style={{
            touchAction: 'pan-y',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <p className="select-none">
              {/* 닉네임 */}
              <span className={`pt-6 text-xl font-bold text-gray-800 select-none ${getLocaleFont('name', detectNameLanguage(profile?.display_name || profile?.full_name || displayName || '익명 사용자'))}`} style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                userSelect: 'none'
              }}>
                {profile?.display_name || profile?.full_name || displayName || '익명 사용자'}
              </span>
              {getHonorific().text && (
                <span className={`ml-0.5 pt-6 text-lg font-bold text-gray-800  select-none ${getHonorific().font}`} style={{
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  userSelect: 'none'
                }}>
                  {getHonorific().text}
                </span>
              )}
              {/* 인사말 */}
              <span className={`ml-2 text-xl text-gray-600 font-semibold leading-5 select-none ${getLocaleFont('greeting')}`} style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                userSelect: 'none'
              }}>
                {getGreeting()}
              </span>
            </p>
          </div>
        </div>

        {/* 오른쪽: 알림 아이콘 */}
        <button
          onClick={() => {/* 알림 페이지 기능 추후 구현 */}}
          onContextMenu={(e) => e.preventDefault()}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 flex-shrink-0 select-none"
          style={{
            background: '#dcd4c6',
            boxShadow: '0 2px 2px rgb(143, 139, 139), 0 2px 2px rgba(0, 0, 0, 0.1)',
            touchAction: 'pan-y',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <img
            src="/Bell.svg"
            alt="Notification"
            className="w-5 h-5 select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              userSelect: 'none'
            }}
          />
        </button>
      </div>

      {/* 구독 상태 표시 (Premium인 경우) */}
      {profile?.subscription_tier !== 'free' && (
        <div className="mt-3 flex justify-start">
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold text-white select-none"
            style={{
              background: profile?.subscription_tier === 'premium'
                ? 'var(--retro-purple-gradient)'
                : 'var(--retro-green-gradient)',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            {profile?.subscription_tier === 'premium' ? '프리미엄' : '교회'}
          </div>
        </div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // 실제 변경되는 props만 체크하여 불필요한 렌더링 방지
  return (
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.profile?.id === nextProps.profile?.id &&
    prevProps.profile?.display_name === nextProps.profile?.display_name &&
    prevProps.profile?.full_name === nextProps.profile?.full_name &&
    prevProps.profile?.avatar_url === nextProps.profile?.avatar_url &&
    prevProps.profile?.subscription_tier === nextProps.profile?.subscription_tier &&
    prevProps.displayName === nextProps.displayName &&
    prevProps.locale === nextProps.locale &&
    prevProps.onProfileClick === nextProps.onProfileClick &&
    prevProps.isLoading === nextProps.isLoading
  )
})

export default ProfileHeader