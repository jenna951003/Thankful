'use client'

import { useState } from 'react'

interface InterfaceSettingsProps {
  locale: string
}

export default function InterfaceSettings({ locale }: InterfaceSettingsProps) {
  const [settings, setSettings] = useState({
    theme: 'light' as 'light' | 'dark' | 'auto',
    primaryFont: 'jua',
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    language: 'ko',
    accentColor: 'blue',
    animations: true,
    reducedMotion: false,
    highContrast: false,
    colorBlindFriendly: false
  })

  const themes = [
    { id: 'light', name: '라이트 모드', icon: '☀️' },
    { id: 'dark', name: '다크 모드', icon: '🌙' },
    { id: 'auto', name: '시스템 설정', icon: '🔄' }
  ]

  const fonts = [
    { id: 'jua', name: 'Jua (한글 기본)', preview: '안녕하세요! Hello!' },
    { id: 'noto-serif-kr', name: 'Noto Serif KR', preview: '고전적인 세리프 서체' },
    { id: 'dongle', name: 'Dongle (캐주얼)', preview: '편안한 손글씨 느낌' },
    { id: 'hubballi', name: 'Hubballi (영문)', preview: 'Casual English Font' }
  ]

  const languages = [
    { id: 'ko', name: '한국어', flag: '🇰🇷' },
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'pt', name: 'Português', flag: '🇧🇷' }
  ]

  const accentColors = [
    { id: 'blue', name: '파란색', color: 'bg-blue-500', preview: 'from-blue-400 to-indigo-500' },
    { id: 'green', name: '초록색', color: 'bg-green-500', preview: 'from-green-400 to-emerald-500' },
    { id: 'purple', name: '보라색', color: 'bg-purple-500', preview: 'from-purple-400 to-violet-500' },
    { id: 'pink', name: '핑크색', color: 'bg-pink-500', preview: 'from-pink-400 to-rose-500' },
    { id: 'orange', name: '주황색', color: 'bg-orange-500', preview: 'from-orange-400 to-red-500' }
  ]

  const fontSizes = [
    { id: 'small', name: '작게', size: 'text-sm' },
    { id: 'medium', name: '보통', size: 'text-base' },
    { id: 'large', name: '크게', size: 'text-lg' }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-jua text-gray-800 mb-2">
          인터페이스 설정
        </h2>
        <p className="text-sm text-gray-600 font-hubballi">
          앱의 모양과 느낌을 개인화해보세요
        </p>
      </div>

      {/* Theme Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          🎨 테마
        </h3>
        
        <div className="grid gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSettings({ ...settings, theme: theme.id as any })}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                settings.theme === theme.id
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="text-2xl">{theme.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-800">{theme.name}</div>
              </div>
              {settings.theme === theme.id && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          ✍️ 폰트
        </h3>
        
        <div className="space-y-3">
          {fonts.map((font) => (
            <button
              key={font.id}
              onClick={() => setSettings({ ...settings, primaryFont: font.id })}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                settings.primaryFont === font.id
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{font.name}</span>
                {settings.primaryFont === font.id && (
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </div>
              <div className={`text-sm text-gray-600 font-${font.id}`}>
                {font.preview}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          📏 글자 크기
        </h3>
        
        <div className="flex gap-3">
          {fontSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setSettings({ ...settings, fontSize: size.id as any })}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                settings.fontSize === size.id
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-medium ${size.size}`}>
                {size.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          🌍 언어
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSettings({ ...settings, language: lang.id })}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                settings.language === lang.id
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium text-gray-800 flex-1 text-left">
                {lang.name}
              </span>
              {settings.language === lang.id && (
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          🎯 강조 색상
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSettings({ ...settings, accentColor: color.id })}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                settings.accentColor === color.id
                  ? 'border-gray-400'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${color.preview} mb-2`}></div>
              <div className="text-sm font-medium text-gray-800">
                {color.name}
              </div>
              {settings.accentColor === color.id && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-jua text-gray-800">
          ♿ 접근성
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 bg-blue-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">애니메이션</div>
              <div className="text-sm text-gray-600">부드러운 전환 효과</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => setSettings({ ...settings, animations: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 bg-green-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">동작 줄이기</div>
              <div className="text-sm text-gray-600">멀미 방지 모드</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => setSettings({ ...settings, reducedMotion: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 bg-purple-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">고대비 모드</div>
              <div className="text-sm text-gray-600">시력이 불편한 분들을 위한 모드</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => setSettings({ ...settings, highContrast: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 bg-orange-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">색맹 친화 모드</div>
              <div className="text-sm text-gray-600">색상 구분이 어려운 분들을 위한 모드</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.colorBlindFriendly}
                onChange={(e) => setSettings({ ...settings, colorBlindFriendly: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}