'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import { useNotes } from '../../hooks/useNotes'

interface Note {
  id: string
  type: 'gratitude' | 'sermon' | 'prayer'
  title: string
  preview: string
  createdAt: Date
  color: string
  icon: string
}

interface RecentNotesProps {
  locale: string
}

export default function RecentNotes({ locale }: RecentNotesProps) {
  const { user } = useAuth()
  const { notes, loading } = useNotes()
  
  // Get recent notes (max 3) and convert to display format
  const recentNotes: Note[] = notes.slice(0, 3).map(note => ({
    id: note.id,
    type: note.type,
    title: note.title,
    preview: note.content.substring(0, 80) + (note.content.length > 80 ? '...' : ''),
    createdAt: new Date(note.created_at),
    color: note.type === 'gratitude' 
      ? 'from-green-400 to-emerald-500'
      : note.type === 'sermon'
      ? 'from-orange-400 to-red-500'
      : 'from-teal-400 to-cyan-500',
    icon: note.type === 'gratitude' 
      ? '🙏'
      : note.type === 'sermon'
      ? '📖'
      : '🕊️'
  }))

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}시간 전`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}일 전`
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'gratitude': return '감사'
      case 'sermon': return '설교'
      case 'prayer': return '기도'
      default: return '노트'
    }
  }

  const handleNoteClick = (note: Note) => {
    // 노트 상세보기 (추후 구현)
    console.log('Opening note:', note)
  }

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-white/50">
        <h3 className="text-lg font-bold font-jua text-gray-800 mb-3">
          최근 작성한 노트
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-16"></div>
          ))}
        </div>
      </div>
    )
  }

  if (recentNotes.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-white/50">
        <h3 className="text-lg font-bold font-jua text-gray-800 mb-3">
          최근 작성한 노트
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✍️</div>
          <p className="text-gray-500 font-hubballi">
            아직 작성한 노트가 없습니다
          </p>
          <button className="mt-3 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-sm font-medium transition-colors">
            첫 노트 작성하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-white/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold font-jua text-gray-800">
          최근 작성한 노트
        </h3>
        <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
          전체보기
        </button>
      </div>
      
      <div className="space-y-3">
        {recentNotes.map((note) => (
          <button
            key={note.id}
            onClick={() => handleNoteClick(note)}
            className="w-full text-left bg-white/50 rounded-xl p-3 border border-white/30 hover:bg-white/70 transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${note.color} flex items-center justify-center text-sm flex-shrink-0`}>
                {note.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold font-jua text-gray-800 text-sm truncate">
                    {note.title}
                  </h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {getTypeLabel(note.type)}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2 font-hubballi">
                  {note.preview}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(note.createdAt)}
                  </span>
                  <div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                    →
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}