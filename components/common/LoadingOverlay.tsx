'use client'

import { useEffect, useState } from 'react'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  onAnimationComplete?: () => void
}

export default function LoadingOverlay({ 
  isVisible, 
  message = '잠시만 기다려주세요...', 
  onAnimationComplete 
}: LoadingOverlayProps) {
  const { safeArea } = useDeviceDetection()
  const [showSpinner, setShowSpinner] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // 페이드인 후 스피너 표시
      const timer = setTimeout(() => {
        setShowSpinner(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      // 페이드아웃 시작
      setFadeOut(true)
      const timer = setTimeout(() => {
        setShowSpinner(false)
        setFadeOut(false)
        onAnimationComplete?.()
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onAnimationComplete])

  if (!isVisible && !fadeOut) return null

  return (
    <div 
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        ${isVisible && !fadeOut ? 'animate-fade-in' : 'animate-fade-out'}
      `}
      style={{
        background: 'var(--bg-base)',
        paddingTop: `${safeArea.top}px`,
        paddingBottom: `${safeArea.bottom}px`
      }}
    >
      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-fade-out {
          animation: fadeOut 0.4s ease-out forwards;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col -mt-16 items-center space-y-0">
        {/* Loading.png 이미지 */}
        {showSpinner && (
          <div className="relative animate-float">
            <img 
              src="/Loading1.png" 
              alt="Loading" 
              className="w-56 h-56 object-contain"
            />
          </div>
        )}

        {/* 로딩 메시지 */}
        {showSpinner && (
          <div className="ml-4 -mt-8 mb-4 text-center animate-pulse">
            <p className="text-gray-700 font-dongle font-bold text-3xl">
              {message}
            </p>
          </div>
        )}

        {/* 스피너 (점 3개 위치로 이동) */}
        {showSpinner && (
          <div className="relative">
            <div 
              className="w-8 h-8 rounded-full animate-spin"
              style={{ 
                background: `conic-gradient(
                  from 0deg,
                  transparent 0deg,
                  transparent 90deg,
rgb(200, 188, 151) 90deg,
rgb(172, 205, 141) 180deg,
rgb(133, 177, 115) 270deg,
rgb(78, 128, 87) 360deg
                )`,
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))'
              }}
            />
          </div>
        )}
      </div>

      {/* 하단 브랜딩 (옵션) */}
      {showSpinner && (
        <div className="absolute bottom-20 left-0 right-0 text-center flex flex-col items-center space-y-2">
          {/* Logo2.png 이미지 */}
          <img 
            src="/Logo2.png" 
            alt="Logo" 
            className="w-10 h-10 object-contain opacity-70"
          />
          <p className="text-base text-gray-400 font-sour-gummy">
            Thankful
          </p>
        </div>
      )}
    </div>
  )
}