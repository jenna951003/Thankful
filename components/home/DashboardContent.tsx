'use client'

import { User } from '@supabase/supabase-js'
import { Profile } from '../../utils/supabase/types'
import { useTranslation } from '../../hooks/useTranslation'
import TodayGratitudeCard from './widgets/TodayGratitudeCard'
import StreakWidget from './widgets/StreakWidget'
import RecentNotesWidget from './widgets/RecentNotesWidget'
import QuickActionsWidget from './widgets/QuickActionsWidget'

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
      <div className="px-6 py-8">
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
    <div className="px-6 space-y-6">
      {/* 오늘의 감사 카드 */}
      <TodayGratitudeCard user={user} />

      {/* 위젯들 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 연속 일수 위젯 */}
        <StreakWidget user={user} />
        
        {/* 빠른 액션 위젯 */}
        <QuickActionsWidget />
      </div>

      {/* 최근 노트 위젯 */}
      <RecentNotesWidget user={user} />

      {/* 추가 여백 (하단 네비게이션을 위함) */}
      <div className="h-4" />
    </div>
  )
}