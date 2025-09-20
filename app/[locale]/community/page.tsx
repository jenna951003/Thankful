'use client';

import CustomNavBar from '../../../components/CustomNavBar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CommunityPageProps {
  params: Promise<{ locale: string }>
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const [locale, setLocale] = useState<string>('ko');
  const [activeTab, setActiveTab] = useState('community');
  const router = useRouter();

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale);
    });
  }, [params]);

  const handleTabChange = (tab: string) => {
    if (tab !== 'community') {
      if (tab === 'home') {
        router.push(`/${locale}`);
      } else if (tab === 'saved') {
        router.push(`/${locale}/saved`);
      } else if (tab === 'settings') {
        router.push(`/${locale}/settings`);
      } else if (tab === 'write') {
        console.log('Write tab selected');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Safe Zone Top */}
      <div style={{ height: 'var(--actual-safe-top)' }} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-24">
        <div className="text-center">
          <div className="text-6xl mb-6">👥</div>
          <h1 className="text-2xl font-bold font-jua text-gray-800 mb-3">
            커뮤니티
          </h1>
          <p className="text-gray-600 font-hubballi mb-8">
            곧 멋진 커뮤니티 기능이 준비됩니다
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