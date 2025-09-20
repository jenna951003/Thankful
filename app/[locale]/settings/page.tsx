'use client';

import CustomNavBar from '../../../components/CustomNavBar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SettingsPageProps {
  params: Promise<{ locale: string }>
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const [locale, setLocale] = useState<string>('ko');
  const [activeTab, setActiveTab] = useState('settings');
  const router = useRouter();

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale);
    });
  }, [params]);

  const handleTabChange = (tab: string) => {
    if (tab !== 'settings') {
      if (tab === 'home') {
        router.push(`/${locale}`);
      } else if (tab === 'community') {
        router.push(`/${locale}/community`);
      } else if (tab === 'saved') {
        router.push(`/${locale}/saved`);
      } else if (tab === 'write') {
        console.log('Write tab selected');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Safe Zone Top */}
      <div style={{ height: 'var(--actual-safe-top)' }} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-24">
        <div className="text-center">
          <div className="text-6xl mb-6">⚙️</div>
          <h1 className="text-2xl font-bold font-jua text-gray-800 mb-3">
            설정
          </h1>
          <p className="text-gray-600 font-hubballi mb-8">
            다양한 설정 옵션들이 곧 추가될 예정입니다
          </p>
          <div className="bg-white/70 rounded-2xl p-4 border border-white/50">
            <p className="text-sm text-gray-500">🚧 준비중입니다</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <CustomNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showWithAnimation={true}
      />
    </div>
  )
}