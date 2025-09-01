'use client'

import { useState, useEffect } from 'react'

interface PrayerRequest {
  id: string
  content: string
  category: 'healing' | 'family' | 'work' | 'spiritual' | 'world'
  country: string
  timeAgo: string
  prayerCount: number
  hasPrayed: boolean
  isUrgent: boolean
}

interface PrayerCircleProps {
  locale: string
}

export default function PrayerCircle({ locale }: PrayerCircleProps) {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<'all' | PrayerRequest['category']>('all')
  const [showAddForm, setShowAddForm] = useState(false)

  const categories = [
    { id: 'all', label: '전체', icon: '🙏', color: 'from-blue-500 to-indigo-600' },
    { id: 'healing', label: '치유', icon: '💚', color: 'from-green-500 to-emerald-600' },
    { id: 'family', label: '가족', icon: '👨‍👩‍👧‍👦', color: 'from-orange-500 to-red-600' },
    { id: 'work', label: '직장', icon: '💼', color: 'from-purple-500 to-violet-600' },
    { id: 'spiritual', label: '영적성장', icon: '✨', color: 'from-pink-500 to-rose-600' },
    { id: 'world', label: '세상', icon: '🌍', color: 'from-teal-500 to-cyan-600' }
  ]

  const mockPrayerRequests: PrayerRequest[] = [
    {
      id: '1',
      content: '어머니의 수술이 잘 되도록 기도 부탁드립니다. 하나님의 치유하심이 함께하시길 바랍니다.',
      category: 'healing',
      country: '🇰🇷 한국',
      timeAgo: '10분 전',
      prayerCount: 23,
      hasPrayed: false,
      isUrgent: true
    },
    {
      id: '2',
      content: '새로운 직장에서의 적응과 동료들과의 좋은 관계를 위해 기도해 주세요.',
      category: 'work',
      country: '🇺🇸 미국',
      timeAgo: '1시간 전',
      prayerCount: 15,
      hasPrayed: true,
      isUrgent: false
    },
    {
      id: '3',
      content: '우크라이나의 평화와 난민들의 안전을 위해 기도합니다.',
      category: 'world',
      country: '🇺🇦 우크라이나',
      timeAgo: '3시간 전',
      prayerCount: 847,
      hasPrayed: false,
      isUrgent: true
    },
    {
      id: '4',
      content: '신앙생활의 침체기를 벗어나 다시 하나님과 가까워지도록 기도 부탁드립니다.',
      category: 'spiritual',
      country: '🇯🇵 일본',
      timeAgo: '5시간 전',
      prayerCount: 34,
      hasPrayed: true,
      isUrgent: false
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setPrayerRequests(mockPrayerRequests)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredRequests = activeCategory === 'all' 
    ? prayerRequests 
    : prayerRequests.filter(req => req.category === activeCategory)

  const handlePray = (requestId: string) => {
    setPrayerRequests(requests =>
      requests.map(req =>
        req.id === requestId
          ? {
              ...req,
              hasPrayed: !req.hasPrayed,
              prayerCount: req.hasPrayed ? req.prayerCount - 1 : req.prayerCount + 1
            }
          : req
      )
    )
  }

  const getCategoryConfig = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0]
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map(i => (
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
      {/* Live Prayer Status */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-jua mb-1">
              🌍 24시간 기도 릴레이
            </h3>
            <p className="text-sm opacity-90 font-hubballi">
              전 세계가 시차별로 기도하고 있습니다
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="text-xs opacity-80">LIVE</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold">156</div>
            <div className="text-xs opacity-80">현재 기도 중</div>
          </div>
          <div>
            <div className="text-xl font-bold">2,340</div>
            <div className="text-xs opacity-80">오늘 기도한 사람</div>
          </div>
          <div>
            <div className="text-xl font-bold">12</div>
            <div className="text-xs opacity-80">응답 간증</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                : 'bg-white/90 text-gray-600 hover:bg-white border border-white/50'
            }`}
          >
            <span className="text-sm">{category.icon}</span>
            <span className="text-sm">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Add Prayer Request Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="w-full p-4 bg-white/90 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">🙏</span>
          <span className="font-medium font-jua">기도 제목 나누기</span>
        </div>
        <p className="text-sm mt-1 font-hubballi">
          익명으로 기도 제목을 올려보세요
        </p>
      </button>

      {/* Prayer Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const categoryConfig = getCategoryConfig(request.category)
          return (
            <div
              key={request.id}
              className={`bg-white/90 rounded-2xl p-4 border-l-4 hover:shadow-md transition-all duration-200 ${
                request.isUrgent ? 'border-l-red-400 bg-red-50/50' : 'border-l-blue-400'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryConfig.icon}</span>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {categoryConfig.label}
                  </span>
                  {request.isUrgent && (
                    <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-600 rounded-full">
                      긴급
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {request.country} • {request.timeAgo}
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-4 font-noto-serif-kr leading-relaxed">
                {request.content}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>🤲</span>
                  <span>{request.prayerCount}명이 기도했습니다</span>
                </div>
                
                <button
                  onClick={() => handlePray(request.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                    request.hasPrayed
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                  }`}
                >
                  <span className="text-base">🙏</span>
                  <span>{request.hasPrayed ? '기도했음' : '함께 기도'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Prayer Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddForm(false)}
          />
          <div className="relative w-full bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-jua text-gray-800">
                기도 제목 나누기
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <textarea
              placeholder="기도 제목을 익명으로 나눠보세요. 전 세계 기독교인들이 함께 기도할 것입니다."
              className="w-full h-32 p-4 bg-gray-50 rounded-2xl border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 font-hubballi"
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
              >
                기도 제목 올리기
              </button>
            </div>
            
            <div style={{ height: 'var(--actual-safe-bottom)' }} />
          </div>
        </div>
      )}
    </div>
  )
}