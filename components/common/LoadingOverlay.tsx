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
      `}</style>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col items-center space-y-6">
        {/* 로딩 스피너 */}
        {showSpinner && (
          <div className="relative">
            {/* 외부 링 */}
            <div 
              className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"
              style={{ 
                borderTopColor: 'var(--retro-blue)',
                borderRightColor: 'var(--retro-pink)',
              }}
            />
            {/* 중앙 아이콘 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg">🙏</span>
            </div>
          </div>
        )}

        {/* 로딩 메시지 */}
        {showSpinner && (
          <div className="text-center animate-pulse">
            <p className="text-gray-600 font-noto-serif-kr font-medium">
              {message}
            </p>
          </div>
        )}

        {/* 장식 점들 */}
        {showSpinner && (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: 'var(--retro-blue)',
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단 브랜딩 (옵션) */}
      {showSpinner && (
        <div className="absolute bottom-20 left-0 right-0 text-center">
          <p className="text-sm text-gray-400 font-sour-gummy">
            Thankful
          </p>
        </div>
      )}
    </div>
  )
}