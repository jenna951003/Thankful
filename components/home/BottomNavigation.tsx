'use client'

import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useTranslation } from '../../hooks/useTranslation'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

interface NavItem {
  id: string
  icon: string
  label: string
  activeColor: string
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { safeArea } = useDeviceDetection()
  const { t } = useTranslation()

  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: '🏠',
      label: t('navigation.home'),
      activeColor: 'var(--retro-blue)'
    },
    {
      id: 'write',
      icon: '✍️',
      label: t('navigation.write'),
      activeColor: 'var(--retro-green)'
    },
    {
      id: 'saved',
      icon: '💾',
      label: t('navigation.saved'),
      activeColor: 'var(--retro-purple)'
    },
    {
      id: 'stats',
      icon: '📊',
      label: t('navigation.stats'),
      activeColor: 'var(--retro-pink)'
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: t('navigation.settings'),
      activeColor: 'var(--retro-orange)'
    }
  ]

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t border-gray-200/50 z-40"
      style={{
        background: 'rgba(238, 234, 217, 0.95)',
        paddingBottom: `${safeArea.bottom}px`
      }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center p-2 min-w-[60px] transition-all duration-200
                ${isActive ? 'transform scale-110' : 'hover:scale-105 active:scale-95'}
              `}
            >
              {/* 아이콘 */}
              <div 
                className={`
                  text-2xl mb-1 transition-all duration-200 
                  ${isActive ? 'filter drop-shadow-md' : ''}
                `}
                style={{
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)'
                }}
              >
                {item.icon}
              </div>
              
              {/* 라벨 */}
              <span 
                className={`
                  text-xs font-medium transition-all duration-200 font-noto-serif-kr
                  ${isActive ? 'font-bold' : 'text-gray-600'}
                `}
                style={{
                  color: isActive ? item.activeColor : undefined
                }}
              >
                {item.label}
              </span>

              {/* 액티브 인디케이터 */}
              {isActive && (
                <div 
                  className="absolute top-0 w-8 h-1 rounded-full transition-all duration-300"
                  style={{ backgroundColor: item.activeColor }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}