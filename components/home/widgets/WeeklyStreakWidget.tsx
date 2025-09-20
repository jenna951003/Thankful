'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { createClient } from '../../../utils/supabase/client'
import { useTranslation } from '../../../hooks/useTranslation'

interface WeeklyStreakWidgetProps {
  user: User | null
}

interface DayData {
  day: string
  date: number
  completed: boolean
  isToday: boolean
  isPastDay: boolean
  dayOfWeek: number // 0=일요일, 6=토요일
}

export default function WeeklyStreakWidget({ user }: WeeklyStreakWidgetProps) {
  const { t } = useTranslation()
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

  // 이미지 투명도 (동일한 밝기)
  const getTimeBasedOpacity = () => {
    return 0.9 // 항상 동일한 밝기
  }

  // 시간대별 이미지 선택
  const getTimeBasedImage = () => {
    const hour = currentTime.getHours()

    if (hour >= 4 && hour < 7) {
      return '/Home/Dawn.webp'     // 새벽 (4~7시)
    }
    if (hour >= 7 && hour < 10) {
      return '/Home/Morning.webp'  // 아침 (7~10시)
    }
    if (hour >= 10 && hour < 13) {
      return '/Home/Lunch.webp'    // 점심 (10~13시)
    }
    if (hour >= 13 && hour < 18) {
      return '/Home/Afternoon.webp' // 오후 (13~18시)
    }
    if (hour >= 18 && hour < 22) {
      return '/Home/Evening.webp'  // 저녁 (18~22시)
    }
    // 22시~4시 (밤)
    return '/Home/Night.webp'      // 밤 (22~4시)
  }

  // 시간별 인사말 가져오기
  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours()

    if (hour >= 4 && hour < 7) {
      return t('home.timeGreeting.dawn')     // 새벽 (4~7시)
    }
    if (hour >= 7 && hour < 10) {
      return t('home.timeGreeting.morning')  // 아침 (7~10시)
    }
    if (hour >= 10 && hour < 13) {
      return t('home.timeGreeting.lunch')    // 점심 (10~13시)
    }
    if (hour >= 13 && hour < 18) {
      return t('home.timeGreeting.afternoon') // 오후 (13~18시)
    }
    if (hour >= 18 && hour < 22) {
      return t('home.timeGreeting.evening')  // 저녁 (18~22시)
    }
    // 22시~4시 (밤)
    return t('home.timeGreeting.night')      // 밤 (22~4시)
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
        const isPastDay = currentDate < today && !isToday

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
          isPastDay,
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
    <div
      className="rounded-2xl p-0 relative select-none"
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
          <div key={index} className="flex flex-col items-center space-y-2 px-1 py-3">
            {/* 요일 */}
            <div
              className={`text-sm font-bold font-jua select-none w-6 h-6 flex items-center justify-center ${
                dayData.isToday
                  ? `rounded-full text-white ${
                      dayData.dayOfWeek === 0
                        ? 'bg-[#ec7979]'
                        : dayData.dayOfWeek === 6
                          ? 'bg-[#3471ea]'
                          : 'bg-[#747b76]'
                    }`
                  : dayData.dayOfWeek === 0
                    ? 'text-[#ec7979]'
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
              className={`text-sm font-bold font-jua select-none ${
                dayData.isToday
                  ? dayData.dayOfWeek === 0
                    ? 'text-[#ec7979] font-bold'
                    : dayData.dayOfWeek === 6
                      ? 'text-[#3471ea] font-bold'
                      : 'text-[#747b76] font-bold'
                  : dayData.dayOfWeek === 0
                    ? 'text-[#ec7979]'
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
              className={`w-8 h-8 ml-0.5 rounded-full flex items-center justify-center transition-all duration-200 ${
                dayData.completed
                  ? 'bg-[#55af67] text-white shadow-md' // 모든 요일 동일한 초록색
                  : dayData.isToday
                    ? 'bg-gray-300 border-2 border-[#747b76] border-dashed' // 모든 요일 동일한 회색 테두리
                    : dayData.isPastDay
                      ? 'bg-[#ec7979] text-white shadow-md' // 과거 미완료 날짜는 붉은톤
                      : 'bg-gray-300' // 미래 날짜
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
              ) : dayData.isPastDay ? (
                <Image
                  src="/Home/Fail.png"
                  alt="실패"
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
              ) : (
                <Image
                  src="/Home/Spot.png"
                  alt="미완료"
                  width={8}
                  height={8}
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
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 달력 보기 및 시간별 이미지 */}
      <div className="flex mt-4 -mb-1 space-x-3 select-none">
        {/* 달력 보기 버튼 - 1 비율 */}
        <div className="flex flex-col space-y-2 flex-shrink-0">
          <div
            onClick={() => console.log('달력 페이지로 이동')}
            onContextMenu={(e) => e.preventDefault()}
            className="w-18 h-18 ml-0.5 rounded-xl bg-white relative overflow-hidden active:scale-95 transition-all duration-300 select-none"
            style={{
              boxShadow: '0 2px 4px rgb(109, 107, 107), 0 2px 2px rgba(0, 0, 0, 0.1)',
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
                width={72}
                height={72}
                className="object-cover"
                priority={false}
                quality={75}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
          <div className="mr-1 -mt-0.5 text-right">
            <p
              className="text-xs text-gray-600 font-jua select-none"
              style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              {t('home.calendar')}
            </p>
          </div>
        </div>

        {/* 시간별 이미지 컨테이너 - 4 비율 */}
        <div className="flex-[4] flex flex-col space-y-2">
          <div
            onContextMenu={(e) => e.preventDefault()}
            className="mr-0.5 rounded-xl bg-white overflow-hidden relative active:scale-97 transition-all duration-300 select-none"
            style={{
              boxShadow: '0 2px 4px rgb(109, 107, 107), 0 2px 2px rgba(0, 0, 0, 0.1)',
              touchAction: 'pan-y',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <div
              className="w-full h-full min-h-[72px] relative select-none"
              style={{ opacity: getTimeBasedOpacity() }}
            >
              <Image
                src={getTimeBasedImage()}
                alt="시간별 이미지"
                fill
                className="object-cover"
                priority={false}
                quality={75}
                sizes="(max-width: 768px) 100vw, 80vw"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              {/* 흰색 오버레이 */}
              <div className="absolute inset-0 bg-white/30 bg-opacity-20 pointer-events-none"></div>
            </div>
          </div>
          <div className="mr-1.5 -mt-0.5 text-right">
            <p
              className="text-xs text-gray-600 font-jua select-none"
              style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              {getTimeBasedGreeting()}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}