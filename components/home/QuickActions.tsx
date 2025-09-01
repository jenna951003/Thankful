'use client'

import { useRouter } from 'next/navigation'

interface QuickActionsProps {
  locale: string
}

export default function QuickActions({ locale }: QuickActionsProps) {
  const router = useRouter()

  const quickActions = [
    {
      id: 'quick-gratitude',
      title: '빠른 감사',
      subtitle: '지금 감사한 일',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-500',
      action: () => router.push(`/${locale}/create/gratitude?quick=true`)
    },
    {
      id: 'voice-prayer',
      title: '음성 기도',
      subtitle: '소리내어 기도',
      icon: '🎙️',
      color: 'from-purple-400 to-pink-500',
      action: () => router.push(`/${locale}/create/prayer?voice=true`)
    },
    {
      id: 'share-testimony',
      title: '간증 나눔',
      subtitle: '믿음의 경험',
      icon: '✨',
      color: 'from-emerald-400 to-teal-500',
      action: () => router.push(`/${locale}/community/testimony`)
    },
    {
      id: 'find-community',
      title: '기도 친구',
      subtitle: '함께 기도할 사람',
      icon: '🤝',
      color: 'from-blue-400 to-indigo-500',
      action: () => router.push(`/${locale}/community/prayer-circle`)
    }
  ]

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-white/50">
      <h3 className="text-lg font-bold font-jua text-gray-800 mb-4">
        빠른 실행
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`bg-gradient-to-r ${action.color} rounded-xl p-4 text-white text-left hover:scale-105 transition-transform duration-200 shadow-lg`}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <h4 className="font-semibold font-jua text-sm mb-1">
              {action.title}
            </h4>
            <p className="text-xs opacity-90 font-hubballi">
              {action.subtitle}
            </p>
          </button>
        ))}
      </div>

      {/* Inspirational Quote */}
      <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <p className="text-sm text-gray-700 text-center font-noto-serif-kr italic">
          "작은 일상 속에서도 하나님의 사랑을 발견하며 감사하는 마음을 가지세요"
        </p>
      </div>
    </div>
  )
}