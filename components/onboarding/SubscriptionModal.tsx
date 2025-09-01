'use client'

import { useState, useEffect } from 'react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

const premiumFeatures = [
  { 
    image: 'Prompt.png', 
    title: '1000+ 감사 프롬프트',
    description: '다양한 상황별 맞춤 질문들'
  },
  { 
    image: 'Ai.png', 
    title: 'AI 개인 맞춤 분석',
    description: '감사 패턴 분석과 인사이트 제공'
  },
  { 
    image: 'Report.png', 
    title: '감사 성장 리포트',
    description: '월간/연간 감사 여정 리포트'
  },
  { 
    image: 'Palette.png', 
    title: '감사/설교/기도 노트 꾸미기',
    description: '아름다운 템플릿으로 기록을 특별하게'
  },
  { 
    image: 'Community.png', 
    title: '믿음의 커뮤니티',
    description: '함께 나누는 감사의 교제'
  }
]

const subscriptionPlans = {
  personal: {
    name: '개인 플랜',
    subtitle: '개인 신앙 성장을 위한',
    monthly: { price: 9900, originalPrice: 12900 },
    yearly: { price: 99000, originalPrice: 154800, savings: '36%' }
  },
  church: {
    name: '교회 플랜',
    subtitle: '공동체와 함께하는',
    monthly: { price: 29900, originalPrice: 39900 },
    yearly: { price: 299000, originalPrice: 478800, savings: '38%' }
  }
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isYearly, setIsYearly] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<'personal' | 'church'>('personal')
  const [dragStart, setDragStart] = useState<{ y: number; time: number } | null>(null)
  const [dragOffset, setDragOffset] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 약간의 지연 후 애니메이션 시작
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      setDragOffset(0) // 모달이 닫힐 때 드래그 오프셋 리셋
      setDragStart(null)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // 애니메이션 완료 후 모달 닫기
  }

  const handleSubscribe = (planType: 'personal' | 'church') => {
    // TODO: 구독 로직 구현
    console.log(`구독 시작: ${planType}, ${isYearly ? '연간' : '월간'}`)
    handleClose()
  }

  // 드래그 핸들 이벤트 핸들러
  const handleDragStart = (clientY: number) => {
    setDragStart({ y: clientY, time: Date.now() })
    setDragOffset(0)
  }

  const handleDragMove = (clientY: number) => {
    if (!dragStart) return
    
    const offset = clientY - dragStart.y
    if (offset > 0) { // 아래로만 드래그 허용
      setDragOffset(offset)
    }
  }

  const handleDragEnd = () => {
    if (!dragStart) return
    
    const dragDistance = dragOffset
    const dragDuration = Date.now() - dragStart.time
    const velocity = dragDistance / dragDuration
    
    // 드래그 거리가 100px 이상이거나 빠른 속도로 드래그한 경우 모달 닫기
    if (dragDistance > 100 || velocity > 0.5) {
      handleClose()
    } else {
      setDragOffset(0) // 원래 위치로 복원
    }
    
    setDragStart(null)
  }

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientY)
    
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY)
    }
    
    const handleMouseUp = () => {
      handleDragEnd()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  if (!isOpen) return null

  const currentPlan = subscriptionPlans[selectedPlan]
  const currentPrice = isYearly ? currentPlan.yearly : currentPlan.monthly

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[60] ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl ease-out z-[70] max-h-[85vh] overflow-hidden ${
          dragStart ? '' : 'transition-transform duration-300'
        }`}
        style={{
          transform: `translateY(${
            isVisible ? (dragOffset > 0 ? `${dragOffset}px` : '0') : '100%'
          })`
        }}
      >
        {/* 드래그 핸들러 */}
        <div 
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-12 h-1 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors"></div>
        </div>

        <div className="px-6 pb-8 overflow-y-auto max-h-[calc(85vh-2rem)]">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 font-noto-serif-kr mb-2">
              프리미엄으로 업그레이드
            </h2>
            <p className="text-sm text-gray-600 font-noto-serif-kr">
              더 풍성한 감사의 여정을 시작하세요
            </p>
          </div>

          {/* 프리미엄 기능들 */}
          <div className="space-y-3 mb-6">
            {premiumFeatures.map((feature) => (
              <div 
                key={feature.title}
                className="flex items-center space-x-3 py-2 px-3 bg-gray-50 rounded-xl"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <img 
                    src={`/${feature.image}`} 
                    alt={feature.title}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-sm text-gray-800 font-noto-serif-kr">{feature.title}</div>
                  <div className="text-xs text-gray-500 font-noto-serif-kr">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 플랜 선택 */}
          <div className="mb-6">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setSelectedPlan('personal')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  selectedPlan === 'personal'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className="font-bold">개인 플랜</div>
                <div className="text-xs opacity-80">개인 신앙 성장용</div>
              </button>
              <button
                onClick={() => setSelectedPlan('church')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  selectedPlan === 'church'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className="font-bold">교회 플랜</div>
                <div className="text-xs opacity-80">공동체 함께 사용</div>
              </button>
            </div>
          </div>

          {/* 월/년 스위치 */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-semibold ${!isYearly ? 'text-gray-800' : 'text-gray-400'}`}>
                월간
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${isYearly ? 'text-gray-800' : 'text-gray-400'}`}>
                  연간
                </span>
                {isYearly && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {currentPlan.yearly.savings} 절약
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 가격 표시 */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-gray-800">
                ₩{currentPrice.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₩{currentPrice.originalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {isYearly ? '연간 결제' : '월간 결제'}
            </p>
          </div>

          {/* 구독 버튼 */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubscribe(selectedPlan)}
              className="w-full py-4 px-6 text-white font-bold text-lg rounded-xl transition-all active:scale-98"
              style={{ 
                background: selectedPlan === 'personal' 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                  : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              {currentPlan.name} 시작하기
            </button>
            
            <button
              onClick={handleClose}
              className="w-full py-3 px-6 text-gray-600 font-semibold text-base bg-gray-100 rounded-xl transition-all active:scale-98"
            >
              나중에
            </button>
          </div>
        </div>
      </div>

      {/* CSS 스타일 */}
      <style jsx>{`
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  )
}
