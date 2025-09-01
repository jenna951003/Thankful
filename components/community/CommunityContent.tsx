'use client'

import { useState, useEffect } from 'react'
import InspirationGallery from './InspirationGallery'
import PrayerCircle from './PrayerCircle'
import TemplateExchange from './TemplateExchange'
import SmallGroups from './SmallGroups'

interface CommunityContentProps {
  locale: string
}

type CommunityTab = 'inspiration' | 'prayer' | 'templates' | 'groups'

export default function CommunityContent({ locale }: CommunityContentProps) {
  const [activeTab, setActiveTab] = useState<CommunityTab>('inspiration')
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check online status
    const handleOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  const communityTabs = [
    {
      id: 'inspiration' as CommunityTab,
      title: '영감 갤러리',
      subtitle: '아름다운 노트들',
      icon: '✨',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'prayer' as CommunityTab,
      title: '기도 서클',
      subtitle: '함께 기도해요',
      icon: '🤲',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'templates' as CommunityTab,
      title: '템플릿 나눔',
      subtitle: '창의적인 아이디어',
      icon: '🎨',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'groups' as CommunityTab,
      title: '소그룹',
      subtitle: '우리만의 공간',
      icon: '👥',
      color: 'from-purple-400 to-violet-500'
    }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'inspiration':
        return <InspirationGallery locale={locale} />
      case 'prayer':
        return <PrayerCircle locale={locale} />
      case 'templates':
        return <TemplateExchange locale={locale} />
      case 'groups':
        return <SmallGroups locale={locale} />
      default:
        return <InspirationGallery locale={locale} />
    }
  }

  if (!isOnline) {
    return (
      <div className="px-6 pb-32">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📡</div>
          <h2 className="text-2xl font-bold font-jua text-gray-800 mb-2">
            인터넷 연결이 필요합니다
          </h2>
          <p className="text-gray-600 font-hubballi mb-6">
            커뮤니티 기능을 사용하려면 인터넷에 연결해주세요
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 pb-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-jua text-gray-800 mb-2">
          신앙 커뮤니티
        </h1>
        <p className="text-gray-600 font-hubballi">
          전 세계 기독교인들과 영적 여정을 나누세요
        </p>
        
        {/* Global Status */}
        <div className="flex items-center gap-4 mt-4 p-3 bg-white/70 rounded-xl border border-white/50">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">온라인</span>
          </div>
          <div className="text-sm text-gray-600">
            🌍 현재 <span className="font-semibold">1,247명</span>이 함께하고 있어요
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-3">
          {communityTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white border-transparent shadow-lg`
                  : 'bg-white/90 text-gray-700 border-white/50 hover:border-white/80 hover:shadow-md'
              }`}
            >
              <div className="text-2xl mb-2">{tab.icon}</div>
              <h3 className="font-bold font-jua text-sm mb-1">
                {tab.title}
              </h3>
              <p className={`text-xs font-hubballi ${
                activeTab === tab.id ? 'text-white/90' : 'text-gray-500'
              }`}>
                {tab.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  )
}