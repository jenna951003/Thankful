'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { createClient } from '../../../utils/supabase/client'
import { useTranslation } from '../../../hooks/useTranslation'
import NotesChartWidget from './NotesChartWidget'

interface StatsWidgetProps {
  user: User | null
}

interface StatsData {
  weeklyCount: number
  weeklyGoal: number
  monthlyCount: number
  lastMonthCount: number
  totalCount: number
  firstWriteDate: string | null
  mostActiveDay: string
  averagePerWeek: number
}

export default function StatsWidget({ user }: StatsWidgetProps) {
  const { t } = useTranslation()
  const [stats, setStats] = useState<StatsData>({
    weeklyCount: 0,
    weeklyGoal: 7,
    monthlyCount: 0,
    lastMonthCount: 0,
    totalCount: 0,
    firstWriteDate: null,
    mostActiveDay: '월요일',
    averagePerWeek: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // 현재 날짜 정보
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

        // 감사노트 데이터 조회 (임시 데이터)
        // TODO: 실제 Supabase 쿼리로 교체
        const mockStats: StatsData = {
          weeklyCount: 4,
          weeklyGoal: 7,
          monthlyCount: 18,
          lastMonthCount: 15,
          totalCount: 127,
          firstWriteDate: '2024-01-15',
          mostActiveDay: '일요일',
          averagePerWeek: 5.2
        }

        setStats(mockStats)
      } catch (error) {
        console.error('통계 데이터 로딩 중 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.id, supabase])

  const getWeeklyProgress = () => {
    return Math.min((stats.weeklyCount / stats.weeklyGoal) * 100, 100)
  }

  const getMonthlyChange = () => {
    if (stats.lastMonthCount === 0) return 0
    return ((stats.monthlyCount - stats.lastMonthCount) / stats.lastMonthCount) * 100
  }

  const getDaysSinceFirst = () => {
    if (!stats.firstWriteDate) return 0
    const firstDate = new Date(stats.firstWriteDate)
    const now = new Date()
    return Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="retro-card p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="retro-card p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 font-jua">통계</h3>
        <Image
          src="/Home/Static.png"
          alt="통계"
          width={24}
          height={24}
          className="select-none"
        />
      </div>

      <div className="space-y-4">
        {/* 이번 주 진행률 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 font-noto-serif-kr">
              이번 주 목표
            </span>
            <span className="text-sm font-bold text-gray-800 font-jua">
              {stats.weeklyCount}/{stats.weeklyGoal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${getWeeklyProgress()}%`,
                background: 'var(--retro-green-gradient)'
              }}
            />
          </div>
        </div>

        {/* 통계 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 이번 달 */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800 font-jua">
              {stats.monthlyCount}
            </div>
            <div className="text-xs text-gray-600 font-noto-serif-kr">이번 달</div>
            {getMonthlyChange() !== 0 && (
              <div
                className={`text-xs font-medium ${
                  getMonthlyChange() > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {getMonthlyChange() > 0 ? '+' : ''}{getMonthlyChange().toFixed(1)}%
              </div>
            )}
          </div>

          {/* 전체 기록 */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800 font-jua">
              {stats.totalCount}
            </div>
            <div className="text-xs text-gray-600 font-noto-serif-kr">전체 기록</div>
            <div className="text-xs text-gray-500 font-noto-serif-kr">
              {getDaysSinceFirst()}일째
            </div>
          </div>
        </div>

        {/* 인사이트 */}
        <div className="p-3 rounded-lg" style={{ background: 'var(--retro-pink-gradient)' }}>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-700 font-noto-serif-kr">
                가장 활발한 요일
              </span>
              <span className="text-xs font-bold text-gray-800 font-jua">
                {stats.mostActiveDay}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-700 font-noto-serif-kr">
                주평균 기록
              </span>
              <span className="text-xs font-bold text-gray-800 font-jua">
                {stats.averagePerWeek.toFixed(1)}개
              </span>
            </div>
          </div>
        </div>

        {/* 격려 메시지 */}
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600 font-noto-serif-kr">
            {getWeeklyProgress() >= 100
              ? "이번 주 목표를 달성했어요! 🎉"
              : getWeeklyProgress() >= 70
                ? "목표 달성까지 조금 더! 💪"
                : getWeeklyProgress() >= 30
                  ? "좋은 페이스로 가고 있어요! 👍"
                  : "오늘부터 다시 시작해보세요! ✨"
            }
          </p>
        </div>

        {/* 차트 위젯 */}
        <NotesChartWidget user={user} />
      </div>
    </div>
  )
}