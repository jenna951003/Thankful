'use client'

import { useState, useEffect } from 'react'

interface Template {
  id: string
  name: string
  description: string
  type: 'gratitude' | 'sermon' | 'prayer'
  author: string
  downloads: number
  rating: number
  previewImage: string
  tags: string[]
  isDownloaded: boolean
  isFeatured: boolean
  createdAt: Date
}

interface TemplateExchangeProps {
  locale: string
}

export default function TemplateExchange({ locale }: TemplateExchangeProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'featured' | 'popular' | 'recent' | 'gratitude' | 'sermon' | 'prayer'>('featured')

  const mockTemplates: Template[] = [
    {
      id: '1',
      name: '감사 일기 템플릿',
      description: '매일의 감사를 아름답게 기록할 수 있는 템플릿입니다.',
      type: 'gratitude',
      author: '익명',
      downloads: 1247,
      rating: 4.8,
      previewImage: '/api/placeholder/200/150',
      tags: ['감사', '일상', '하트'],
      isDownloaded: false,
      isFeatured: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
    },
    {
      id: '2',
      name: '설교 노트 템플릿',
      description: '말씀을 체계적으로 정리할 수 있는 클래식한 템플릿입니다.',
      type: 'sermon',
      author: '익명',
      downloads: 856,
      rating: 4.6,
      previewImage: '/api/placeholder/200/150',
      tags: ['설교', '말씀', '노트'],
      isDownloaded: true,
      isFeatured: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
    },
    {
      id: '3',
      name: '기도 제목 리스트',
      description: '기도 제목을 카테고리별로 정리하는 깔끔한 템플릿입니다.',
      type: 'prayer',
      author: '익명',
      downloads: 634,
      rating: 4.9,
      previewImage: '/api/placeholder/200/150',
      tags: ['기도', '리스트', '정리'],
      isDownloaded: false,
      isFeatured: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
    },
    {
      id: '4',
      name: '미니멀 감사 카드',
      description: '간단하고 깔끔한 미니멀 스타일의 감사 템플릿입니다.',
      type: 'gratitude',
      author: '익명',
      downloads: 423,
      rating: 4.7,
      previewImage: '/api/placeholder/200/150',
      tags: ['미니멀', '심플', '감사'],
      isDownloaded: false,
      isFeatured: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setTemplates(mockTemplates)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getFilteredTemplates = () => {
    let filtered = [...templates]
    
    switch (filter) {
      case 'featured':
        filtered = filtered.filter(t => t.isFeatured)
        break
      case 'popular':
        filtered = filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case 'recent':
        filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'gratitude':
      case 'sermon':
      case 'prayer':
        filtered = filtered.filter(t => t.type === filter)
        break
    }
    
    return filtered
  }

  const handleDownload = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId 
        ? { ...t, isDownloaded: true, downloads: t.downloads + 1 }
        : t
    ))
  }

  const getTypeConfig = (type: string) => {
    const configs = {
      gratitude: { icon: '🙏', label: '감사', color: 'text-green-600 bg-green-50' },
      sermon: { icon: '📖', label: '설교', color: 'text-orange-600 bg-orange-50' },
      prayer: { icon: '🕊️', label: '기도', color: 'text-blue-600 bg-blue-50' }
    }
    return configs[type as keyof typeof configs]
  }

  const filteredTemplates = getFilteredTemplates()

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
              <div className="w-full h-32 bg-gray-200"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold font-jua mb-2">
          🎨 템플릿 마켓플레이스
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold">{templates.length}</div>
            <div className="text-xs opacity-80">템플릿</div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {templates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}
            </div>
            <div className="text-xs opacity-80">다운로드</div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {Math.round(templates.reduce((sum, t) => sum + t.rating, 0) / templates.length * 10) / 10}
            </div>
            <div className="text-xs opacity-80">평균 평점</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'featured', label: '추천', icon: '⭐' },
          { id: 'popular', label: '인기', icon: '🔥' },
          { id: 'recent', label: '최신', icon: '🆕' },
          { id: 'gratitude', label: '감사', icon: '🙏' },
          { id: 'sermon', label: '설교', icon: '📖' },
          { id: 'prayer', label: '기도', icon: '🕊️' }
        ].map(option => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
              filter === option.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'bg-white/90 text-gray-600 hover:bg-white border border-white/50'
            }`}
          >
            <span className="text-sm">{option.icon}</span>
            <span className="text-sm">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map((template) => {
            const typeConfig = getTypeConfig(template.type)
            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Preview Image */}
                <div className="relative">
                  <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-3xl">{typeConfig.icon}</div>
                  </div>
                  
                  {/* Featured Badge */}
                  {template.isFeatured && (
                    <div className="absolute top-2 left-2">
                      <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        ⭐ 추천
                      </span>
                    </div>
                  )}

                  {/* Downloaded Badge */}
                  {template.isDownloaded && (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        ✓ 다운로드됨
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-jua text-gray-800 text-sm flex-1 truncate">
                      {template.name}
                    </h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3 font-hubballi">
                    {template.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-2">
                      <span>⭐ {template.rating}</span>
                      <span>📥 {template.downloads}</span>
                    </div>
                  </div>
                  
                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(template.id)}
                    disabled={template.isDownloaded}
                    className={`w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      template.isDownloaded
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-md'
                    }`}
                  >
                    {template.isDownloaded ? '다운로드 완료' : '무료 다운로드'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🎨</div>
          <p className="text-gray-500 font-hubballi">
            해당 카테고리의 템플릿이 아직 없습니다
          </p>
        </div>
      )}

      {/* Upload Your Template */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
        <div className="text-center">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="text-lg font-bold font-jua text-gray-800 mb-2">
            나만의 템플릿을 공유해보세요
          </h3>
          <p className="text-sm text-gray-600 font-hubballi mb-4">
            창의적인 템플릿을 만들어서 전 세계 사용자들과 나눠보세요
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow">
            템플릿 업로드하기
          </button>
        </div>
      </div>
    </div>
  )
}