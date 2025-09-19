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

  // 기독교 감성의 연속 기록 메시지
  const getStreakMessage = (streak: number): string => {
    if (streak === 0) return "첫 감사의 기록을 시작해보세요! ✍️"
    if (streak <= 2) return "좋은 시작이에요! 주님께 감사해요 🌱"
    if (streak <= 6) return "꾸준한 감사의 마음이 아름다워요 💝"
    if (streak <= 13) return "일주일 동안 감사했어요! 하나님께 영광 🙏"
    if (streak <= 29) return "2주간의 감사! 주님이 기뻐하세요 ☀️"
    if (streak <= 59) return "한 달간의 감사! 은혜가 충만해요 🕊️"
    if (streak <= 99) return "두 달간 신실하게! 주님의 축복이에요 🌈"
    if (streak <= 199) return "100일의 감사! 하나님께서 크게 쓰실 거예요 ⭐"
    if (streak <= 364) return "200일 이상! 주님 안에서 성장하고 있어요 🌿"
    return "1년 이상! 주님께서 예비하신 축복의 여정 🎁"
  }

  // 이모지와 텍스트를 분리하는 함수
  const parseMessage = (message: string) => {
    // 이모지 정규식 (유니코드 이모지 패턴)
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]/gu

    const parts = []
    let lastIndex = 0
    let match

    while ((match = emojiRegex.exec(message)) !== null) {
      // 이모지 앞의 텍스트 추가
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: message.slice(lastIndex, match.index)
        })
      }

      // 이모지 추가
      parts.push({
        type: 'emoji',
        content: match[0]
      })

      lastIndex = emojiRegex.lastIndex
    }

    // 마지막 텍스트 추가
    if (lastIndex < message.length) {
      parts.push({
        type: 'text',
        content: message.slice(lastIndex)
      })
    }

    return parts
  }

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
      className="bg-[#dcd4c6] rounded-2xl p-6 mb-6 select-none"
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
        <h3 className="text-lg font-bold text-gray-800 font-jua select-none" style={{
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          userSelect: 'none'
        }}>연속 기록</h3>
        <Image
          src="/Home/Fire.png"
          alt="연속기록"
          width={42}
          height={42}
          className="select-none active:scale-95 transition-all duration-300"
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
            color: '#d7877e',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          {totalStreak}일
        </div>
        <p className="text-sm text-gray-600 font-bold font-noto-serif-kr select-none" style={{
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          userSelect: 'none'
        }}>감사노트 연속 기록</p>
      </div>



      {/* 격려 메시지 */}
      <div className="mt-4 pt-3 ">
        <div className="ml-0 bg-white/50 py-1 rounded-2xl text-gray-600 text-center font-dongle font-bold flex items-center justify-center flex-wrap">
          {parseMessage(getStreakMessage(totalStreak)).map((part, index) => (
            <span
              key={index}
              className={
                part.type === 'emoji'
                  ? 'text-sm ml-2 mt-0.5'
                  : 'text-2xl'
              }
              style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              {part.content}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}