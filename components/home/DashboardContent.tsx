'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Profile } from '../../utils/supabase/types'
import { useTranslation } from '../../hooks/useTranslation'
import Image from 'next/image'
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
  const [currentTime, setCurrentTime] = useState(new Date())

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1분마다 업데이트

    return () => clearInterval(timer)
  }, [])

  // 시간대별 이미지 투명도 결정
  const getTimeBasedOpacity = () => {
    const hour = currentTime.getHours()

    if (hour < 6) {
      return 0.3 // 새벽 - 어둡게
    }
    if (hour < 12) {
      return 1.0 // 아침 - 밝게
    }
    if (hour < 18) {
      return 0.8 // 오후 - 보통
    }
    if (hour < 22) {
      return 0.6 // 저녁 - 조금 어둡게
    }
    return 0.4 // 밤 - 어둡게
  }

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
    <div className="px-4 space-y-8">
      {/* 주간 스트릭 위젯 */}
      <WeeklyStreakWidget user={user} />

      {/* 달력 보기 및 시간별 이미지 */}
      <div className="flex -mt-4 space-x-3 select-none">
        {/* 달력 보기 버튼 - 1 비율 */}
        <div
          onClick={() => console.log('달력 페이지로 이동')}
          onContextMenu={(e) => e.preventDefault()}
          className="w-20 h-20 rounded-2xl bg-white relative overflow-hidden flex-shrink-0 active:scale-95 transition-all duration-300 select-none"
          style={{
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
            touchAction: 'pan-y',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/Home/Calendar.png"
              alt="달력"
              width={80}
              height={80}
              className="object-cover"
              priority={true}
              quality={100}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* 시간별 이미지 컨테이너 - 4 비율 */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="flex-[4] rounded-2xl bg-white overflow-hidden relative active:scale-95 transition-all duration-300 select-none"
          style={{
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
            touchAction: 'pan-y',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div
            className="w-full h-full min-h-[80px] relative select-none"
            style={{ opacity: getTimeBasedOpacity() }}
          >
            <Image
              src="/Home/Morning.webp"
              alt="시간별 이미지"
              fill
              className="object-cover"
              priority={true}
              quality={100}
              sizes="(max-width: 768px) 100vw, 80vw"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>

      {/* 오늘의 감사 카드 */}
      <TodayGratitudeCard user={user} />

      {/* 연속 기록 위젯 */}
      <StreakWidget user={user} />

      {/* 통계 위젯 */}
      <StatsWidget user={user} />

      {/* 최근 노트 위젯 */}
      <RecentNotesWidget user={user} />

      {/* 추가 여백 (하단 네비게이션을 위함) */}
      <div className="h-4" />
    </div>
  )
}