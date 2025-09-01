'use client'

import { useState } from 'react'

interface SpiritualSettingsProps {
  locale: string
}

export default function SpiritualSettings({ locale }: SpiritualSettingsProps) {
  const [settings, setSettings] = useState({
    dailyReminder: {
      enabled: true,
      time: '09:00',
      message: '오늘도 감사한 마음으로 시작해보세요!'
    },
    prayerTimes: [
      { id: 1, time: '07:00', label: '아침 기도', enabled: true },
      { id: 2, time: '12:00', label: '점심 기도', enabled: false },
      { id: 3, time: '21:00', label: '저녁 기도', enabled: true }
    ],
    weeklyGoals: {
      gratitude: 7,
      sermon: 2,
      prayer: 5
    },
    bibleTranslation: 'niv',
    churchIntegration: {
      enabled: false,
      churchName: '',
      pastorName: ''
    },
    streakMotivation: true,
    communitySharing: {
      autoShare: false,
      shareAnonymously: true
    }
  })

  const bibleTranslations = [
    { id: 'niv', name: '개역개정' },
    { id: 'nlt', name: '새번역' },
    { id: 'esv', name: '공동번역' },
    { id: 'msg', name: '현대어성경' }
  ]

  const togglePrayerTime = (id: number) => {
    setSettings({
      ...settings,
      prayerTimes: settings.prayerTimes.map(pt =>
        pt.id === id ? { ...pt, enabled: !pt.enabled } : pt
      )
    })
  }

  const updateWeeklyGoal = (type: 'gratitude' | 'sermon' | 'prayer', value: number) => {
    setSettings({
      ...settings,
      weeklyGoals: {
        ...settings.weeklyGoals,
        [type]: value
      }
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-jua text-gray-800 mb-2">
          영적 생활 설정
        </h2>
        <p className="text-sm text-gray-600 font-hubballi">
          신앙 생활을 더욱 풍성하게 만들어보세요
        </p>
      </div>

      {/* Daily Reminder */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          📅 매일 알림
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 bg-blue-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">일일 알림</div>
              <div className="text-sm text-gray-600">{settings.dailyReminder.time}에 알림</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dailyReminder.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  dailyReminder: { ...settings.dailyReminder, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {settings.dailyReminder.enabled && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <label className="text-sm font-medium text-gray-700">알림 시간:</label>
                <input
                  type="time"
                  value={settings.dailyReminder.time}
                  onChange={(e) => setSettings({
                    ...settings,
                    dailyReminder: { ...settings.dailyReminder, time: e.target.value }
                  })}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              
              <textarea
                value={settings.dailyReminder.message}
                onChange={(e) => setSettings({
                  ...settings,
                  dailyReminder: { ...settings.dailyReminder, message: e.target.value }
                })}
                placeholder="알림 메시지를 입력하세요"
                className="w-full h-20 p-3 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Prayer Times */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          🕐 기도 시간
        </h3>
        
        <div className="space-y-3">
          {settings.prayerTimes.map((prayerTime) => (
            <div
              key={prayerTime.id}
              className={`flex items-center justify-between py-3 px-4 rounded-xl transition-colors ${
                prayerTime.enabled ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{prayerTime.enabled ? '🕊️' : '⏰'}</span>
                <div>
                  <div className="font-medium text-gray-800">{prayerTime.label}</div>
                  <div className="text-sm text-gray-600">{prayerTime.time}</div>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={prayerTime.enabled}
                  onChange={() => togglePrayerTime(prayerTime.id)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  prayerTime.enabled ? 'bg-green-600' : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          🎯 주간 목표
        </h3>
        
        <div className="space-y-4">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800 flex items-center gap-2">
                🙏 감사 노트
              </span>
              <span className="text-sm text-green-600 font-bold">
                주 {settings.weeklyGoals.gratitude}회
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              value={settings.weeklyGoals.gratitude}
              onChange={(e) => updateWeeklyGoal('gratitude', parseInt(e.target.value))}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800 flex items-center gap-2">
                📖 설교 노트
              </span>
              <span className="text-sm text-orange-600 font-bold">
                주 {settings.weeklyGoals.sermon}회
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              value={settings.weeklyGoals.sermon}
              onChange={(e) => updateWeeklyGoal('sermon', parseInt(e.target.value))}
              className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800 flex items-center gap-2">
                🕊️ 기도 노트
              </span>
              <span className="text-sm text-blue-600 font-bold">
                주 {settings.weeklyGoals.prayer}회
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              value={settings.weeklyGoals.prayer}
              onChange={(e) => updateWeeklyGoal('prayer', parseInt(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bible Translation */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          📖 성경 번역본
        </h3>
        
        <select
          value={settings.bibleTranslation}
          onChange={(e) => setSettings({ ...settings, bibleTranslation: e.target.value })}
          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {bibleTranslations.map(translation => (
            <option key={translation.id} value={translation.id}>
              {translation.name}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-jua text-gray-800">
          기타 설정
        </h3>
        
        <div className="flex items-center justify-between py-3 bg-purple-50 rounded-xl px-4">
          <div>
            <div className="font-medium text-gray-800">연속 기록 동기부여</div>
            <div className="text-sm text-gray-600">스트릭 달성 시 축하 메시지</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.streakMotivation}
              onChange={(e) => setSettings({ ...settings, streakMotivation: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between py-3 bg-pink-50 rounded-xl px-4">
          <div>
            <div className="font-medium text-gray-800">익명 커뮤니티 참여</div>
            <div className="text-sm text-gray-600">노트를 익명으로 공유</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.communitySharing.shareAnonymously}
              onChange={(e) => setSettings({
                ...settings,
                communitySharing: { ...settings.communitySharing, shareAnonymously: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
          </label>
        </div>
      </div>
    </div>
  )
}