'use client'

import { useEffect, useState, useRef } from 'react'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  imageType?: 'default' | 'login' | 'logout' | 'signup'
  minDuration?: number
  onAnimationComplete?: () => void
  preRenderNextComponent?: () => React.ReactNode
}

export default function LoadingOverlay({ 
  isVisible, 
  message = '잠시만 기다려주세요...', 
  imageType = 'default',
  minDuration = 0,
  onAnimationComplete,
  preRenderNextComponent
}: LoadingOverlayProps) {
  console.log('🎯🔍 LoadingOverlay RENDER:', { 
    isVisible, 
    message, 
    imageType, 
    minDuration,
    timestamp: Date.now()
  })
  
  const { safeArea } = useDeviceDetection()
  const [showSpinner, setShowSpinner] = useState(() => {
    console.log('🎯 INSTANT: showSpinner initial state set to:', isVisible)
    return isVisible
  })
  const [fadeOut, setFadeOut] = useState(false)
  const [fadeIn, setFadeIn] = useState(false) // 🎯 페이드인 애니메이션 상태
  
  // 🔧 ref로 변경하여 리렌더링 방지
  const startTimeRef = useRef<number>(0)
  const callbackExecutedRef = useRef(false)
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null)

  const getImageSrc = () => {
    switch (imageType) {
      case 'login': return '/Login2.png'
      case 'logout': return '/Logout2.png'
      case 'signup': return '/Signup.png'
      default: return '/Loading3.png'
    }
  }

  useEffect(() => {
    console.log('🎯🔍 LoadingOverlay useEffect triggered:', { 
      isVisible, 
      showSpinner, 
      fadeOut, 
      startTime: startTimeRef.current 
    })
    
    if (isVisible) {
      console.log('🎯 VISIBLE: Setting up loading overlay with fade-in')
      const currentTime = Date.now()
      startTimeRef.current = currentTime  // ref 사용으로 변경
      console.log('🎯 Start time recorded:', currentTime)
      
      // 🔧 새로운 표시 시 콜백 플래그 리셋
      callbackExecutedRef.current = false
      
      setShowSpinner(true)
      setFadeOut(false) // 확실히 fadeOut 초기화
      
      // 🎯 부드러운 페이드인 애니메이션 (100ms 대기 후 시작)
      setTimeout(() => {
        console.log('🎯 Starting fade-in animation')
        setFadeIn(true)
      }, 100)
      
      console.log('🎯 Overlay setup complete - fade-in will start shortly')
      
    } else {
      console.log('🎯 INVISIBLE: Starting fadeout process')
      console.log('🎯 Current overlay states before fadeout:', { showSpinner, fadeOut, fadeIn })
      const elapsedTime = Date.now() - startTimeRef.current  // ref 사용으로 변경
      const remainingTime = Math.max(0, minDuration - elapsedTime)
      
      console.log('🎯 Timing check:', { elapsedTime, minDuration, remainingTime })
      
      const handleFadeOut = () => {
        console.log('🎯 Starting smooth fadeout animation')
        console.log('🎯 Setting fadeOut states: fadeIn=false, fadeOut=true')
        setFadeIn(false) // 페이드인 상태 초기화
        setFadeOut(true)
        
        // 이전 타이머가 있다면 정리
        if (fadeOutTimerRef.current) {
          clearTimeout(fadeOutTimerRef.current)
        }
        
        // 🎯 CSS transition과 정확히 동기화된 콜백 실행 (600ms transition + 50ms 버퍼)
        fadeOutTimerRef.current = setTimeout(() => {
          console.log('🎯 Fadeout CSS transition complete - executing callback (precise timing)')
          
          // 🔧 StrictMode 안전 콜백 실행
          if (!callbackExecutedRef.current && onAnimationComplete) {
            console.log('🎯 Executing animation complete callback (StrictMode safe)')
            callbackExecutedRef.current = true
            onAnimationComplete()
          } else {
            console.log('🎯 Callback already executed (StrictMode safe)')
          }
          
          // 🔧 콜백 실행 후 최소한의 대기 후 정리 (깜빡임 방지)
          setTimeout(() => {
            console.log('🎯 Safely clearing overlay states (no flicker)')
            setShowSpinner(false)
            setFadeOut(false)
            setFadeIn(false)
          }, 50) // 100ms -> 50ms로 단축하여 더 빠른 전환
        }, 650) // 600ms -> 650ms로 미세 조정하여 CSS transition과 완벽 동기화
        
        return fadeOutTimerRef.current
      }
      
      if (remainingTime > 0) {
        console.log(`🎯 Waiting additional ${remainingTime}ms for minimum duration`)
        const timer = setTimeout(() => {
          handleFadeOut()
        }, remainingTime)
        return () => clearTimeout(timer)
      } else {
        console.log('🎯 Starting immediate fadeout')
        const timer = handleFadeOut()
        return () => clearTimeout(timer)
      }
    }
    
    // Cleanup 함수
    return () => {
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current)
        fadeOutTimerRef.current = null
      }
    }
  }, [isVisible, onAnimationComplete, minDuration])  // startTime 제거로 무한 루프 방지

  if (!isVisible && !fadeOut && !showSpinner && !fadeIn) {
    console.log('🎯 RETURN NULL: Not rendering overlay')
    return null
  }
  
  console.log('🎯🔍 RENDERING LoadingOverlay with states:', {
    isVisible,
    fadeOut,
    fadeIn,
    showSpinner,
    finalVisible: isVisible || fadeOut || showSpinner || fadeIn
  })

  console.log('🎯🔍 OVERLAY DOM RENDER:', {
    zIndex: 100002,
    opacity: (isVisible && !fadeOut) ? '1' : fadeOut ? '0' : '1',
    visibility: 'visible',
    display: 'flex',
    showSpinner,
    imageType,
    message
  })

  console.log('🎯 Pre-render component visibility:', fadeOut ? 'visible' : 'hidden')
  console.log('🎯🔍 IMAGE RENDER:', { src: getImageSrc(), showSpinner })
  console.log('🎯🔍 MESSAGE RENDER:', message)
  console.log('🎯🔍 SPINNER RENDER')

  return (
    <>
      {preRenderNextComponent && (
        <div 
          className="fixed inset-0"
          style={{
            zIndex: 100001,
            opacity: fadeOut ? '1' : '0',
            transition: 'opacity 0.4s ease-out',
            background: 'var(--bg-base)',
            position: 'fixed',
            visibility: fadeOut ? 'visible' : 'hidden'
          }}
        >
          {preRenderNextComponent()}
        </div>
      )}

      <div 
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{
          zIndex: 100002,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'var(--bg-base)',
          paddingTop: `${safeArea.top}px`,
          paddingBottom: `${safeArea.bottom}px`,
          opacity: fadeOut ? '0' : (fadeIn ? '1' : '0'),
          visibility: 'visible',
          display: 'flex',
          transform: 'none',
          transition: fadeOut ? 'opacity 0.6s ease-in-out' : fadeIn ? 'opacity 0.4s ease-in-out' : 'none'
        }}
        data-loading-overlay="true"
        data-visible={isVisible}
        data-fadeout={fadeOut}
        data-show-spinner={showSpinner}
        data-fade-in={fadeIn}
      >
        <div className="flex flex-col -mt-16 items-center space-y-8">
          <div className="relative" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <img 
              src={getImageSrc()} 
              alt="Loading" 
              className="w-26 h-26 object-contain"
              style={{
                display: 'block',
                visibility: 'visible',
                opacity: 1,
                maxWidth: '104px',
                maxHeight: '104px'
              }}
              onLoad={() => console.log('🎯✅ Image loaded successfully:', getImageSrc())}
              onError={(e) => console.log('🎯❌ Image load error:', getImageSrc(), e)}
            />
          </div>

          <div className="ml-4 -mt-8 mb-4 text-center" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
            <p className="text-gray-700 font-dongle font-bold text-3xl" style={{
              display: 'block',
              visibility: 'visible',
              opacity: 1,
              color: '#374151',
              fontSize: '1.875rem',
              fontWeight: 'bold'
            }}>
              {message}
            </p>
          </div>

          <div className="relative">
            <div 
              style={{ 
                width: '32px',
                height: '32px',
                borderRadius: '50%',
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
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))',
                animation: 'spin 1s linear infinite',
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }}
            />
          </div>
        </div>

        <div className="absolute bottom-20 left-0 right-0 text-center flex flex-col items-center space-y-2">
          <img 
            src="/Logo2.png" 
            alt="Logo" 
            className="w-10 h-10 object-contain opacity-70"
            style={{
              display: 'block',
              visibility: 'visible',
              opacity: 0.7
            }}
          />
          <p className="text-base text-gray-400 font-sour-gummy" style={{
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            color: '#9ca3af'
          }}>
            Thankful
          </p>
        </div>
      </div>
      
      <style jsx global>{`
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
      `}</style>
    </>
  )
}