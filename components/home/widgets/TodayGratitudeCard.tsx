'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useTranslation } from '../../../hooks/useTranslation'

interface TodayGratitudeCardProps {
  user: User
}

export default function TodayGratitudeCard({ user }: TodayGratitudeCardProps) {
  const { t } = useTranslation()
  const [gratitudeText, setGratitudeText] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleQuickSave = () => {
    if (!gratitudeText.trim()) return
    
    // TODO: 감사 노트 저장 로직 구현
    console.log('저장할 감사 내용:', gratitudeText)
    setGratitudeText('')
    setIsExpanded(false)
    
    // 성공 피드백
    alert('감사 일기가 저장되었습니다! 🙏')
  }

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  return (
    <div className="retro-card p-6 mb-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 font-jua">
            오늘의 감사
          </h2>
          <p className="text-sm text-gray-600 font-noto-serif-kr">
            {today}
          </p>
        </div>
        <div className="text-2xl">
          🙏
        </div>
      </div>

      {/* 빠른 작성 영역 */}
      <div className="space-y-3">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full text-left p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200"
          >
            <p className="text-gray-500 font-noto-serif-kr">
              오늘 감사한 일을 적어보세요...
            </p>
          </button>
        ) : (
          <div className="space-y-3">
            <textarea
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder="오늘 하루 중 가장 감사했던 순간을 적어보세요..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-300 focus:outline-none font-noto-serif-kr"
              rows={4}
              autoFocus
            />
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsExpanded(false)
                  setGratitudeText('')
                }}
                className="px-4 py-2 text-gray-600 font-noto-serif-kr hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                취소
              </button>
              <button
                onClick={handleQuickSave}
                disabled={!gratitudeText.trim()}
                className="px-6 py-2 text-white font-noto-serif-kr rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: gratitudeText.trim() 
                    ? 'var(--retro-green-gradient)' 
                    : '#ccc'
                }}
              >
                저장
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 오늘의 팁 (랜덤) */}
      <div 
        className="mt-4 p-3 rounded-lg"
        style={{ background: 'var(--retro-pink-gradient)' }}
      >
        <p className="text-sm text-gray-700 font-noto-serif-kr">
          💡 <strong>오늘의 팁:</strong> 작은 일상의 순간들도 감사의 대상이 될 수 있어요. 따뜻한 햇살, 맛있는 음식, 친구의 안부 인사 등을 떠올려보세요.
        </p>
      </div>
    </div>
  )
}