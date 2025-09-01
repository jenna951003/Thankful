'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import { useNotes } from '../../hooks/useNotes'
import NotesGrid from './NotesGrid'
import NotesFilter from './NotesFilter'
import SearchBar from './SearchBar'

interface Note {
  id: string
  type: 'gratitude' | 'sermon' | 'prayer'
  title: string
  preview: string
  content: string
  imageUrl?: string
  tags: string[]
  createdAt: Date
  isFavorite: boolean
}

interface SavedNotesContentProps {
  locale: string
}

type ViewMode = 'grid' | 'list' | 'timeline'
type FilterType = 'all' | 'gratitude' | 'sermon' | 'prayer' | 'favorites'
type SortType = 'newest' | 'oldest' | 'favorites' | 'mostViewed'

export default function SavedNotesContent({ locale }: SavedNotesContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  const { notes: rawNotes, loading, error } = useNotes()
  
  // Convert database notes to display format
  const notes: Note[] = rawNotes.map(note => ({
    id: note.id,
    type: note.type,
    title: note.title,
    preview: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
    content: note.content,
    imageUrl: note.image_url || undefined,
    tags: note.tags || [],
    createdAt: new Date(note.created_at),
    isFavorite: note.is_favorite
  }))

  // Mock data
  const mockNotes: Note[] = [
    {
      id: '1',
      type: 'gratitude',
      title: '가족과의 저녁시간',
      preview: '온 가족이 함께 모여 저녁을 먹으며...',
      content: '오늘 온 가족이 함께 모여 저녁을 먹으며 하루를 나눌 수 있어서 정말 감사합니다.',
      tags: ['가족', '식사', '소통'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isFavorite: true
    },
    {
      id: '2',
      type: 'sermon',
      title: '사랑의 실천 - 마태복음 22장',
      preview: '하나님을 사랑하고 이웃을 사랑하라는...',
      content: '하나님을 사랑하고 이웃을 사랑하라는 예수님의 말씀이 마음에 깊이 새겨졌습니다.',
      tags: ['사랑', '실천', '마태복음'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isFavorite: false
    },
    {
      id: '3',
      type: 'prayer',
      title: '친구의 회복을 위한 기도',
      preview: '아픈 친구의 빠른 회복을 위해...',
      content: '병원에 입원한 친구의 빠른 회복을 위해 기도드립니다. 하나님의 치유의 손길이 함께하시기를 바랍니다.',
      tags: ['치유', '친구', '회복'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      isFavorite: true
    },
    {
      id: '4',
      type: 'gratitude',
      title: '좋은 날씨',
      preview: '맑고 따뜻한 햇살에 감사드립니다...',
      content: '맑고 따뜻한 햇살에 감사드립니다. 산책하기 좋은 날씨입니다.',
      tags: ['날씨', '산책', '자연'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      isFavorite: false
    },
    {
      id: '5',
      type: 'prayer',
      title: '새로운 시작을 위한 기도',
      preview: '새로운 도전을 앞두고 하나님께...',
      content: '새로운 도전을 앞두고 하나님께 지혜와 용기를 구합니다.',
      tags: ['새로운시작', '용기', '지혜'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      isFavorite: false
    },
    {
      id: '6',
      type: 'sermon',
      title: '믿음의 여정 - 히브리서 11장',
      preview: '믿음으로 살아간 믿음의 선조들을...',
      content: '믿음으로 살아간 믿음의 선조들을 통해 우리도 믿음의 여정을 이어가야 함을 배웠습니다.',
      tags: ['믿음', '여정', '히브리서'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      isFavorite: true
    }
  ]


  const filteredAndSortedNotes = notes
    .filter(note => {
      // Filter by type
      if (filter === 'favorites') return note.isFavorite
      if (filter !== 'all' && note.type !== filter) return false
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime()
        case 'favorites':
          if (a.isFavorite && !b.isFavorite) return -1
          if (!a.isFavorite && b.isFavorite) return 1
          return b.createdAt.getTime() - a.createdAt.getTime()
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

  const handleToggleFavorite = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, isFavorite: !note.isFavorite }
        : note
    ))
  }

  const getFilterCount = (filterType: FilterType) => {
    if (filterType === 'all') return notes.length
    if (filterType === 'favorites') return notes.filter(n => n.isFavorite).length
    return notes.filter(n => n.type === filterType).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pb-32">
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            저장된 노트
          </h1>
          <p className="text-gray-500">
            영적 여정을 되돌아보세요
          </p>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-32">
      {/* Modern Header */}
      <div className="pt-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              저장된 노트
            </h1>
            <p className="text-gray-500">
              총 {notes.length}개의 기록
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8 6h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 12h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 6h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="노트 검색..."
          />
          
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체 ({getFilterCount('all')})
            </button>
            <button
              onClick={() => setFilter('gratitude')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'gratitude'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🙏 감사 ({getFilterCount('gratitude')})
            </button>
            <button
              onClick={() => setFilter('sermon')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'sermon'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📖 설교 ({getFilterCount('sermon')})
            </button>
            <button
              onClick={() => setFilter('prayer')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'prayer'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🕊️ 기도 ({getFilterCount('prayer')})
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'favorites'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ⭐ 즐겨찾기 ({getFilterCount('favorites')})
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid/List */}
      {filteredAndSortedNotes.length > 0 ? (
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2' 
            : 'grid-cols-1'
        }`}>
          {filteredAndSortedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => console.log('Open note:', note.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    note.type === 'gratitude' 
                      ? 'bg-green-100 text-green-600' 
                      : note.type === 'sermon'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {note.type === 'gratitude' ? '🙏' : note.type === 'sermon' ? '📖' : '🕊️'}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {note.type === 'gratitude' ? '감사' : note.type === 'sermon' ? '설교' : '기도'}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleFavorite(note.id)
                  }}
                  className={`p-1 rounded-full transition-colors ${
                    note.isFavorite 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  ⭐
                </button>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {note.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {note.preview}
              </p>
              
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{note.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  {new Date(note.createdAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">📝</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? '검색 결과가 없습니다' : '아직 저장된 노트가 없습니다'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? '다른 키워드로 검색해보세요' 
              : '첫 번째 영적 기록을 시작해보세요'
            }
          </p>
          {!searchQuery && (
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
              첫 노트 작성하기
            </button>
          )}
        </div>
      )}
    </div>
  )
}