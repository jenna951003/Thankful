'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../contexts/AuthContext'
import { useSignUpModal, useForgotPasswordModal } from './OnboardingFlow'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: (shouldRedirectToOnboarding?: boolean) => void
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const { t } = useTranslation()
  const { signIn, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth()
  const { setIsModalOpen: setSignUpModalOpen } = useSignUpModal()
  const { setIsModalOpen: setForgotPasswordModalOpen } = useForgotPasswordModal()
  
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [delayedError, setDelayedError] = useState<string | null>(null)
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
  const rawDragDistanceRef = useRef(0)
  const initialTouchYRef = useRef(0)
  const isOverscrollingRef = useRef(false)
  const scrollThrottleRef = useRef<number | null>(null)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 지연된 오류 제거를 위한 로직
  useEffect(() => {
    if (error) {
      // 새 오류가 있으면 즉시 표시
      setDelayedError(error)
      
      // 기존 타이머가 있으면 취소
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
        errorTimeoutRef.current = null
      }
    } else {
      // 오류가 제거되면 애니메이션 시간 후에 DOM에서 제거
      if (delayedError) {
        errorTimeoutRef.current = setTimeout(() => {
          setDelayedError(null)
        }, 500) // LoginModal은 duration-500
      }
    }
    
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
        errorTimeoutRef.current = null
      }
    }
  }, [error, delayedError])

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

  const handleLogin = async () => {
    if (!email || !password) {
      console.log('❌ Email or password missing')
      return
    }
    
    console.log('🚀 Starting login process in modal')
    setError(null) // 에러 초기화
    setIsLoading(true)
    
    try {
      console.log('📞 Calling signIn from modal')
      const result = await signIn(email, password)
      console.log('📋 Login result:', result)
      
      if (result.success) {
        console.log('✅ Login successful, calling onLoginSuccess')
        if (onLoginSuccess) {
          onLoginSuccess(result.shouldRedirectToOnboarding)
        }
        // 약간의 지연 후 모달 닫기 (상태 업데이트 완료를 위함)
        setTimeout(() => {
          handleClose()
        }, 100)
      } else {
        console.error('❌ Login failed:', result.error)
        setError(result.error || '로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('💥 Login exception:', error)
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      console.log('🏁 Login process finished, resetting loading state')
      setIsLoading(false)
    }
  }

  // Google 소셜 로그인 핸들러
  const handleGoogleLogin = async () => {
    // OAuth는 즉시 리다이렉션되므로 로컬 로딩 상태 설정하지 않음
    // AuthContext의 loading만 사용하여 깜빡거림 방지
    setError(null)
    
    try {
      const result = await signInWithGoogle()
      
      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess()
        }
        // OAuth 로그인은 리다이렉션이므로 모달을 닫지 않음
      } else {
        setError(result.error || 'Google 로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('Google 로그인 실패:', error)
      setError('Google 로그인 중 오류가 발생했습니다.')
    }
    // OAuth는 페이지를 떠나므로 finally 블록 불필요
  }

  // Facebook 소셜 로그인 핸들러
  const handleFacebookLogin = async () => {
    // OAuth는 즉시 리다이렉션되므로 로컬 로딩 상태 설정하지 않음
    setError(null)
    
    try {
      const result = await signInWithFacebook()
      
      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess()
        }
        // OAuth 로그인은 리다이렉션이므로 모달을 닫지 않음
      } else {
        setError(result.error || 'Facebook 로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('Facebook 로그인 실패:', error)
      setError('Facebook 로그인 중 오류가 발생했습니다.')
    }
  }

  // Apple 소셜 로그인 핸들러
  const handleAppleLogin = async () => {
    // OAuth는 즉시 리다이렉션되므로 로컬 로딩 상태 설정하지 않음
    setError(null)
    
    try {
      const result = await signInWithApple()
      
      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess()
        }
        // OAuth 로그인은 리다이렉션이므로 모달을 닫지 않음
      } else {
        setError(result.error || 'Apple 로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('Apple 로그인 실패:', error)
      setError('Apple 로그인 중 오류가 발생했습니다.')
    }
  }

  // 회원가입 모달로 전환
  const handleShowSignUp = () => {
    handleClose()
    setTimeout(() => {
      setSignUpModalOpen(true)
    }, 300)
  }

  // 비밀번호 찾기 모달로 전환
  const handleShowForgotPassword = () => {
    handleClose()
    setTimeout(() => {
      setForgotPasswordModalOpen(true)
    }, 300)
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
          className="px-6 overflow-y-auto max-h-[calc(85vh-2rem)]"
          style={{
            touchAction: scrollPhase === 'drag' ? 'none' : 'pan-y',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 'calc(2rem + var(--actual-safe-bottom, 0px))'
          }}
        >
          {/* 헤더 */}
          <div className="text-center mb-6 pt-4 fade-start fade-title">
            <h1 className="text-lg -mx-2 font-black text-gray-800 mb-1 font-noto-serif-kr tracking-wide">
              {t('onboarding.login.title')}
            </h1>
            <p className="text-sm text-gray-600 font-bold font-noto-serif-kr leading-relaxed">
              {t('onboarding.login.subtitle')}
            </p>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-3 mb-6 fade-start fade-social">
            {/* Google 로그인 */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full retro-card text-gray-700 font-semibold py-4 px-6 font-jua text-lg plan-button-clickable oauth-button oauth-google flex items-center justify-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('onboarding.login.googleButton')}
            </button>

            {/* Facebook 로그인 */}
            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className={`w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg plan-button-clickable oauth-button oauth-facebook flex items-center justify-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                backgroundColor: '#1877F2',
                color: 'white'
              }}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {t('onboarding.login.facebookButton')}
            </button>

            {/* Apple 로그인 */}
            <button
              onClick={handleAppleLogin}
              disabled={isLoading}
              className={`w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg plan-button-clickable oauth-button oauth-apple flex items-center justify-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                backgroundColor: '#2c2c2c',
                color: 'white'
              }}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              {t('onboarding.login.appleButton')}
            </button>
          </div>
          <div className="w-24 h-1 rounded-full mx-auto mb-6 retro-forest fade-start fade-retro-bar"></div>

          {/* 구분선 */}
          <div className="flex items-center mb-6 fade-start fade-divider">
            <div className="flex-1 h-px bg-[#ccd2cb]"></div>
            <span className="px-4 text-sm text-gray-500 bg-[rgb(235,240,230)] font-noto-serif-kr font-extrabold">{t('onboarding.login.emailDivider')}</span>
            <div className="flex-1 h-px bg-[#ccd2cb]"></div>
          </div>

          {/* 이메일/비밀번호 로그인 */}
          <div className="space-y-4 mb-2 fade-start fade-form">
            {/* 이메일 입력 */}
            <div className="relative">
              <label className="block text-sm ml-1 font-bold text-gray-500 mb-2 font-noto-serif-kr text-left">
                {t('onboarding.login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  // 사용자가 입력을 시작하면 에러 메시지 부드럽게 제거
                  if (error) {
                    setError(null)
                  }
                }}
                placeholder={t('onboarding.login.emailPlaceholder')}
                className="w-full px-4 py-3 bg-[#eae4d7] font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-500"
                style={{
                  borderColor: email ? '#56874f' : undefined,
                  textDecoration: 'none',
                  WebkitTextDecorationLine: 'none'
                }}
                disabled={isLoading}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="relative">
              <label className="block text-sm ml-1 font-bold text-gray-500 mb-2 font-noto-serif-kr text-left">
                {t('onboarding.login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  // 사용자가 입력을 시작하면 에러 메시지 부드럽게 제거
                  if (error) {
                    setError(null)
                  }
                }}
                placeholder={t('onboarding.login.passwordPlaceholder')}
                className="w-full px-4 py-3 bg-[#eae4d7] font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-500"
                style={{
                  borderColor: password ? '#56874f' : undefined,
                  textDecoration: 'none',
                  WebkitTextDecorationLine: 'none'
                }}
                disabled={isLoading}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          <div className={`transition-all ease-out overflow-hidden ${
            error ? 'mb-4 max-h-16 duration-300' : 'mb-0 max-h-0 duration-300 delay-200'
          }`}>
            {delayedError && (
              <div className={`transition-opacity ease-out ${
                error ? 'opacity-100 duration-200' : 'opacity-0 duration-200'
              }`}>
                <p className="text-[#ea6666] text-sm ml-1 text-left font-bold font-noto-serif-kr">{delayedError}</p>
              </div>
            )}
          </div>

          {/* 비밀번호 찾기 링크 */}
          <div className="text-right mb-4 mr-1 fade-start fade-forgot">
            <button
              className="text-sm font-bold font-noto-serif-kr duration-200"
              onClick={handleShowForgotPassword}
            >
              {t('onboarding.login.forgotPassword')}
            </button>
          </div>

          {/* 로그인 버튼 */}
          <div className="space-y-3 fade-start fade-buttons">
            <button
              onClick={handleLogin}
              disabled={!email || !password || isLoading}
              className={`w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg plan-button-clickable ${
                (!email || !password || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
                {isLoading ? t('onboarding.login.loggingIn') : t('onboarding.login.loginButton')}
              </span>
            </button>
          </div>

          {/* 회원가입 링크 */}
          <div className="text-center mt-6 pt-4 border-t border-[#ccd2cb] fade-start fade-signup">
            <p className="text-sm text-gray-500 font-bold font-noto-serif-kr">
              {t('onboarding.login.noAccount')}{' '}
              <button
                className="text-[#759861] font-bold transition-colors"
                onClick={handleShowSignUp}
              >
                {t('onboarding.login.signUpButton')}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* CSS 스타일 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fade-start { opacity: 0; }
        
        .fade-title { 
          animation: fadeIn 0.8s ease-out 0.8s forwards; 
        }
        
        .fade-social { 
          animation: fadeIn 0.8s ease-out 1.2s forwards; 
        }
        
        .fade-retro-bar { 
          animation: fadeIn 0.8s ease-out 1.4s forwards; 
        }
        
        .fade-divider { 
          animation: fadeIn 0.8s ease-out 1.6s forwards; 
        }
        
        .fade-form { 
          animation: fadeIn 0.8s ease-out 2.0s forwards; 
        }
        
        .fade-error { 
          animation: fadeIn 0.8s ease-out 2.1s forwards; 
        }
        
        /* 에러 메시지 부드러운 슬라이드 */
        .error-message-slide { 
          animation: errorSlideDown 0.5s ease-out forwards;
          transform: translateY(-8px);
          opacity: 0;
        }
        
        @keyframes errorSlideDown {
          0% { 
            opacity: 0;
            transform: translateY(-8px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-forgot { 
          animation: fadeIn 0.8s ease-out 2.2s forwards; 
        }
        
        .fade-buttons { 
          animation: fadeIn 0.8s ease-out 2.4s forwards; 
        }
        
        .fade-signup { 
          animation: fadeIn 0.8s ease-out 2.6s forwards; 
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        
        /* 플랜 버튼 클릭 효과 */
        .plan-button-clickable {
          transition: transform 0.15s ease-out, background-color 0.6s ease, color 0.6s ease;
          -webkit-tap-highlight-color: transparent;
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
        
        /* 입력 필드 스타일 */
        input:focus {
          outline: none;
          ring: none;
        }
        
        /* 플레이스홀더 페이드 애니메이션 */
        .placeholder-fade::placeholder {
          transition: opacity 0.3s ease-out;
        }
        
        .placeholder-fade:focus::placeholder {
          opacity: 0;
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
        
        /* OAuth 버튼 전용 스타일 */
        .oauth-button {
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease-out;
          backdrop-filter: blur(0);
        }
        
        .oauth-button:not(:disabled):hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        
        .oauth-button:not(:disabled):active {
          transform: translateY(0) scale(0.98) !important;
          transition: transform 0.1s ease-out;
        }
        
        .oauth-google:not(:disabled):hover {
          box-shadow: 0 6px 20px rgba(66, 133, 244, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .oauth-facebook:not(:disabled):hover {
          box-shadow: 0 6px 20px rgba(24, 119, 242, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .oauth-apple:not(:disabled):hover {
          box-shadow: 0 6px 20px rgba(44, 44, 44, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* OAuth 버튼 로딩 상태 최적화 */
        .oauth-button:disabled {
          transform: none !important;
          filter: none !important;
        }
      `}</style>
    </>
  )
}