'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import AuthScreen from '../auth/AuthScreen'
import StreakWidget from './StreakWidget'
import TodayVerse from './TodayVerse'
import RecentNotes from './RecentNotes'
import QuickActions from './QuickActions'
import TimeBasedImageBar from './TimeBasedImageBar'

interface HomeContentProps {
  locale: string
}

export default function HomeContent({ locale }: HomeContentProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAuth, setShowAuth] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours()
    
    if (hour < 6) return '새벽의 평안이 함께하시길 🌙'
    if (hour < 12) return '좋은 아침입니다 ☀️'
    if (hour < 18) return '평안한 오후 보내세요 ☁️'
    if (hour < 22) return '은혜로운 저녁 되세요 🌅'
    return '조용한 밤 되시기 바랍니다 🌙'
  }

  const getTimeBasedBackground = () => {
    const hour = currentTime.getHours()
    
    if (hour < 6) return 'from-indigo-900/20 via-purple-800/10 to-blue-900/20'
    if (hour < 12) return 'from-orange-100 via-amber-50 to-yellow-100'
    if (hour < 18) return 'from-blue-100 via-sky-50 to-cyan-100'
    if (hour < 22) return 'from-rose-100 via-pink-50 to-purple-100'
    return 'from-slate-800/20 via-gray-700/10 to-blue-900/20'
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eeead9]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto animate-pulse">
            📖
          </div>
          <p className="font-jua text-xl text-gray-700">로딩 중...</p>
        </div>
      </div>
    )
  }

  // Show auth screen if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#eeead9]">
        {/* Time-based Image Bar for non-logged users */}
        <TimeBasedImageBar className="pt-4 pb-2" />

        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl mb-6 mx-auto">
            📖
          </div>
          <h1 className="font-jua text-3xl text-gray-800 mb-4">
            Thankful에 오신 것을 환영합니다
          </h1>
          <p className="font-hubballi text-lg text-gray-600 mb-8 max-w-md">
            감사, 설교, 기도를 아름다운 캔버스로 기록하고 영적 여정을 시작해보세요
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-200 font-jua"
          >
            시작하기
          </button>
          {showAuth && <AuthScreen onClose={() => setShowAuth(false)} />}
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Time-based Image Bar */}
      <TimeBasedImageBar className="pt-4 pb-2" />

      {/* Modern Header */}
      <div className="pt-4 pb-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              안녕하세요! 👋
            </h1>
            <p className="text-gray-500">
              {currentTime.toLocaleDateString('ko-KR', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📖</span>
          </div>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 px-4">
        {/* Today's Stats Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">오늘의 기록</span>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm">✍️</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-xs text-green-600">+2 from yesterday</div>
        </div>

        {/* Streak Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">연속 기록</span>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-sm">🔥</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">7일</div>
          <div className="text-xs text-orange-600">Great job!</div>
        </div>
      </div>

      {/* Progress Chart Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">이번 주 활동</h2>
          <button className="text-sm text-blue-600 font-medium">전체보기</button>
        </div>
        
        {/* Weekly Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">감사 노트</span>
              <span className="text-sm text-gray-900 font-medium">5/7</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '71%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">설교 노트</span>
              <span className="text-sm text-gray-900 font-medium">2/3</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">기도 노트</span>
              <span className="text-sm text-gray-900 font-medium">7/7</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 px-4">
        <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-lg">🙏</span>
          </div>
          <span className="text-xs text-gray-600">감사</span>
        </button>
        
        <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-lg">📖</span>
          </div>
          <span className="text-xs text-gray-600">설교</span>
        </button>
        
        <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-lg">🕊️</span>
          </div>
          <span className="text-xs text-gray-600">기도</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
          <button className="text-sm text-blue-600 font-medium">더보기</button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🙏</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">가족과의 시간에 감사</p>
              <p className="text-xs text-gray-500">2시간 전</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">📖</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">사랑의 실천 - 마태복음 22장</p>
              <p className="text-xs text-gray-500">어제</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🕊️</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">친구의 회복을 위한 기도</p>
              <p className="text-xs text-gray-500">2일 전</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}