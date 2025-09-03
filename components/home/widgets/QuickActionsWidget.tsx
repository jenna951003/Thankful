'use client'

import { useTranslation } from '../../../hooks/useTranslation'

interface QuickAction {
  id: string
  icon: string
  label: string
  color: string
  action: () => void
}

export default function QuickActionsWidget() {
  const { t } = useTranslation()

  const quickActions: QuickAction[] = [
    {
      id: 'gratitude',
      icon: '🙏',
      label: '감사 일기',
      color: 'var(--retro-green)',
      action: () => {
        console.log('감사 일기 작성')
        // TODO: 감사 일기 작성 페이지로 이동
      }
    },
    {
      id: 'prayer',
      icon: '🕯️',
      label: '기도 노트',
      color: 'var(--retro-purple)',
      action: () => {
        console.log('기도 노트 작성')
        // TODO: 기도 노트 작성 페이지로 이동
      }
    },
    {
      id: 'sermon',
      icon: '📖',
      label: '묵상 일기',
      color: 'var(--retro-blue)',
      action: () => {
        console.log('묵상 일기 작성')
        // TODO: 묵상 일기 작성 페이지로 이동
      }
    },
    {
      id: 'photo',
      icon: '📷',
      label: '사진 추가',
      color: 'var(--retro-pink)',
      action: () => {
        console.log('사진 추가')
        // TODO: 사진 추가 기능
      }
    }
  ]

  return (
    <div className="retro-card p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 font-jua">빠른 작성</h3>
        <div className="text-lg">⚡</div>
      </div>

      {/* 액션 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="flex flex-col items-center p-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
            style={{ 
              background: `${action.color}15`,
              border: `2px solid ${action.color}30`
            }}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <span 
              className="text-xs font-medium font-noto-serif-kr"
              style={{ color: action.color }}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* 하단 안내 */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center font-noto-serif-kr">
          원하는 유형을 선택해서 빠르게 작성해보세요
        </p>
      </div>
    </div>
  )
}