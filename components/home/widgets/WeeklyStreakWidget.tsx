'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '../../../utils/supabase/client'

interface WeeklyStreakWidgetProps {
  user: User | null
}

interface DayData {
  day: string
  date: number
  completed: boolean
  isToday: boolean
  dayOfWeek: number // 0=일요일, 6=토요일
}

export default function WeeklyStreakWidget({ user }: WeeklyStreakWidgetProps) {
  const [weeklyData, setWeeklyData] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const generateWeeklyData = () => {
      const today = new Date()
      const currentDay = today.getDay() // 0 = 일요일, 1 = 월요일, ...
      const sunday = new Date(today)

      // 이번 주 일요일 구하기 (해외 기준)
      const daysToSunday = -currentDay
      sunday.setDate(today.getDate() + daysToSunday)

      const days = ['일', '월', '화', '수', '목', '금', '토']
      const weekData: DayData[] = []

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(sunday)
        currentDate.setDate(sunday.getDate() + i)
        const dayOfWeek = currentDate.getDay()

        const isToday = currentDate.toDateString() === today.toDateString()

        // 목업 데이터 - 실제로는 Supabase에서 해당 날짜의 감사노트 작성 여부 조회
        let completed = false
        if (i === 1 || i === 2 || i === 3 || i === 4) { // 월-목까지는 작성했다고 가정
          completed = true
        } else if (isToday) {
          completed = Math.random() > 0.5 // 오늘은 50% 확률
        }

        weekData.push({
          day: days[i],
          date: currentDate.getDate(),
          completed,
          isToday,
          dayOfWeek
        })
      }

      setWeeklyData(weekData)
      setLoading(false)
    }

    generateWeeklyData()
  }, [user])

  if (loading) {
    return (
      <div className="retro-card p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <div className="h-3 w-6 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ded3ca] rounded-2xl p-4">
      {/* 헤더 */}


      {/* 주간 표시 */}
      <div className="flex justify-between items-center">
        {weeklyData.map((dayData, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            {/* 요일 */}
            <div
              className={`text-xs font-bold font-jua ${
                dayData.isToday
                  ? dayData.dayOfWeek === 0
                    ? 'text-[#f05151] font-bold'
                    : dayData.dayOfWeek === 6
                      ? 'text-[#3471ea] font-bold'
                      : 'text-[#747b76] font-bold'
                  : dayData.dayOfWeek === 0
                    ? 'text-[#f05151]'
                    : dayData.dayOfWeek === 6
                      ? 'text-[#3471ea]'
                      : 'text-gray-700'
              }`}
            >
              {dayData.day}
            </div>

            {/* 날짜 */}
            <div
              className={`text-xs font-bold font-jua ${
                dayData.isToday
                  ? dayData.dayOfWeek === 0
                    ? 'text-[#f05151] font-bold'
                    : dayData.dayOfWeek === 6
                      ? 'text-[#3471ea] font-bold'
                      : 'text-[#747b76] font-bold'
                  : dayData.dayOfWeek === 0
                    ? 'text-[#f05151]'
                    : dayData.dayOfWeek === 6
                      ? 'text-[#3471ea]'
                      : 'text-gray-700'
              }`}
            >
              {dayData.date}
            </div>

            {/* 완료 상태 */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                dayData.completed
                  ? dayData.dayOfWeek === 0 // 일요일
                    ? 'bg-[#f05151] text-white shadow-md'
                    : dayData.dayOfWeek === 6 // 토요일
                      ? 'bg-[#3471ea] text-white shadow-md'
                      : 'bg-[#55af67] text-white shadow-md' // 평일
                  : dayData.isToday
                    ? dayData.dayOfWeek === 0
                      ? 'bg-gray-200 border-2 border-[#f05151] border-dashed'
                      : dayData.dayOfWeek === 6
                        ? 'bg-gray-200 border-2 border-[#3471ea] border-dashed'
                        : 'bg-gray-200 border-2 border-[#747b76] border-dashed'
                    : 'bg-gray-200'
              }`}
            >
              {dayData.completed ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : dayData.isToday ? (
                <div className={`w-2 h-2 rounded-full ${
                  dayData.dayOfWeek === 0
                    ? 'bg-[#f05151]'
                    : dayData.dayOfWeek === 6
                      ? 'bg-[#3471ea]'
                      : 'bg-[#747b76]'
                }`}></div>
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}