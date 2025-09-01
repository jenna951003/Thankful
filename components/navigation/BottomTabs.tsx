'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface TabItem {
  id: string
  icon: string
  label: string
  path: string
  isMainAction?: boolean
}

interface BottomTabsProps {
  locale: string
}

const tabs: TabItem[] = [
  {
    id: 'home',
    icon: 'home',
    label: '홈',
    path: '/home'
  },
  {
    id: 'saved',
    icon: 'bookmark',
    label: '저장됨',
    path: '/saved'
  },
  {
    id: 'create',
    icon: 'plus',
    label: '작성',
    path: '/create',
    isMainAction: true
  },
  {
    id: 'community',
    icon: 'users',
    label: '커뮤니티',
    path: '/community'
  },
  {
    id: 'settings',
    icon: 'settings',
    label: '설정',
    path: '/settings'
  }
]

const getIconSvg = (iconName: string, isActive: boolean) => {
  const color = isActive ? '#3b82f6' : '#9ca3af'
  
  switch (iconName) {
    case 'home':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'bookmark':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'plus':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'users':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'settings':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2569 9.77251 19.9859C9.5799 19.7148 9.31074 19.5067 9 19.39C8.69838 19.2569 8.36381 19.2172 8.03941 19.276C7.71502 19.3348 7.41568 19.4895 7.18 19.72L7.12 19.78C6.93425 19.966 6.71368 20.1135 6.47088 20.2141C6.22808 20.3148 5.96783 20.3666 5.705 20.3666C5.44217 20.3666 5.18192 20.3148 4.93912 20.2141C4.69632 20.1135 4.47575 19.966 4.29 19.78C4.10405 19.5943 3.95653 19.3737 3.85588 19.1309C3.75523 18.8881 3.70343 18.6278 3.70343 18.365C3.70343 18.1022 3.75523 17.8419 3.85588 17.5991C3.95653 17.3563 4.10405 17.1357 4.29 16.95L4.35 16.89C4.58054 16.6543 4.73519 16.355 4.794 16.0306C4.85282 15.7062 4.81312 15.3716 4.68 15.07C4.55324 14.7742 4.34276 14.522 4.07447 14.3443C3.80618 14.1666 3.49179 14.0713 3.17 14.07H3C2.46957 14.07 1.96086 13.8593 1.58579 13.4842C1.21071 13.1091 1 12.6004 1 12.07C1 11.5396 1.21071 11.0309 1.58579 10.6558C1.96086 10.2807 2.46957 10.07 3 10.07H3.09C3.42099 10.0623 3.742 9.95512 4.01309 9.76251C4.28418 9.5699 4.49226 9.30074 4.61 8.99C4.74312 8.68838 4.78282 8.35381 4.724 8.02941C4.66519 7.70502 4.51054 7.40568 4.28 7.17L4.22 7.11C4.03405 6.92425 3.88653 6.70368 3.78588 6.46088C3.68523 6.21808 3.63343 5.95783 3.63343 5.695C3.63343 5.43217 3.68523 5.17192 3.78588 4.92912C3.88653 4.68632 4.03405 4.46575 4.22 4.28C4.40575 4.09405 4.62632 3.94653 4.86912 3.84588C5.11192 3.74523 5.37217 3.69343 5.635 3.69343C5.89783 3.69343 6.15808 3.74523 6.40088 3.84588C6.64368 3.94653 6.86425 4.09405 7.05 4.28L7.11 4.34C7.34568 4.57054 7.64502 4.72519 7.96941 4.784C8.29381 4.84282 8.62838 4.80312 8.93 4.67H9C9.29577 4.54324 9.54802 4.33276 9.72569 4.06447C9.90337 3.79618 9.99872 3.48179 10 3.16V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return null
  }
}

export default function BottomTabs({ locale }: BottomTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const currentTab = tabs.find(tab => pathname.includes(tab.path))?.id || 'home'

  const handleTabPress = (tab: TabItem) => {
    if (tab.isMainAction) {
      setShowCreateModal(true)
    } else {
      router.push(`/${locale}${tab.path}`)
    }
  }

  const handleCreateModalClose = () => {
    setShowCreateModal(false)
  }

  const handleCreateOption = (type: 'gratitude' | 'sermon' | 'prayer') => {
    setShowCreateModal(false)
    router.push(`/${locale}/create/${type}`)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Safe Zone Bottom Padding */}
        <div style={{ height: 'var(--actual-safe-bottom)' }} className="bg-white/95 backdrop-blur-xl" />
        
        {/* Navigation Bar */}
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between relative max-w-md mx-auto">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id
              const isMainAction = tab.isMainAction
              
              if (isMainAction) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabPress(tab)}
                    className="absolute left-1/2 -top-6 transform -translate-x-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {getIconSvg(tab.icon, false)}
                  </button>
                )
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabPress(tab)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {getIconSvg(tab.icon, isActive)}
                  <span className="text-xs font-medium">
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCreateModalClose}
          />
          <div className="relative w-full bg-white rounded-t-3xl p-6 transform transition-transform duration-300 ease-out animate-slide-up">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-jua text-gray-800">
                새로운 기록 만들기
              </h2>
              <button
                onClick={handleCreateModalClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Create Options */}
            <div className="grid gap-4">
              <button
                onClick={() => handleCreateOption('gratitude')}
                className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                  🙏
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold font-jua text-gray-800">
                    감사 노트
                  </h3>
                  <p className="text-sm text-gray-600 font-hubballi">
                    오늘의 감사한 일을 기록해보세요
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleCreateOption('sermon')}
                className="flex items-center p-4 bg-gradient-to-r from-coral-50 to-orange-50 rounded-2xl border border-coral-100 hover:from-coral-100 hover:to-orange-100 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                  📖
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold font-jua text-gray-800">
                    설교 노트
                  </h3>
                  <p className="text-sm text-gray-600 font-hubballi">
                    말씀을 마음에 새겨보세요
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleCreateOption('prayer')}
                className="flex items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 hover:from-teal-100 hover:to-cyan-100 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                  🕊️
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold font-jua text-gray-800">
                    기도 노트
                  </h3>
                  <p className="text-sm text-gray-600 font-hubballi">
                    기도제목과 응답을 기록해보세요
                  </p>
                </div>
              </button>
            </div>

            {/* Safe Zone Bottom */}
            <div style={{ height: 'var(--actual-safe-bottom)' }} />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}