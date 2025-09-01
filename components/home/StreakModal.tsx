'use client'

import { useState } from 'react'

interface StreakData {
  gratitude: {
    currentStreak: number
    weeklyProgress: boolean[]
    color: string
    icon: string
  }
  sermon: {
    currentStreak: number
    weeklyProgress: boolean[]
    color: string
    icon: string
  }
  prayer: {
    currentStreak: number
    weeklyProgress: boolean[]
    color: string
    icon: string
  }
}

interface StreakModalProps {
  streakData: StreakData
  onClose: () => void
  locale: string
}

export default function StreakModal({ streakData, onClose, locale }: StreakModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]

  const generateCalendarData = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const calendarDays = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null)
    }

    // Days of the month with mock data
    for (let day = 1; day <= daysInMonth; day++) {
      const hasGratitude = Math.random() > 0.4
      const hasSermon = Math.random() > 0.7
      const hasPrayer = Math.random() > 0.3
      
      calendarDays.push({
        day,
        gratitude: hasGratitude,
        sermon: hasSermon,
        prayer: hasPrayer,
        total: [hasGratitude, hasSermon, hasPrayer].filter(Boolean).length
      })
    }

    return calendarDays
  }

  const calendarData = generateCalendarData()
  const totalNotes = Object.values(streakData).reduce(
    (sum, streak) => sum + streak.weeklyProgress.filter(Boolean).length, 
    0
  )

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-4/5 bg-white rounded-t-3xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-jua">
              영적 성장 통계
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalNotes}</div>
              <div className="text-sm opacity-80">이번주 기록</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.max(...Object.values(streakData).map(s => s.currentStreak))}
              </div>
              <div className="text-sm opacity-80">최장 연속</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm opacity-80">일관성 점수</div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto pb-6">
          {/* Calendar View */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-jua text-gray-800">
                월별 기록 캘린더
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  ←
                </button>
                <span className="font-semibold text-gray-800">
                  {currentYear}년 {months[currentMonth]}
                </span>
                <button
                  onClick={() => navigateMonth('next')}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarData.map((dayData, index) => (
                  <div key={index} className="aspect-square">
                    {dayData ? (
                      <div className="w-full h-full rounded-lg border border-gray-100 flex flex-col items-center justify-center relative">
                        <span className="text-xs font-medium text-gray-700">
                          {dayData.day}
                        </span>
                        {dayData.total > 0 && (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayData.gratitude && (
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            )}
                            {dayData.sermon && (
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            )}
                            {dayData.prayer && (
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="px-6 space-y-4">
            <h3 className="text-lg font-bold font-jua text-gray-800">
              상세 통계
            </h3>

            {Object.entries(streakData).map(([key, data]) => (
              <div key={key} className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${data.color} flex items-center justify-center text-lg`}>
                      {data.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold font-jua text-gray-800">
                        {key === 'gratitude' && '감사 노트'}
                        {key === 'sermon' && '설교 노트'}
                        {key === 'prayer' && '기도 노트'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        현재 {data.currentStreak}일 연속 기록 중
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">
                      {data.weeklyProgress.filter(Boolean).length}
                    </div>
                    <div className="text-xs text-gray-500">이번주 기록</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">
                      {Math.round(data.weeklyProgress.filter(Boolean).length / 7 * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">주간 달성률</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievement Badges */}
          <div className="px-6 mt-6">
            <h3 className="text-lg font-bold font-jua text-gray-800 mb-4">
              성취 배지
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xs font-medium">7일 연속</div>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-4 text-white text-center">
                <div className="text-2xl mb-1">📿</div>
                <div className="text-xs font-medium">기도 전사</div>
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-4 text-white text-center">
                <div className="text-2xl mb-1">✨</div>
                <div className="text-xs font-medium">일관성 왕</div>
              </div>
            </div>
          </div>

          {/* Bottom Padding */}
          <div style={{ height: 'var(--actual-safe-bottom)' }} />
        </div>
      </div>
    </div>
  )
}