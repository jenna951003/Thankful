'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
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
  const [currentTime, setCurrentTime] = useState(new Date())
  const supabase = createClient()

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

  // 목업 데이터 사용으로 로딩이 즉시 완료되므로 로딩 UI 주석 처리
  // if (loading) {
  //   return (
  //     <div className="retro-card p-4 animate-pulse">
  //       <div className="h-4 bg-gray-200 rounded mb-3"></div>
  //       <div className="flex justify-between">
  //         {Array.from({ length: 7 }).map((_, i) => (
  //           <div key={i} className="flex flex-col items-center space-y-2">
  //             <div className="h-3 w-6 bg-gray-200 rounded"></div>
  //             <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="bg-[#dcd4c6] rounded-2xl p-4 shadow-md relative">
      {/* 시간별 이미지 - 우측상단 */}
      {/* <div className="absolute -top-8 -right-6 z-10">
        <div
          className="w-48 h-8 rounded-lg overflow-hidden"
          style={{ opacity: getTimeBasedOpacity() }}
        >
          <Image
            src="/Home/Image.png"
            alt="시간별 이미지"
            width={192}
            height={32}
            className="w-full h-full object-cover"
            priority={true}
            quality={100}
            sizes="192px"
          />
        </div>
      </div> */}

      {/* 헤더 */}


      {/* 주간 표시 */}
      <div className="flex justify-between items-center">
        {weeklyData.map((dayData, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            {/* 요일 */}
            <div
              className={`text-xs font-bold font-jua select-none ${
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
              style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              {dayData.day}
            </div>

            {/* 날짜 */}
            <div
              className={`text-xs font-bold font-jua select-none ${
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
              style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                userSelect: 'none'
              }}
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
                <Image
                  src="/Home/Check.png"
                  alt="완료"
                  width={32}
                  height={32}
                  className="select-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none'
                  }}
                />
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