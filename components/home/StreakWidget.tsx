'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import { supabase } from '../../utils/supabase'
import StreakModal from './StreakModal'

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

interface StreakWidgetProps {
  locale: string
}

export default function StreakWidget({ locale }: StreakWidgetProps) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [streakData, setStreakData] = useState<StreakData>({
    gratitude: {
      currentStreak: 0,
      weeklyProgress: [false, false, false, false, false, false, false],
      color: 'from-green-400 to-emerald-500',
      icon: '🙏'
    },
    sermon: {
      currentStreak: 0,
      weeklyProgress: [false, false, false, false, false, false, false],
      color: 'from-orange-400 to-red-500',
      icon: '📖'
    },
    prayer: {
      currentStreak: 0,
      weeklyProgress: [false, false, false, false, false, false, false],
      color: 'from-teal-400 to-cyan-500',
      icon: '🕊️'
    }
  })
  const { user } = useAuth()

  const dayLabels = ['월', '화', '수', '목', '금', '토', '일']

  const fetchStreakData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Fetch streak data
      const { data: streaks, error: streakError } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)

      if (streakError) throw streakError

      // Fetch notes from the last 7 days to determine weekly progress
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('type, created_at')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())

      if (notesError) throw notesError

      // Process weekly progress
      const getWeeklyProgress = (noteType: 'gratitude' | 'sermon' | 'prayer') => {
        const progress = Array(7).fill(false)
        const today = new Date()
        
        notes?.forEach(note => {
          if (note.type === noteType) {
            const noteDate = new Date(note.created_at)
            const daysDiff = Math.floor((today.getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24))
            if (daysDiff >= 0 && daysDiff < 7) {
              progress[6 - daysDiff] = true
            }
          }
        })
        
        return progress
      }

      // Update streak data with real data
      const newStreakData: StreakData = {
        gratitude: {
          currentStreak: streaks?.find(s => s.note_type === 'gratitude')?.current_streak || 0,
          weeklyProgress: getWeeklyProgress('gratitude'),
          color: 'from-green-400 to-emerald-500',
          icon: '🙏'
        },
        sermon: {
          currentStreak: streaks?.find(s => s.note_type === 'sermon')?.current_streak || 0,
          weeklyProgress: getWeeklyProgress('sermon'),
          color: 'from-orange-400 to-red-500',
          icon: '📖'
        },
        prayer: {
          currentStreak: streaks?.find(s => s.note_type === 'prayer')?.current_streak || 0,
          weeklyProgress: getWeeklyProgress('prayer'),
          color: 'from-teal-400 to-cyan-500',
          icon: '🕊️'
        }
      }

      setStreakData(newStreakData)
    } catch (error) {
      console.error('Error fetching streak data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStreakData()
  }, [user])
  
  const totalNotes = Object.values(streakData).reduce(
    (sum, streak) => sum + streak.weeklyProgress.filter(Boolean).length, 
    0
  )

  const averageStreak = Math.round(
    Object.values(streakData).reduce((sum, streak) => sum + streak.currentStreak, 0) / 3
  )

  const renderWeeklyProgress = (progress: boolean[], color: string) => {
    return (
      <div className="flex gap-1">
        {progress.map((completed, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              completed 
                ? `bg-gradient-to-r ${color} text-white shadow-sm` 
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {dayLabels[index]}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-jua text-gray-800">
              주간 영적 기록
            </h2>
            <p className="text-sm text-gray-500 font-hubballi">
              이번 주 총 {totalNotes}개 기록 · 평균 {averageStreak}일 연속
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
          >
            더보기
          </button>
        </div>

        {/* Streak Cards */}
        <div className="grid gap-4">
          {Object.entries(streakData).map(([key, data]) => (
            <div key={key} className="bg-white/50 rounded-2xl p-4 border border-white/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${data.color} flex items-center justify-center text-lg`}>
                    {data.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold font-jua text-gray-800">
                      {key === 'gratitude' && '감사 노트'}
                      {key === 'sermon' && '설교 노트'}
                      {key === 'prayer' && '기도 노트'}
                    </h3>
                    <p className="text-xs text-gray-500 font-hubballi">
                      {data.currentStreak}일 연속 기록 중
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Weekly Progress */}
              <div className="flex items-center justify-between">
                {renderWeeklyProgress(data.weeklyProgress, data.color)}
                <div className="text-right">
                  <div className={`text-lg font-bold bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                    {data.currentStreak}
                  </div>
                  <div className="text-xs text-gray-500">연속일</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivation Message */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <p className="text-sm text-center text-gray-700 font-hubballi">
            "쉬지 말고 기도하라, 범사에 감사하라" - 데살로니가전서 5:17-18
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <StreakModal
          streakData={streakData}
          onClose={() => setShowModal(false)}
          locale={locale}
        />
      )}
    </>
  )
}