'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '../../../utils/supabase/client'
import { Note } from '../../../utils/supabase/types'
import { useTranslation } from '../../../hooks/useTranslation'

interface RecentNotesWidgetProps {
  user: User
}

export default function RecentNotesWidget({ user }: RecentNotesWidgetProps) {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3)

        if (error) {
          console.error('최근 노트 로딩 실패:', error)
          return
        }

        setNotes(data || [])
      } catch (error) {
        console.error('최근 노트 로딩 중 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentNotes()
  }, [user.id, supabase])

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'gratitude': return '🙏'
      case 'sermon': return '📖'
      case 'prayer': return '🕯️'
      default: return '📝'
    }
  }

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'gratitude': return 'var(--retro-green)'
      case 'sermon': return 'var(--retro-blue)'
      case 'prayer': return 'var(--retro-purple)'
      default: return 'var(--retro-orange)'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInHours < 48) return '어제'
    
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + '...'
  }

  if (loading) {
    return (
      <div className="retro-card p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="retro-card p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 font-jua">최근 기록</h3>
        <div className="text-lg">📋</div>
      </div>

      {/* 노트 목록 */}
      {notes.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-gray-600 font-noto-serif-kr">
            아직 작성한 기록이 없어요
          </p>
          <p className="text-sm text-gray-500 font-noto-serif-kr mt-1">
            첫 번째 감사 일기를 작성해보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              onClick={() => {
                console.log('노트 클릭:', note.id)
                // TODO: 노트 상세보기 페이지로 이동
              }}
            >
              {/* 아이콘 */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ 
                  background: `${getNoteTypeColor(note.type)}20`,
                  border: `2px solid ${getNoteTypeColor(note.type)}40`
                }}
              >
                {getNoteTypeIcon(note.type)}
              </div>

              {/* 콘텐츠 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-800 font-jua text-sm truncate">
                    {note.title}
                  </h4>
                  <span className="text-xs text-gray-500 font-noto-serif-kr flex-shrink-0 ml-2">
                    {formatDate(note.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-noto-serif-kr leading-relaxed">
                  {truncateContent(note.content)}
                </p>
                
                {/* 즐겨찾기 표시 */}
                {note.is_favorite && (
                  <div className="mt-2">
                    <span className="text-xs text-yellow-600">⭐ 즐겨찾기</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {notes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={() => {
              console.log('모든 노트 보기')
              // TODO: 전체 노트 목록 페이지로 이동
            }}
            className="w-full text-center text-sm font-medium font-noto-serif-kr hover:underline transition-all duration-200"
            style={{ color: 'var(--retro-blue)' }}
          >
            모든 기록 보기 →
          </button>
        </div>
      )}
    </div>
  )
}