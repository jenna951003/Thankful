'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import ProfileSection from './ProfileSection'
import SpiritualSettings from './SpiritualSettings'
import InterfaceSettings from './InterfaceSettings'
import PrivacySettings from './PrivacySettings'
import AboutSection from './AboutSection'

interface SettingsContentProps {
  locale: string
}

type SettingsSection = 'profile' | 'spiritual' | 'interface' | 'privacy' | 'about'

export default function SettingsContent({ locale }: SettingsContentProps) {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  const sections = [
    {
      id: 'profile' as SettingsSection,
      title: '프로필',
      subtitle: '계정 정보 및 설정',
      icon: 'user',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 'spiritual' as SettingsSection,
      title: '영적 생활',
      subtitle: '기도시간, 알림, 목표 설정',
      icon: 'heart',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      id: 'interface' as SettingsSection,
      title: '인터페이스',
      subtitle: '테마, 폰트, 언어 설정',
      icon: 'palette',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      id: 'privacy' as SettingsSection,
      title: '개인정보',
      subtitle: '데이터, 백업, 보안',
      icon: 'shield',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      id: 'about' as SettingsSection,
      title: '앱 정보',
      subtitle: '버전, 지원, 피드백',
      icon: 'info',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600'
    }
  ]

  const getIconSvg = (iconName: string) => {
    const iconClasses = "w-5 h-5"
    
    switch (iconName) {
      case 'user':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'heart':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      case 'palette':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v12a4 4 0 01-4 4H7zM7 8h10M7 12h4m-4 4h2" />
          </svg>
        )
      case 'shield':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'info':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection locale={locale} />
      case 'spiritual':
        return <SpiritualSettings locale={locale} />
      case 'interface':
        return <InterfaceSettings locale={locale} />
      case 'privacy':
        return <PrivacySettings locale={locale} />
      case 'about':
        return <AboutSection locale={locale} />
      default:
        return <ProfileSection locale={locale} />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-500">설정을 변경하려면 먼저 로그인해주세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {activeSection === 'profile' ? (
        <div className="px-4 pb-32">
          {/* Modern Header */}
          <div className="pt-8 pb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              설정
            </h1>
            <p className="text-gray-500">
              계정과 앱 환경을 관리하세요
            </p>
          </div>

          {/* Settings Menu */}
          <div className="space-y-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${section.bgColor} rounded-xl flex items-center justify-center ${section.textColor}`}>
                      {getIconSvg(section.icon)}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Back Button & Header */}
          <div className="px-4 pt-8 pb-4 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSection('profile')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {sections.find(s => s.id === activeSection)?.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {sections.find(s => s.id === activeSection)?.subtitle}
                </p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-gray-50">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  )
}