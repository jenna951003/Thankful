'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'

export default function SplashPage() {
  const { t, isLoading } = useTranslation()
  const { safeArea, deviceName, isLoading: deviceLoading, isWebEnvironment } = useDeviceDetection()
  const [showBackground, setShowBackground] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // 배경 이미지 페이드인
    const backgroundTimer = setTimeout(() => {
      setShowBackground(true)
    }, 0)

    // 1.2초 후 텍스트 나타나기
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 1200)

    return () => {
      clearTimeout(backgroundTimer)
      clearTimeout(textTimer)
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'rgb(238, 234, 217)' }}>
      {/* 상단 세이프존 (웹 환경: 파란색, 실제 기기: 빨간색) */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `${safeArea.top}px`,
          backgroundColor: isWebEnvironment ? 'blue' : 'red', 
          opacity: '0.8',
          zIndex: 1000
        }}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-grow relative" style={{
        minHeight: '100vh'
      }}>
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: 'url(/Splash2.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: showBackground ? 1 : 0
            }}
          />

          {/* 하단 감사 멘트 */}
          <div 
            className="absolute left-0 right-0 text-center z-10 transition-all duration-800 ease-out"
            style={{
              bottom: `${safeArea.bottom + 96}px`,
              opacity: showText ? 1 : 0,
              transform: showText ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <p 
              className="text-2xl font-bold text-[#4f4f4f] drop-shadow-lg font-fascinate"
              style={{
                textShadow: '2px 2px 2px rgba(255, 255, 255, 0.5)'
              }}
            >
              {t('splash.message')}
            </p>
            
            {/* 디버깅 정보 */}
            {/* <div className="mt-4 text-sm text-gray-600 bg-white/70 p-2 rounded">
              <div>기기: {deviceName}</div>
              <div>세이프존: {safeArea.top}px / {safeArea.bottom}px / {safeArea.left}px / {safeArea.right}px</div>
            </div> */}
          </div>
      </div>

      {/* 하단 세이프존 (웹 환경: 파란색, 실제 기기: 빨간색) */}
      <div 
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${safeArea.bottom}px`,
          backgroundColor: isWebEnvironment ? 'blue' : 'red', 
          opacity: '0.8',
          zIndex: 1000
        }}
      />
    </div>
  )
}