'use client'

import { useState } from 'react'

interface PrivacySettingsProps {
  locale: string
}

export default function PrivacySettings({ locale }: PrivacySettingsProps) {
  const [settings, setSettings] = useState({
    dataCollection: {
      analytics: true,
      crashReports: true,
      usageStats: false
    },
    sharing: {
      allowCommunitySharing: true,
      anonymousSharing: true,
      showProfile: false
    },
    backup: {
      autoBackup: true,
      cloudSync: true,
      localBackup: false
    },
    security: {
      biometricLock: false,
      autoLock: 'never' as 'never' | '5min' | '15min' | '1hour',
      twoFactor: false
    }
  })

  const [showDataExport, setShowDataExport] = useState(false)
  const [backupStatus, setBackupStatus] = useState({
    lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6시간 전
    dataSize: '2.3 MB',
    noteCount: 47
  })

  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Exporting user data...')
    setShowDataExport(true)
    setTimeout(() => setShowDataExport(false), 3000)
  }

  const handleDeleteAllData = () => {
    const confirmDelete = window.confirm(
      '정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
    )
    if (confirmDelete) {
      // TODO: Implement data deletion
      console.log('Deleting all user data...')
    }
  }

  const formatLastBackup = (date: Date) => {
    const hours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    return `${days}일 전`
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-jua text-gray-800 mb-2">
          프라이버시 & 보안
        </h2>
        <p className="text-sm text-gray-600 font-hubballi">
          데이터 보호와 개인정보를 관리하세요
        </p>
      </div>

      {/* Data Collection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          📊 데이터 수집
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 bg-blue-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">앱 사용 분석</div>
              <div className="text-sm text-gray-600">앱 개선을 위한 익명 사용 데이터</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dataCollection.analytics}
                onChange={(e) => setSettings({
                  ...settings,
                  dataCollection: { ...settings.dataCollection, analytics: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 bg-green-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">크래시 리포트</div>
              <div className="text-sm text-gray-600">버그 수정을 위한 오류 보고서</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dataCollection.crashReports}
                onChange={(e) => setSettings({
                  ...settings,
                  dataCollection: { ...settings.dataCollection, crashReports: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 bg-purple-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">사용량 통계</div>
              <div className="text-sm text-gray-600">기능별 사용 빈도 데이터</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dataCollection.usageStats}
                onChange={(e) => setSettings({
                  ...settings,
                  dataCollection: { ...settings.dataCollection, usageStats: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Community Sharing */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          🤝 커뮤니티 공유
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 bg-orange-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">커뮤니티 참여 허용</div>
              <div className="text-sm text-gray-600">노트를 커뮤니티에 공유</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sharing.allowCommunitySharing}
                onChange={(e) => setSettings({
                  ...settings,
                  sharing: { ...settings.sharing, allowCommunitySharing: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 bg-pink-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">익명 공유</div>
              <div className="text-sm text-gray-600">이름 없이 익명으로만 공유</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sharing.anonymousSharing}
                onChange={(e) => setSettings({
                  ...settings,
                  sharing: { ...settings.sharing, anonymousSharing: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Backup & Sync */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          💾 백업 & 동기화
        </h3>
        
        {/* Backup Status */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border border-emerald-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600">☁️</span>
            </div>
            <div>
              <div className="font-semibold text-emerald-800">백업 상태</div>
              <div className="text-sm text-emerald-600">
                마지막 백업: {formatLastBackup(backupStatus.lastBackup)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-emerald-700">{backupStatus.noteCount}</div>
              <div className="text-xs text-emerald-600">개의 노트</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-700">{backupStatus.dataSize}</div>
              <div className="text-xs text-emerald-600">데이터 크기</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 bg-blue-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">자동 백업</div>
              <div className="text-sm text-gray-600">클라우드에 자동으로 데이터 저장</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.backup.autoBackup}
                onChange={(e) => setSettings({
                  ...settings,
                  backup: { ...settings.backup, autoBackup: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 bg-green-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">기기 간 동기화</div>
              <div className="text-sm text-gray-600">여러 기기에서 동일한 데이터 사용</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.backup.cloudSync}
                onChange={(e) => setSettings({
                  ...settings,
                  backup: { ...settings.backup, cloudSync: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <button
            onClick={handleExportData}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            📤 내 데이터 내보내기
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          🔐 보안
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 bg-indigo-50 rounded-xl px-4">
            <div>
              <div className="font-medium text-gray-800">생체 인식 잠금</div>
              <div className="text-sm text-gray-600">Face ID / Touch ID로 앱 보호</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.biometricLock}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, biometricLock: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="py-3 bg-yellow-50 rounded-xl px-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-800">자동 잠금</div>
            </div>
            <select
              value={settings.security.autoLock}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, autoLock: e.target.value as any }
              })}
              className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              <option value="never">사용 안함</option>
              <option value="5min">5분 후</option>
              <option value="15min">15분 후</option>
              <option value="1hour">1시간 후</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-jua text-gray-800">
          🗂️ 데이터 관리
        </h3>
        
        <div className="space-y-3">
          <button className="w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors">
            📊 내 데이터 사용량 보기
          </button>
          
          <button className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors">
            🔄 지금 백업하기
          </button>
          
          <button
            onClick={handleDeleteAllData}
            className="w-full py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
          >
            🗑️ 모든 데이터 삭제
          </button>
        </div>
      </div>

      {/* Export Success Modal */}
      {showDataExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-sm">
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-bold font-jua text-gray-800 mb-2">
                데이터 내보내기 완료
              </h3>
              <p className="text-sm text-gray-600 font-hubballi">
                이메일로 데이터가 전송되었습니다
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}