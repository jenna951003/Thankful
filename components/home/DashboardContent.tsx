'use client'

import React from 'react'
import { User } from '@supabase/supabase-js'
import { Profile } from '../../utils/supabase/types'
import { useTranslation } from '../../hooks/useTranslation'
import TodayGratitudeCard from './widgets/TodayGratitudeCard'
import StreakWidget from './widgets/StreakWidget'
import RecentNotesWidget from './widgets/RecentNotesWidget'
import StatsWidget from './widgets/StatsWidget'
import WeeklyStreakWidget from './widgets/WeeklyStreakWidget'

interface DashboardContentProps {
  activeTab: string
  user: User | null
  profile: Profile | null
  displayName?: string | null
}

export default function DashboardContent({ activeTab, user, profile, displayName }: DashboardContentProps) {
  const { t } = useTranslation()

  if (activeTab !== 'home') {
    // 다른 탭의 콘텐츠는 나중에 구현
    return (
      <div className="px-4 py-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 font-jua">
            개발 중입니다
          </h2>
          <p className="text-gray-600 font-noto-serif-kr">
            {activeTab} 탭은 곧 준비될 예정입니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-8 select-none"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        touchAction: 'pan-y',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {/* 페이지 제목 */}
      <div className="ml-1 mt-0 mb-4 px-4">
        <h1
          className="text-[48px] font-light text-gray-800 font-zen-dots select-none leading-tight"
          style={{
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          Home
        </h1>
      </div>

      {/* 주간 스트릭 위젯 */}
      <div className="px-4">
        <WeeklyStreakWidget user={user} />
      </div>

      {/* 오늘의 감사 카드 - 전체 너비 */}
      <TodayGratitudeCard user={user} />

      {/* 연속 기록 위젯 */}
      <div className="px-4">
        <StreakWidget user={user} />
      </div>

      {/* 통계 위젯 */}
      <div className="px-4">
        <StatsWidget user={user} />
      </div>

      {/* 최근 노트 위젯 */}
      <div className="px-4">
        <RecentNotesWidget user={user} />
      </div>

      {/* 추가 여백 (하단 네비게이션을 위함) */}
      <div className="h-4" />
    </div>
  )
}