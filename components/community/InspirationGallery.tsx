'use client'

import { useState, useEffect } from 'react'

interface InspirationNote {
  id: string
  type: 'gratitude' | 'sermon' | 'prayer'
  title: string
  imageUrl: string
  author: string
  likes: number
  isLiked: boolean
  country: string
  createdAt: Date
}

interface InspirationGalleryProps {
  locale: string
}

export default function InspirationGallery({ locale }: InspirationGalleryProps) {
  const [notes, setNotes] = useState<InspirationNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'gratitude' | 'sermon' | 'prayer'>('all')

  // Mock data
  const mockNotes: InspirationNote[] = [
    {
      id: '1',
      type: 'gratitude',
      title: '가족과 함께한 추수감사절',
      imageUrl: '/api/placeholder/300/200',
      author: '익명',
      likes: 42,
      isLiked: false,
      country: '🇰🇷 한국',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '2',
      type: 'sermon',
      title: '사랑의 계명 - 요한복음 13장',
      imageUrl: '/api/placeholder/300/200',
      author: '익명',
      likes: 78,
      isLiked: true,
      country: '🇺🇸 미국',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
    },
    {
      id: '3',
      type: 'prayer',
      title: '평화를 위한 기도',
      imageUrl: '/api/placeholder/300/200',
      author: '익명',
      likes: 156,
      isLiked: false,
      country: '🇵🇭 필리핀',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
    },
    {
      id: '4',
      type: 'gratitude',
      title: '새로운 직장에서의 첫날',
      imageUrl: '/api/placeholder/300/200',
      author: '익명',
      likes: 23,
      isLiked: false,
      country: '🇨🇦 캐나다',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18)
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNotes(mockNotes)
      setIsLoading(false)
    }, 1500)
  }, [])

  const filteredNotes = filter === 'all' 
    ? notes 
    : notes.filter(note => note.type === filter)

  const handleLike = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            isLiked: !note.isLiked,
            likes: note.isLiked ? note.likes - 1 : note.likes + 1
          }
        : note
    ))
  }

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    return `${days}일 전`
  }

  const getTypeConfig = (type: string) => {
    const configs = {
      gratitude: { icon: '🙏', label: '감사', color: 'text-green-600' },
      sermon: { icon: '📖', label: '설교', color: 'text-orange-600' },
      prayer: { icon: '🕊️', label: '기도', color: 'text-blue-600' }
    }
    return configs[type as keyof typeof configs]
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="w-full h-40 bg-gray-200"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: '전체', icon: '🌟' },
          { id: 'gratitude', label: '감사', icon: '🙏' },
          { id: 'sermon', label: '설교', icon: '📖' },
          { id: 'prayer', label: '기도', icon: '🕊️' }
        ].map(option => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
              filter === option.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                : 'bg-white/90 text-gray-600 hover:bg-white border border-white/50'
            }`}
          >
            <span className="text-sm">{option.icon}</span>
            <span className="text-sm">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Global Challenge Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-jua mb-1">
              🌍 글로벌 감사 챌린지
            </h3>
            <p className="text-sm opacity-90 font-hubballi">
              30일 동안 매일 감사 노트 작성하기
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs opacity-80">일 남음</div>
          </div>
        </div>
        <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="bg-white h-full w-3/4 rounded-full"></div>
        </div>
        <div className="flex justify-between text-xs mt-1 opacity-80">
          <span>참여자 12,847명</span>
          <span>75% 완료</span>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const config = getTypeConfig(note.type)
            return (
              <div
                key={note.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Image */}
                <div className="relative">
                  <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-4xl">{config.icon}</div>
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs font-medium px-2 py-1 bg-white/90 rounded-full ${config.color}`}>
                      {config.label}
                    </span>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(note.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className={note.isLiked ? 'text-red-500' : 'text-gray-400'}>
                      {note.isLiked ? '❤️' : '🤍'}
                    </span>
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h4 className="font-semibold font-jua text-gray-800 text-sm mb-2 line-clamp-2">
                    {note.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>{note.country}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(note.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={note.isLiked ? 'text-red-500' : 'text-gray-400'}>❤️</span>
                      <span>{note.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-gray-500 font-hubballi">
            해당 카테고리의 노트가 아직 없습니다
          </p>
        </div>
      )}

      {/* Load More */}
      {filteredNotes.length > 0 && (
        <div className="text-center py-4">
          <button className="px-6 py-3 bg-white/90 text-gray-700 rounded-2xl font-medium hover:bg-white hover:shadow-md transition-all duration-200">
            더 많은 노트 보기
          </button>
        </div>
      )}
    </div>
  )
}