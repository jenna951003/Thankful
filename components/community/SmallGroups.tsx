'use client'

import { useState, useEffect } from 'react'

interface SmallGroup {
  id: string
  name: string
  description: string
  memberCount: number
  maxMembers: number
  isPrivate: boolean
  tags: string[]
  language: string
  activity: 'high' | 'medium' | 'low'
  lastActive: Date
  isJoined: boolean
  hasNewActivity: boolean
}

interface SmallGroupsProps {
  locale: string
}

export default function SmallGroups({ locale }: SmallGroupsProps) {
  const [groups, setGroups] = useState<SmallGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'joined' | 'available'>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const mockGroups: SmallGroup[] = [
    {
      id: '1',
      name: '청년 감사 모임',
      description: '20-30대 청년들이 모여 매일의 감사를 나누는 따뜻한 공간입니다.',
      memberCount: 15,
      maxMembers: 20,
      isPrivate: false,
      tags: ['청년', '감사', '일상'],
      language: '한국어',
      activity: 'high',
      lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
      isJoined: true,
      hasNewActivity: true
    },
    {
      id: '2',
      name: 'Global Prayer Warriors',
      description: 'International prayer group supporting each other in faith journey.',
      memberCount: 45,
      maxMembers: 50,
      isPrivate: false,
      tags: ['prayer', 'international', 'support'],
      language: 'English',
      activity: 'high',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
      isJoined: false,
      hasNewActivity: false
    },
    {
      id: '3',
      name: '말씀 묵상 나눔터',
      description: '매주 정해진 말씀을 함께 묵상하고 은혜를 나누는 소그룹입니다.',
      memberCount: 8,
      maxMembers: 12,
      isPrivate: true,
      tags: ['말씀', '묵상', '나눔'],
      language: '한국어',
      activity: 'medium',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12시간 전
      isJoined: true,
      hasNewActivity: false
    },
    {
      id: '4',
      name: '워킹맘 기도모임',
      description: '직장과 육아를 병행하는 엄마들을 위한 기도와 격려의 모임입니다.',
      memberCount: 23,
      maxMembers: 30,
      isPrivate: false,
      tags: ['워킹맘', '기도', '격려'],
      language: '한국어',
      activity: 'medium',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6시간 전
      isJoined: false,
      hasNewActivity: true
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setGroups(mockGroups)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getFilteredGroups = () => {
    switch (filter) {
      case 'joined':
        return groups.filter(g => g.isJoined)
      case 'available':
        return groups.filter(g => !g.isJoined && g.memberCount < g.maxMembers)
      default:
        return groups
    }
  }

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(g => 
      g.id === groupId 
        ? { ...g, isJoined: true, memberCount: g.memberCount + 1 }
        : g
    ))
  }

  const handleLeaveGroup = (groupId: string) => {
    setGroups(groups.map(g => 
      g.id === groupId 
        ? { ...g, isJoined: false, memberCount: g.memberCount - 1 }
        : g
    ))
  }

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'high': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'high': return '활발'
      case 'medium': return '보통'
      case 'low': return '조용'
      default: return '보통'
    }
  }

  const formatLastActive = (date: Date) => {
    const hours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return '방금 전'
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    return `${days}일 전`
  }

  const filteredGroups = getFilteredGroups()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-20 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold font-jua mb-2">
          👥 소그룹 커뮤니티
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold">{groups.length}</div>
            <div className="text-xs opacity-80">전체 그룹</div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {groups.filter(g => g.isJoined).length}
            </div>
            <div className="text-xs opacity-80">참여 중</div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {groups.reduce((sum, g) => sum + g.memberCount, 0)}
            </div>
            <div className="text-xs opacity-80">전체 멤버</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: '전체 그룹', icon: '👥' },
          { id: 'joined', label: '참여 중', icon: '✅' },
          { id: 'available', label: '참여 가능', icon: '🚪' }
        ].map(option => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
              filter === option.id
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md'
                : 'bg-white/90 text-gray-600 hover:bg-white border border-white/50'
            }`}
          >
            <span className="text-sm">{option.icon}</span>
            <span className="text-sm">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Create Group Button */}
      <button
        onClick={() => setShowCreateForm(true)}
        className="w-full p-4 bg-white/90 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50/50 transition-all duration-200"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">➕</span>
          <span className="font-medium font-jua">새 소그룹 만들기</span>
        </div>
        <p className="text-sm mt-1 font-hubballi">
          같은 관심사를 가진 사람들과 함께하세요
        </p>
      </button>

      {/* Groups List */}
      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className={`bg-white/90 rounded-2xl p-4 border-l-4 hover:shadow-md transition-all duration-200 ${
              group.isJoined ? 'border-l-purple-400 bg-purple-50/30' : 'border-l-gray-300'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold font-jua text-gray-800 text-base">
                    {group.name}
                  </h4>
                  {group.isPrivate && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      🔒 비공개
                    </span>
                  )}
                  {group.hasNewActivity && (
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2 font-hubballi">
                  {group.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {group.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-4">
                <span>👥 {group.memberCount}/{group.maxMembers}</span>
                <span>🌐 {group.language}</span>
                <span className={`px-2 py-1 rounded-full ${getActivityColor(group.activity)}`}>
                  {getActivityLabel(group.activity)}
                </span>
              </div>
              <span>{formatLastActive(group.lastActive)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {group.isJoined ? (
                <>
                  <button
                    onClick={() => handleLeaveGroup(group.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    그룹 나가기
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl text-sm font-medium hover:shadow-md transition-shadow">
                    그룹 채팅 열기
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={group.memberCount >= group.maxMembers}
                  className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    group.memberCount >= group.maxMembers
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:shadow-md'
                  }`}
                >
                  {group.memberCount >= group.maxMembers ? '정원 마감' : '그룹 참여하기'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-500 font-hubballi">
            {filter === 'joined' ? '참여한 그룹이 없습니다' : '해당 조건의 그룹이 없습니다'}
          </p>
        </div>
      )}

      {/* Create Group Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateForm(false)}
          />
          <div className="relative w-full bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-jua text-gray-800">
                새 소그룹 만들기
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="그룹 이름"
                className="w-full p-3 bg-gray-50 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-purple-300 font-jua"
              />
              
              <textarea
                placeholder="그룹 설명"
                className="w-full h-24 p-3 bg-gray-50 rounded-2xl border-none resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 font-hubballi"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
              >
                그룹 만들기
              </button>
            </div>
            
            <div style={{ height: 'var(--actual-safe-bottom)' }} />
          </div>
        </div>
      )}
    </div>
  )
}