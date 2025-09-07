'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useTranslationContext } from '../../contexts/TranslationContext'

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

interface PlanPrice {
  price: number
  originalPrice?: number
  savings?: string
}

interface Plan {
  name: string
  subtitle: string
  weekly?: PlanPrice
  monthly: PlanPrice
  yearly?: PlanPrice
}

const subscriptionPlans: Record<'personal' | 'church', Plan> = {
  personal: {
    name: '개인 플랜',
    subtitle: '개인 신앙 성장을 위한',
    weekly: { price: 4.99 },
    monthly: { price: 7.99, originalPrice: 11.99, savings: '33%' },
    yearly: { price: 39.99, originalPrice: 95.88, savings: '58%' }
  },
  church: {
    name: '교회 플랜',
    subtitle: '공동체와 함께하는',
    monthly: { price: 29.99 },
    yearly: { price: 199.99, originalPrice: 359.88, savings: '44%' }
  }
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const params = useParams()
  const locale = params.locale as string
  const { t, fontClass } = useTranslationContext()
  const [isVisible, setIsVisible] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<'personal' | 'church'>('personal')
  const [dragStart, setDragStart] = useState<{ y: number; time: number } | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isScrollingUp, setIsScrollingUp] = useState(false)
  const [isHandleDrag, setIsHandleDrag] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [canDragFromScroll, setCanDragFromScroll] = useState(false)
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false)
  const [scrollPhase, setScrollPhase] = useState<'scroll' | 'overscroll' | 'drag'>('scroll')
  const [overscrollAmount, setOverscrollAmount] = useState(0)
  const [scrollFadeOpacity, setScrollFadeOpacity] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ y: number; time: number } | null>(null)
  const lastScrollTopRef = useRef(0)
  const mainScrollPositionRef = useRef(0)
  const touchStartYRef = useRef(0)
  const dragOffsetRef = useRef(0)
  const rawDragDistanceRef = useRef(0) // 고무줄 효과 적용 전의 원시 거리
  const initialTouchYRef = useRef(0)
  const isOverscrollingRef = useRef(false)
  const scrollThrottleRef = useRef<number | null>(null)

  // 교회 플랜 선택 시 주간이 선택되어 있으면 월간으로 변경
  useEffect(() => {
    if (selectedPlan === 'church' && billingCycle === 'weekly') {
      setBillingCycle('monthly')
    }
  }, [selectedPlan, billingCycle])

  useEffect(() => {
    if (isOpen) {
      // 메인 페이지 스크롤 위치 저장
      mainScrollPositionRef.current = window.scrollY
      
      // 모든 active 상태 강제 해제
      const activeElement = document.activeElement as HTMLElement
      if (activeElement) {
        activeElement.blur()
      }
      
      // 모든 버튼의 포커스 해제
      document.querySelectorAll('button').forEach((el) => {
        (el as HTMLElement).blur()
      })
      
      // 모든 버튼의 transform 스타일 리셋
      document.querySelectorAll('.simple-button').forEach((el) => {
        (el as HTMLElement).style.transform = ''
      })
      
      // Premium 배지 transform 리셋
      document.querySelectorAll('.premium-badge').forEach((el) => {
        (el as HTMLElement).style.transform = 'scale(1)'
      })
      
      // 모달이 열릴 때 메인페이지 스크롤 방지 (iOS Safari 지원)
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${mainScrollPositionRef.current}px`
      document.body.style.width = '100%'
      document.body.style.touchAction = 'none'
      document.body.classList.add('modal-open')
      
      // 모달이 열릴 때 약간의 지연 후 애니메이션 시작
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      // 모달이 닫힐 때 메인페이지 스크롤 복원
      document.body.style.overflow = 'unset'
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.touchAction = ''
      document.body.classList.remove('modal-open')
      
      // 저장된 스크롤 위치로 복원
      window.scrollTo(0, mainScrollPositionRef.current)
      
      setIsVisible(false)
      setDragOffset(0)
      setDragStart(null)
      dragStartRef.current = null
      setIsHandleDrag(false)
      setIsScrollingUp(false)
      setIsDragging(false)
      setCanDragFromScroll(false)
      setScrollPhase('scroll')
      setOverscrollAmount(0)
      setScrollFadeOpacity(0)
    }
    
    // cleanup: 컴포넌트 언마운트 시 클래스 제거
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  // 새로운 스크롤-드래그 상호작용 시스템
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || !isOpen) return

    const handleScroll = () => {
      // 스크롤 이벤트 throttling으로 성능 최적화
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
      
      scrollThrottleRef.current = requestAnimationFrame(() => {
        const currentScrollTop = scrollContainer.scrollTop
        lastScrollTopRef.current = currentScrollTop
        
        // 스크롤 페이드 효과 투명도 계산
        const maxScrollForFade = 50 // 50px 스크롤에서 최대 투명도
        const fadeOpacity = Math.min(currentScrollTop / maxScrollForFade, 1)
        setScrollFadeOpacity(fadeOpacity)
        
        // 스크롤 페이즈 업데이트
        if (currentScrollTop > 0) {
          setScrollPhase('scroll')
          setOverscrollAmount(0)
          isOverscrollingRef.current = false
        }
      })
    }

    const handleTouchStart = (e: TouchEvent) => {
      initialTouchYRef.current = e.touches[0].clientY
      touchStartYRef.current = e.touches[0].clientY
      isOverscrollingRef.current = false
      setScrollPhase('scroll')
      setOverscrollAmount(0)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const currentTouchY = e.touches[0].clientY
      const deltaY = currentTouchY - touchStartYRef.current
      const scrollTop = scrollContainer.scrollTop
      
      // Phase 1: 정상 스크롤 허용 (scrollTop > 0 또는 위로 스와이프)
      if (scrollTop > 0 || (scrollTop === 0 && deltaY < 0)) {
        setScrollPhase('scroll')
        // 브라우저 기본 스크롤 동작 허용
        return
      }
      
      // Phase 2: 스크롤 최상단에서 아래로 당기기 (오버스크롤)
      if (scrollTop === 0 && deltaY > 0) {
        // 오버스크롤 시작
        if (!isOverscrollingRef.current) {
          isOverscrollingRef.current = true
          setScrollPhase('overscroll')
          // 드래그 시작점을 초기 터치 위치로 설정
          const dragData = { y: initialTouchYRef.current, time: Date.now() }
          setDragStart(dragData)
          dragStartRef.current = dragData
          dragOffsetRef.current = 0
          setIsDragging(true)
        }
        
        // 오버스크롤/드래그 처리
        e.preventDefault()
        setScrollPhase('drag')
        
        // 초기 터치 위치부터의 전체 거리 계산
        const totalDistance = currentTouchY - initialTouchYRef.current
        const rawDragDistance = Math.max(0, totalDistance)
        const rubberBandOffset = applyRubberBandEffect(rawDragDistance)
        
        // 원시 드래그 거리와 고무줄 효과 적용된 오프셋을 따로 저장
        rawDragDistanceRef.current = rawDragDistance
        setDragOffset(rubberBandOffset)
        dragOffsetRef.current = rubberBandOffset
        setOverscrollAmount(rubberBandOffset)
        
        // 햅틱 피드백
        if (rawDragDistance > 100 && !hasTriggeredHaptic) {
          try {
            Haptics.impact({ style: ImpactStyle.Medium })
            setHasTriggeredHaptic(true)
          } catch (error) {
            // Capacitor가 없는 환경에서는 무시
          }
        } else if (rawDragDistance <= 100) {
          setHasTriggeredHaptic(false)
        }
      }
    }

    const handleTouchEnd = () => {
      if (isOverscrollingRef.current && dragStartRef.current) {
        handleDragEnd()
      }
      
      // 상태 초기화
      isOverscrollingRef.current = false
      setScrollPhase('scroll')
      setIsDragging(false)
    }

    // 이벤트 리스너 등록
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true })
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false })
    scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
      scrollContainer.removeEventListener('touchstart', handleTouchStart)
      scrollContainer.removeEventListener('touchmove', handleTouchMove)
      scrollContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isOpen, hasTriggeredHaptic])

  // 드래그 핸들용 간단한 이벤트 리스너
  useEffect(() => {
    if (!isOpen) return

    const handleHandleTouchMove = (e: TouchEvent) => {
      if (dragStartRef.current && isHandleDrag) {
        e.preventDefault()
        e.stopPropagation()
        handleDragMove(e.touches[0].clientY)
      }
    }

    const handleHandleTouchEnd = () => {
      if (dragStartRef.current && isHandleDrag) {
        handleDragEnd()
      }
      setIsDragging(false)
      setIsHandleDrag(false)
    }

    document.addEventListener('touchmove', handleHandleTouchMove, { passive: false })
    document.addEventListener('touchend', handleHandleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener('touchmove', handleHandleTouchMove)
      document.removeEventListener('touchend', handleHandleTouchEnd)
    }
  }, [isOpen, isHandleDrag])

  const handleClose = useCallback(() => {
    // 모든 active 상태와 포커스 해제
    const activeElement = document.activeElement as HTMLElement
    if (activeElement) {
      activeElement.blur()
    }
    
    setIsVisible(false)
    setIsDragging(false)
    setCanDragFromScroll(false)
    
    setTimeout(() => {
      onClose()
      
      // 모달이 완전히 닫힌 후 버튼 상태 정리
      requestAnimationFrame(() => {
        // 모든 버튼의 포커스 해제 및 transform 리셋
        document.querySelectorAll('.simple-button').forEach((button) => {
          const btn = button as HTMLElement
          btn.blur()
          btn.style.transform = ''
        })
        
        // Premium 배지 리셋
        document.querySelectorAll('.premium-badge').forEach((el) => {
          (el as HTMLElement).style.transform = ''
        })
      })
    }, 500) // 애니메이션 완료 후 모달 닫기
  }, [onClose])

  const handleSubscribe = (planType: 'personal' | 'church') => {
    // TODO: 구독 로직 구현
    console.log(`구독 시작: ${planType}, ${billingCycle}`)
    handleClose()
  }

  // 스크롤 위치 체크 함수 (간단화)
  const isScrollAtTop = () => {
    if (!scrollContainerRef.current) return true
    return scrollContainerRef.current.scrollTop <= 0
  }

  // 개선된 고무줄 효과 (더 자연스럽고 모달 닫기에 적합)
  const applyRubberBandEffect = (offset: number) => {
    const threshold = 80 // 저항 시작점을 더 낮춤 (80px)
    
    if (offset <= threshold) {
      // 80px까지는 저항 없음
      return offset
    }
    
    // 80px 이후부터 점진적 저항 적용
    const excessDistance = offset - threshold
    const maxExcess = 300 // 최대 추가 드래그 거리를 늘림
    const normalizedExcess = Math.min(excessDistance / maxExcess, 1)
    
    // 더 관대한 지수 저항 (0.4 제곱으로 더 관대하게)
    const resistedExcess = excessDistance * (1 - Math.pow(normalizedExcess, 0.4))
    
    return threshold + resistedExcess
  }

  const handleDragMove = useCallback((clientY: number) => {
    if (!dragStart) return
    
    const offset = clientY - dragStart.y
    if (offset > 0) { // 아래로만 드래그 허용
      // 원시 드래그 거리와 고무줄 효과 적용된 오프셋을 따로 저장
      const rawDragDistance = offset
      const rubberBandOffset = applyRubberBandEffect(rawDragDistance)
      
      rawDragDistanceRef.current = rawDragDistance
      setDragOffset(rubberBandOffset)
      dragOffsetRef.current = rubberBandOffset
      
      // 임계점 도달 시 햅틱 피드백 (100px에서 발생, 원시 거리 기준)
      if (rawDragDistance > 100 && !hasTriggeredHaptic) {
        try {
          Haptics.impact({ style: ImpactStyle.Medium })
          setHasTriggeredHaptic(true)
        } catch (error) {
          // Capacitor가 없는 환경에서는 무시
        }
      } else if (rawDragDistance <= 100) {
        setHasTriggeredHaptic(false)
      }
    }
  }, [dragStart, hasTriggeredHaptic])

  const handleDragEnd = useCallback(() => {
    if (!dragStartRef.current) return
    
    // 원시 드래그 거리(고무줄 효과 적용 전)와 실제 표시된 오프셋을 따로 처리
    const rawDragDistance = rawDragDistanceRef.current
    const visualOffset = dragOffsetRef.current
    const dragDuration = Math.max(Date.now() - dragStartRef.current.time, 1) // 0으로 나누기 방지
    
    // velocity는 원시 드래그 거리 기준으로 계산 (실제 사용자 제스처의 속도)
    const rawVelocity = rawDragDistance / dragDuration
    
    // 디버깅용 콘솔 로그
    console.log('🔍 Drag Debug:', {
      rawDragDistance,
      visualOffset,
      rawVelocity,
      dragDuration,
      screenHeight: window.innerHeight,
      screenHeightThreshold: window.innerHeight * 0.25
    })
    
    // 개선된 닫기 조건 (원시 드래그 거리 기준):
    // 1. 드래그 거리가 150px 이상
    // 2. 빠른 플릭 제스처 (rawVelocity > 0.5)
    // 3. 화면 높이의 25% 이상 드래그
    // 4. 최소 150ms 이상 드래그 지속 (너무 빠른 실수 터치 방지)
    const screenHeight = window.innerHeight
    const minDragDuration = 150
    
    const shouldClose = 
      dragDuration >= minDragDuration && (
        rawDragDistance > 150 || 
        rawVelocity > 0.5 || 
        rawDragDistance > screenHeight * 0.25
      )
    
    console.log('✅ Should Close?', shouldClose, {
      durationOK: dragDuration >= minDragDuration,
      distanceOK: rawDragDistance > 150,
      velocityOK: rawVelocity > 0.5,
      screenHeightOK: rawDragDistance > screenHeight * 0.25
    })
    
    if (shouldClose) {
      // 닫기 시 강한 햅틱 피드백
      try {
        Haptics.impact({ style: ImpactStyle.Heavy })
      } catch (error) {
        // Capacitor가 없는 환경에서는 무시
      }
      // 부드러운 슬라이드다운 애니메이션으로 닫기
      handleClose()
    } else {
      // 복원 시 가벼운 햅틱 피드백
      try {
        Haptics.impact({ style: ImpactStyle.Light })
      } catch (error) {
        // Capacitor가 없는 환경에서는 무시
      }
      // 부드러운 복원 애니메이션
      setDragStart(null)
      dragStartRef.current = null
      setIsHandleDrag(false)
      setIsDragging(false)
      setCanDragFromScroll(false)
      setHasTriggeredHaptic(false)
      
      // ref 값도 리셋
      dragOffsetRef.current = 0
      rawDragDistanceRef.current = 0
      
      // 스프링 애니메이션 효과로 복원
      requestAnimationFrame(() => {
        setDragOffset(0)
      })
    }
  }, [handleClose, hasTriggeredHaptic])

  // 드래그 핸들용 터치 시작 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
    const dragData = { y: e.touches[0].clientY, time: Date.now() }
    setDragStart(dragData)
    dragStartRef.current = dragData
    setDragOffset(0)
    dragOffsetRef.current = 0
    rawDragDistanceRef.current = 0
    setIsHandleDrag(true)
    setIsDragging(true)
  }

  // 마우스 이벤트  
  const handleMouseDown = (e: React.MouseEvent) => {
    const dragData = { y: e.clientY, time: Date.now() }
    setDragStart(dragData)
    dragStartRef.current = dragData
    setDragOffset(0)
    dragOffsetRef.current = 0
    rawDragDistanceRef.current = 0
    setIsHandleDrag(true)
    setIsDragging(true)
    
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

  // 모달 컨테이너 터치 이벤트 차단
  const handleModalTouch = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  if (!isOpen) return null

  const currentPlan = subscriptionPlans[selectedPlan]
  const getCurrentPrice = (): PlanPrice => {
    if (billingCycle === 'weekly' && currentPlan.weekly) {
      return currentPlan.weekly
    }
    if (billingCycle === 'yearly' && currentPlan.yearly) {
      return currentPlan.yearly
    }
    return currentPlan.monthly
  }
  const currentPrice = getCurrentPrice()

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-out z-[2100] ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div 
        className={`fixed bottom-0 left-0 right-0 rounded-t-3xl z-[2200] max-h-[85vh] overflow-hidden ${
          isDragging ? '' : 'transition-all duration-500 ease-out'
        }`}
        style={{
          background: 'rgb(235, 240, 230)', // 온보딩과 동일한 베이지 배경
          transform: `translateY(${
            isVisible ? (dragOffset > 0 ? `${dragOffset}px` : '0') : '100%'
          })`,
          transitionTimingFunction: isDragging ? 'none' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: isDragging ? 'transform' : 'auto'
        }}
        onTouchStart={handleModalTouch}
        onTouchMove={handleModalTouch}
        onTouchEnd={handleModalTouch}
      >
        {/* 드래그 핸들러 컨테이너 */}
        <div className="relative">
          {/* 드래그 핸들러 */}
          <div 
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing relative z-20"
            onTouchStart={handleTouchStart}
            onMouseDown={handleMouseDown}
          >
            <div className={`w-12 h-1 rounded-full transition-all duration-200 ${
              isDragging ? 'bg-gray-600 w-16' : 'bg-gray-400 hover:bg-gray-500'
            }`}></div>
          </div>

          {/* 상단 페이드 가림막 - 드래그 핸들 아래에 위치 */}
          <div 
            className="absolute left-0 right-0 h-14 pointer-events-none z-10 transition-opacity duration-200 ease-out"
            style={{
              top: '24px', // 드래그 핸들 아래부터 시작 (pt-3 + pb-2 + 선 높이 고려)
              background: `linear-gradient(to bottom, 
                rgba(235, 240, 230, 1) 0%, 
                rgba(235, 240, 230, 0.95) 20%,
                rgba(235, 240, 230, 0.85) 40%,
                rgba(235, 240, 230, 0.7) 60%,
                rgba(235, 240, 230, 0.3) 80%,
                rgba(235, 240, 230, 0) 100%
              )`,
              opacity: scrollFadeOpacity,
              willChange: 'opacity'
            }}
          />
        </div>

        <div 
          ref={scrollContainerRef}
          className="overflow-y-auto max-h-[calc(85vh-2rem)]"
          style={{
            touchAction: scrollPhase === 'drag' ? 'none' : 'pan-y',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 'calc(2rem + var(--actual-safe-bottom, 0px))'
          }}
        >
          {/* 태블릿 반응형 컨테이너 */}
          <div className="px-6 md:max-w-md md:mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-6 pt-4 fade-start fade-title">
            <h1 className={`text-lg -mx-2 font-bold text-gray-800 mb-1 ${fontClass} tracking-wide`}>
              {t('modals.subscription.title')}
            </h1>
            <p className={`text-sm text-gray-600 font-semibold ${fontClass} leading-relaxed`}>
              {t('modals.subscription.subtitle')}
            </p>
          </div>

          {/* 프리미엄 기능들 */}
          <div className="space-y-4 mb-6 fade-start fade-features">
            {premiumFeatures.map((feature, index) => (
              <div key={feature.title}>
                <div 
                  className="flex items-center justify-between py-2 px-4 bg-white font-noto-serif-kr rounded-xl"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex-shrink-0 w-12 h-14 flex items-center justify-center">
                      <img 
                        src={`/${feature.image}`} 
                        alt={feature.title}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-extrabold text-[14px] text-gray-800">{feature.title}</div>
                      <div className="text-[11px] font-bold text-gray-500">{feature.description}</div>
                    </div>
                  </div>
                </div>
                {/* 믿음의 커뮤니티 카드 아래에 retro-warm 배경 추가 */}
                {feature.title === '믿음의 커뮤니티' && (
                  <div className="w-24 h-1 mt-4 retro-ocean rounded-full mx-auto mt-2"></div>
                )}
              </div>
            ))}
          </div>

          {/* 플랜 선택 */}
          <div className="mb-6 fade-start fade-plans">
            <div className="flex space-x-3 mb-4">
              <button
                onClick={(e) => {
                  setSelectedPlan('personal')
                  ;(e.currentTarget as HTMLElement).blur()
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-noto-serif-kr font-bold text-sm plan-button-clickable ${
                  selectedPlan === 'personal' ? 'button-screen-texture' : ''
                }`}
                style={{
                  backgroundColor: selectedPlan === 'personal' 
                    ? '#71874f'
                    : 'rgba(255, 255, 255, 0.95)',
                  color: selectedPlan === 'personal' ? '#ffffff' : '#374151'
                }}
              >
                <div className="font-extrabold transition-all duration-500">개인 플랜</div>
                <div className="text-xs opacity-80 transition-all duration-500">개인 신앙 성장용</div>
              </button>
              <button
                onClick={(e) => {
                  setSelectedPlan('church')
                  ;(e.currentTarget as HTMLElement).blur()
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-noto-serif-kr font-bold text-sm plan-button-clickable ${
                  selectedPlan === 'church' ? 'button-screen-texture' : ''
                }`}
                style={{
                  backgroundColor: selectedPlan === 'church' 
                    ? '#bd9cd3'
                    : 'rgba(255, 255, 255, 0.95)',
                  color: selectedPlan === 'church' ? '#ffffff' : '#374151'
                }}
              >
                <div className="font-extrabold transition-all duration-500">교회 플랜</div>
                <div className="text-xs opacity-80 transition-all duration-500">공동체 함께 사용</div>
              </button>
            </div>
          </div>

          {/* 빌링 사이클 탭 */}
          <div className="mb-4 fade-start fade-switch">
            <div className="relative bg-[#ddd5c0] rounded-xl p-1 py-1.5 max-w-sm mx-auto">
              {/* 슬라이딩 인디케이터 */}
              <div 
                className="absolute top-1.5 bottom-1.5 rounded-lg shadow-lg transition-all duration-500 ease-out"
                style={{
                  width: 'calc(33.333% - 2px)',
                  background: '#9d8f72',
                  left: '1px',
                  transform: `translateX(${
                    billingCycle === 'weekly' && selectedPlan === 'personal' ? '4px' : 
                    billingCycle === 'monthly' || (billingCycle === 'weekly' && selectedPlan === 'church') ? 'calc(100% + 2px)' : 'calc(200% + 0px)'
                  })`,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              
              <div className="relative z-10 flex">
                {(['weekly', 'monthly', 'yearly'] as const).map((cycle) => {
                  const isDisabled = selectedPlan === 'church' && cycle === 'weekly'
                  return (
                    <button
                      key={cycle}
                      onClick={(e) => {
                        if (!isDisabled) {
                          setBillingCycle(cycle)
                          ;(e.currentTarget as HTMLElement).blur()
                        }
                      }}
                      disabled={isDisabled}
                      className={`flex-1 py-2 px-3 font-noto-serif-kr font-extrabold text-xs transition-all duration-500 simple-button ${
                        billingCycle === cycle && !isDisabled
                          ? 'text-white'
                          : isDisabled
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                      style={{
                        zIndex: 2,
                        background: 'transparent',
                        transform: billingCycle === cycle && !isDisabled ? 'scale(1.02)' : 'scale(1)',
                        textShadow: billingCycle === cycle && !isDisabled ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled ? 0.5 : 1
                      }}
                    >
                      {cycle === 'weekly' ? '주간' : cycle === 'monthly' ? '월간' : '연간'}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 가격 표시 */}
          <div className="text-center mb-2 ml-4 fade-start fade-price">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center space-x-1 relative">
                {/* Price.png 이미지를 가격 요소에 상대적으로 배치 */}
                <div 
                  key={`price-img-${selectedPlan}-${billingCycle}`}
                  className="absolute -top-1 -left-8 z-0 rotate-12"
                  style={{
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    animation: 'priceImageChange 0.6s ease-out forwards'
                  }}
                >
                  <img 
                    src="/Price2.png" 
                    alt="Price" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span 
                  key={`price-${selectedPlan}-${billingCycle}`}
                  className="text-[42px] font-extrabold text-gray-800 font-dongle"
                  style={{
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: 'scale(1.02)',
                    opacity: 1,
                    animation: 'priceChange 0.6s ease-out forwards'
                  }}
                >
                  ${currentPrice.price.toFixed(2)}
                </span>
                {currentPrice.originalPrice && (
                  <span 
                    key={`original-price-${selectedPlan}-${billingCycle}`}
                    className="text-[24px] -mb-2 text-gray-500 line-through font-medium font-dongle"
                    style={{
                      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      opacity: 0.8,
                      animation: 'fadeInUp 0.6s ease-out 0.1s forwards'
                    }}
                  >
                    ${currentPrice.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {currentPrice.savings && (
                <span 
                  key={`savings-${selectedPlan}-${billingCycle}`}
                  className="text-white text-xs pl-3 pr-2.5 py-1 mb-1 rounded-full font-medium font-jua"
                  style={{
                    background: 'linear-gradient(135deg,rgb(219, 105, 63) 0%,rgb(240, 125, 63) 100%)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: 'scale(1)',
                    animation: 'bounceIn 0.6s ease-out 0.2s forwards',
                    opacity: 0
                  }}>
                  SAVE {currentPrice.savings}
                </span>
              )}
            </div>
          </div>

          {/* 구독 버튼 */}
          <div className="space-y-3 fade-start fade-buttons">
            <button
              onClick={() => handleSubscribe(selectedPlan)}
              className="w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg plan-button-clickable"
              style={{ 
                backgroundColor: '#56874f',
                color: 'white',
                transform: 'scale(1)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              <span 
                style={{
                  display: 'inline-block',
                  transform: 'scale(1)'
                }}
              >
                {currentPlan.name} 시작하기
              </span>
            </button>
            
            <button
              onClick={handleClose}
              className="w-full retro-card text-gray-700 font-semibold py-4 px-6 font-jua plan-button-clickable"
            >
              나중에
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* CSS 스타일 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes priceChange {
          0% { 
            opacity: 0.5;
            transform: scale(0.95) translateY(10px);
          }
          50% {
            transform: scale(1.05) translateY(-2px);
          }
          100% { 
            opacity: 1;
            transform: scale(1.02) translateY(0px);
          }
        }
        
        @keyframes priceImageChange {
          0% { 
            opacity: 0;
            transform: rotate(12deg) scale(0.8) translateX(-10px);
          }
          50% {
            opacity: 0.5;
            transform: rotate(15deg) scale(1.1);
          }
          100% { 
            opacity: 0.7;
            transform: rotate(12deg) scale(1) translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          0% { 
            opacity: 0;
            transform: translateY(15px);
          }
          100% { 
            opacity: 0.8;
            transform: translateY(0px);
          }
        }
        
        @keyframes bounceIn {
          0% { 
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.1) translateY(-3px);
          }
          70% {
            transform: scale(0.95) translateY(1px);
          }
          100% { 
            opacity: 1;
            transform: scale(1) translateY(0px);
          }
        }
        
        .fade-start { opacity: 0; }
        
        .fade-title { 
          animation: fadeIn 0.8s ease-out 0.8s forwards; 
        }
        
        .fade-features { 
          animation: fadeIn 0.8s ease-out 1.2s forwards; 
        }
        
        .fade-plans { 
          animation: fadeIn 0.8s ease-out 1.6s forwards; 
        }
        
        .fade-switch { 
          animation: fadeIn 0.8s ease-out 1.8s forwards; 
        }
        
        .fade-price { 
          animation: fadeIn 0.8s ease-out 2.0s forwards; 
        }
        
        .fade-buttons { 
          animation: fadeIn 0.8s ease-out 2.2s forwards; 
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        
        /* 플랜 버튼 클릭 효과 */
        .plan-button-clickable {
          transition: transform 0.3s ease-out, background-color 0.5s ease-out;
          -webkit-tap-highlight-color: transparent;
        }
        
        .plan-button-clickable * {
          transition: color 0s ease;
        }
        
        .plan-button-clickable:active {
          transform: scale(0.95) !important;
        }

        /* 온보딩과 동일한 버튼 애니메이션 */
        .simple-button {
          transition: transform 0.15s ease-out;
          -webkit-tap-highlight-color: transparent;
        }
        
        .simple-button:active {
          transform: scale(0.98);
        }
        
        .simple-button:focus {
          outline: none;
          box-shadow: none !important;
        }
        
        button:focus {
          outline: none;
          box-shadow: none !important;
        }
        
        /* 포커스 시 그림자 제거 */
        .retro-button:focus {
          box-shadow: inherit !important;
        }
        
        /* 호버 효과 */
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        /* 스케일 애니메이션 */
        .scale-110 {
          transform: scale(1.1);
        }
        
        .scale-105 {
          transform: scale(1.05);
        }
        
        /* 모달이 열렸을 때 뒤의 버튼들 상태 강제 리셋 */
        .modal-open .simple-button {
          transform: none !important;
          transition: none !important;
        }
        
        .modal-open .premium-badge {
          transform: scale(1) !important;
          transition: none !important;
        }
        
        .modal-open .simple-button:active {
          transform: none !important;
        }
        
        .modal-open .premium-button:active ~ .premium-badge {
          transform: scale(1) !important;
        }
      `}</style>
    </>
  )
}
