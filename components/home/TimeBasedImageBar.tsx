'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'

interface TimeBasedImageBarProps {
  className?: string
}

export default function TimeBasedImageBar({ className = '' }: TimeBasedImageBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { safeArea, isTablet } = useDeviceDetection()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getTimeBasedImage = () => {
    const hour = currentTime.getHours()

    if (hour < 6) {
      return {
        src: isTablet ? '/DawnT.webp' : '/Dawn.webp',
        alt: '새벽의 평안',
        gradientClass: 'bg-gradient-to-r from-indigo-900/20 via-purple-800/10 to-blue-900/20'
      }
    }
    if (hour < 12) {
      return {
        src: isTablet ? '/MorningT.webp' : '/Morning.webp',
        alt: '좋은 아침',
        gradientClass: 'bg-gradient-to-r from-orange-100 via-amber-50 to-yellow-100'
      }
    }
    if (hour < 18) {
      return {
        src: isTablet ? '/DawnT.webp' : '/Dawn.webp',
        alt: '평안한 오후',
        gradientClass: 'bg-gradient-to-r from-blue-100 via-sky-50 to-cyan-100'
      }
    }
    if (hour < 22) {
      return {
        src: '/images/time-based/evening.svg',
        alt: '은혜로운 저녁',
        gradientClass: 'bg-gradient-to-r from-rose-100 via-pink-50 to-purple-100'
      }
    }
    return {
      src: '/images/time-based/night.svg',
      alt: '조용한 밤',
      gradientClass: 'bg-gradient-to-r from-slate-800/20 via-gray-700/10 to-blue-900/20'
    }
  }

  const imageData = getTimeBasedImage()

  return (
    <div
      className={`w-full ${className}`}
      style={{
        paddingTop: `${safeArea.top + 4}px`
      }}
    >
      {/* 캡슐형 이미지 바 */}
      <div
        className="relative h-16 rounded-xl overflow-hidden mx-4 active:scale-98 transition-all duration-300 select-none"
        style={{
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15), 0 4px 4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        {/* 배경 이미지 */}
        <img
          src={imageData.src}
          alt={imageData.alt}
          className="w-full h-full object-cover select-none"
          draggable={false}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
          onError={(e) => {
            // 이미지 로딩 실패 시 대체 배경
            const parent = e.currentTarget.parentElement
            if (parent) {
              parent.style.background = 'linear-gradient(to right, rgb(59 130 246 / 0.3), rgb(147 197 253 / 0.2), rgb(165 243 252 / 0.3))'
              e.currentTarget.style.display = 'none'
              if (!parent.querySelector('.fallback-icon')) {
                const fallback = document.createElement('div')
                fallback.className = 'fallback-icon absolute inset-0 flex items-center justify-center text-2xl'
                fallback.innerHTML = '🌅'
                parent.appendChild(fallback)
              }
            }
          }}
        />

        {/* 내부 그림자 효과 (캡슐 안쪽 깊이감) */}
        <div className="absolute inset-0 shadow-inner rounded-2xl pointer-events-none"></div>
      </div>
    </div>
  )
}