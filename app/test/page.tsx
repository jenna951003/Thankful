'use client';

import { useState } from 'react';
import CustomNavBar from '@/components/CustomNavBar';
import SafeAreaVisualizer from '@/components/common/SafeAreaVisualizer';

export default function TestPage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-200">
      {/* 세이프존 시각화 (개발 환경에서만) */}
      <SafeAreaVisualizer />

      {/* Main content area */}
      <div className="p-6 pb-32">
        <h1 className="text-2xl font-bold text-white mb-6">커스텀 네비게이션 바 테스트</h1>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">현재 활성 탭: {activeTab}</h2>
          <p className="text-gray-600">
            하단 네비게이션 바를 터치해서 탭을 변경해보세요.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">특징</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• 가운데 튀어나온 커스텀 SVG 도형</li>
            <li>• 플로팅 액션 버튼</li>
            <li>• 반응형 디자인</li>
            <li>• 모바일 세이프존 지원</li>
            <li>• 부드러운 애니메이션</li>
          </ul>
        </div>

        {/* 스크롤 테스트를 위한 더미 콘텐츠 */}
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white/50 rounded-lg p-4">
              <p className="text-gray-700">
                스크롤 테스트용 콘텐츠 {i + 1}. 네비게이션 바가 하단에 고정되어 있는지 확인하세요.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Navigation Bar */}
      <CustomNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}