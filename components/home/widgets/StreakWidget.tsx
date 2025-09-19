'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { createClient } from '../../../utils/supabase/client'
import { useTranslation } from '../../../hooks/useTranslation'

interface StreakWidgetProps {
  user: User | null
}

interface StreakData {
  gratitude: number
}

export default function StreakWidget({ user }: StreakWidgetProps) {
  const { t } = useTranslation()
  const [streaks, setStreaks] = useState<StreakData>({ gratitude: 0 })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStreaks = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('streaks')
          .select('note_type, current_streak')
          .eq('user_id', user!.id)

        if (error) {
          console.error('스트릭 데이터 로딩 실패:', error)
          return
        }

        const streakData: StreakData = { gratitude: 0 }
        
        data?.forEach((streak: any) => {
          if (streak.note_type === 'gratitude') {
            streakData.gratitude = streak.current_streak || 0
          }
        })

        setStreaks(streakData)
      } catch (error) {
        console.error('스트릭 데이터 로딩 중 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStreaks()
  }, [user?.id, supabase])

  const getStreakIcon = (type: string) => {
    switch (type) {
      case 'gratitude': return '🙏'
      case 'sermon': return '📖'
      case 'prayer': return '🕯️'
      default: return '✨'
    }
  }

  const getStreakLabel = (type: string) => {
    switch (type) {
      case 'gratitude': return '감사'
      case 'sermon': return '묵상'
      case 'prayer': return '기도'
      default: return ''
    }
  }

  const getStreakColor = (type: string) => {
    switch (type) {
      case 'gratitude': return 'var(--retro-green)'
      case 'sermon': return 'var(--retro-blue)'
      case 'prayer': return 'var(--retro-purple)'
      default: return 'var(--retro-orange)'
    }
  }

  const totalStreak = streaks.gratitude

  // 오늘의 주간 정보
  const today = new Date()
  const weekDay = today.toLocaleDateString('ko-KR', { weekday: 'long' })
  const weekOfMonth = Math.ceil(today.getDate() / 7)

  if (loading) {
    return (
      <div className="retro-card p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="retro-card p-4 select-none"
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
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 font-jua select-none" style={{
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          userSelect: 'none'
        }}>연속 기록</h3>
        <Image
          src="/Home/Fire.png"
          alt="연속기록"
          width={24}
          height={24}
          className="select-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      {/* 감사노트 연속 일수 */}
      <div className="text-center mb-4">
        <div
          className="text-3xl font-bold font-jua mb-1 select-none"
          style={{
            color: 'var(--retro-green)',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          {totalStreak}일
        </div>
        <p className="text-xs text-gray-600 font-noto-serif-kr select-none" style={{
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          userSelect: 'none'
        }}>감사노트 연속 기록</p>
      </div>

      {/* 오늘 주간 정보 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm">📅</span>
            <span className="text-sm font-medium text-gray-700 font-noto-serif-kr select-none" style={{
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              userSelect: 'none'
            }}>
              오늘 주간
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-800 font-jua select-none" style={{
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              userSelect: 'none'
            }}>{weekDay}</div>
            <div className="text-xs text-gray-600 font-noto-serif-kr select-none" style={{
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              userSelect: 'none'
            }}>{weekOfMonth}주차</div>
          </div>
        </div>
      </div>


      {/* 격려 메시지 */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center font-noto-serif-kr">
          {totalStreak === 0
            ? "첫 감사노트를 작성해보세요! 🌟"
            : totalStreak < 7
              ? "좋은 시작이에요! 계속해보세요 💪"
              : totalStreak < 30
                ? "훌륭한 감사 습관이에요! 🎉"
                : "정말 대단한 감사의 마음이에요! 🏆"
          }
        </p>
      </div>
    </div>
  )
}