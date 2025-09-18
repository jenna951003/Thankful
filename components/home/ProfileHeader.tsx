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
  locale: string
}

export default function ProfileHeader({ user, profile, displayName, onProfileClick, locale }: ProfileHeaderProps) {
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
            className="w-14 h-14 rounded-full overflow-hidden shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
            style={{
              background: 'var(--retro-blue-gradient)',
            }}
          >
            {getAvatarContent()}
          </button>

          {/* 인사말 및 사용자 이름 */}
          <div className="ml-3 flex-grow mr-4 -mt-1">
            <p>
              {/* 닉네임 */}
              <span className={`pt-6 text-xl font-bold text-gray-800 ${getLocaleFont('name', detectNameLanguage(profile?.display_name || profile?.full_name || displayName || '익명 사용자'))}`}>
                {profile?.display_name || profile?.full_name || displayName || '익명 사용자'}
              </span>
              {getHonorific().text && (
                <span className={`ml-0.5 pt-6 text-lg font-bold text-gray-800 ${getHonorific().font}`}>
                  {getHonorific().text}
                </span>
              )}
              {/* 인사말 */}
              <span className={`ml-2 text-xl fo:text-sm text-gray-600 font-semibold ${getLocaleFont('greeting')}`}>
                {getGreeting()}
              </span>
            </p>
          </div>
        </div>

        {/* 오른쪽: 알람 아이콘 */}
        {/* <button
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 flex-shrink-0"
          style={{ background: '#e6dcc0' }}
        >
          <img
            src="/Bell.svg"
            alt="Notification"
            className="w-5 h-5 select-none"
          />
        </button> */}
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