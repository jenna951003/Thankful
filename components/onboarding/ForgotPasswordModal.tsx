'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useAuth } from '../../contexts/AuthContext'
import { useLoginModal } from './OnboardingLayoutClient'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function ForgotPasswordModal({ isOpen, onClose, onSuccess }: ForgotPasswordModalProps) {
  const { resetPassword } = useAuth()
  const { setIsModalOpen: setLoginModalOpen } = useLoginModal()
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    general?: string
  }>({})
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Drag states (same as other modals)
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
  
  // Refs (same as other modals)
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

  // Validation function
  const validateEmail = (email: string): string | undefined => {
    if (!email) return '이메일을 입력해주세요.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return '올바른 이메일 형식이 아닙니다.'
    }
    return undefined
  }

  // Real-time validation
  const handleEmailChange = (value: string) => {
    setEmail(value)
    // 사용자가 입력을 시작하면 일반 에러 메시지 부드럽게 제거
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
    if (errors.email) {
      const error = validateEmail(value)
      setErrors(prev => ({ ...prev, email: error }))
    }
  }

  // Modal opening/closing logic
  useEffect(() => {
    if (isOpen) {
      mainScrollPositionRef.current = window.scrollY
      
      const activeElement = document.activeElement as HTMLElement
      if (activeElement) {
        activeElement.blur()
      }
      
      document.querySelectorAll('button').forEach((el) => {
        (el as HTMLElement).blur()
      })
      
      document.querySelectorAll('.simple-button').forEach((el) => {
        (el as HTMLElement).style.transform = ''
      })
      
      document.querySelectorAll('.premium-badge').forEach((el) => {
        (el as HTMLElement).style.transform = 'scale(1)'
      })
      
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${mainScrollPositionRef.current}px`
      document.body.style.width = '100%'
      document.body.style.touchAction = 'none'
      document.body.classList.add('modal-open')
      
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.touchAction = ''
      document.body.classList.remove('modal-open')
      
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
      
      // Reset form
      setEmail('')
      setErrors({})
      setIsSuccess(false)
    }
    
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  // Handle password reset
  const handleResetPassword = async () => {
    // 기존 에러 상태를 우선 보존 (깜빡임 방지)
    
    const emailError = validateEmail(email)
    if (emailError) {
      setErrors({ email: emailError })
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setIsSuccess(true)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: '비밀번호 재설정 중 오류가 발생했습니다.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Drag handling functions (abbreviated - same logic as other modals)
  const applyRubberBandEffect = (offset: number) => {
    const threshold = 80
    if (offset <= threshold) return offset
    const excessDistance = offset - threshold
    const maxExcess = 300
    const normalizedExcess = Math.min(excessDistance / maxExcess, 1)
    const resistedExcess = excessDistance * (1 - Math.pow(normalizedExcess, 0.4))
    return threshold + resistedExcess
  }

  const handleClose = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement) {
      activeElement.blur()
    }
    
    setIsVisible(false)
    setIsDragging(false)
    setCanDragFromScroll(false)
    
    setTimeout(() => {
      onClose()
      
      requestAnimationFrame(() => {
        document.querySelectorAll('.simple-button').forEach((button) => {
          const btn = button as HTMLElement
          btn.blur()
          btn.style.transform = ''
        })
        
        document.querySelectorAll('.premium-badge').forEach((el) => {
          (el as HTMLElement).style.transform = ''
        })
      })
    }, 500)
  }, [onClose])

  // Complete scroll-drag interaction system (same as SubscriptionModal)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || !isOpen) return

    const handleScroll = () => {
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
      
      scrollThrottleRef.current = requestAnimationFrame(() => {
        const currentScrollTop = scrollContainer.scrollTop
        lastScrollTopRef.current = currentScrollTop
        
        const maxScrollForFade = 50
        const fadeOpacity = Math.min(currentScrollTop / maxScrollForFade, 1)
        setScrollFadeOpacity(fadeOpacity)
        
        if (currentScrollTop > 0) {
          setScrollPhase('scroll')
          setOverscrollAmount(0)
          isOverscrollingRef.current = false
        }
      })
    }

    const handleScrollTouchStart = (e: TouchEvent) => {
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
      
      // Phase 1: Normal scrolling (scrollTop > 0 or upward swipe)
      if (scrollTop > 0 || (scrollTop === 0 && deltaY < 0)) {
        setScrollPhase('scroll')
        return
      }
      
      // Phase 2: Overscroll at top (downward pull)
      if (scrollTop === 0 && deltaY > 0) {
        if (!isOverscrollingRef.current) {
          isOverscrollingRef.current = true
          setScrollPhase('overscroll')
          const dragData = { y: initialTouchYRef.current, time: Date.now() }
          setDragStart(dragData)
          dragStartRef.current = dragData
          dragOffsetRef.current = 0
          setIsDragging(true)
        }
        
        e.preventDefault()
        setScrollPhase('drag')
        
        const totalDistance = currentTouchY - initialTouchYRef.current
        const rawDragDistance = Math.max(0, totalDistance)
        const rubberBandOffset = applyRubberBandEffect(rawDragDistance)
        
        rawDragDistanceRef.current = rawDragDistance
        setDragOffset(rubberBandOffset)
        dragOffsetRef.current = rubberBandOffset
        setOverscrollAmount(rubberBandOffset)
        
        // Haptic feedback
        if (rawDragDistance > 100 && !hasTriggeredHaptic) {
          try {
            Haptics.impact({ style: ImpactStyle.Medium })
            setHasTriggeredHaptic(true)
          } catch (error) {}
        } else if (rawDragDistance <= 100) {
          setHasTriggeredHaptic(false)
        }
      }
    }

    const handleTouchEnd = () => {
      if (isOverscrollingRef.current && dragStartRef.current) {
        handleDragEnd()
      }
      
      isOverscrollingRef.current = false
      setScrollPhase('scroll')
      setIsDragging(false)
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    scrollContainer.addEventListener('touchstart', handleScrollTouchStart, { passive: true })
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false })
    scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
      scrollContainer.removeEventListener('touchstart', handleScrollTouchStart)
      scrollContainer.removeEventListener('touchmove', handleTouchMove)
      scrollContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isOpen, hasTriggeredHaptic])

  // Drag handle touch event listeners (same as SubscriptionModal)
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

  // Drag move handler
  const handleDragMove = useCallback((clientY: number) => {
    if (!dragStart) return
    
    const offset = clientY - dragStart.y
    if (offset > 0) {
      const rawDragDistance = offset
      const rubberBandOffset = applyRubberBandEffect(rawDragDistance)
      
      rawDragDistanceRef.current = rawDragDistance
      setDragOffset(rubberBandOffset)
      dragOffsetRef.current = rubberBandOffset
      
      if (rawDragDistance > 100 && !hasTriggeredHaptic) {
        try {
          Haptics.impact({ style: ImpactStyle.Medium })
          setHasTriggeredHaptic(true)
        } catch (error) {}
      } else if (rawDragDistance <= 100) {
        setHasTriggeredHaptic(false)
      }
    }
  }, [dragStart, hasTriggeredHaptic])

  // Drag end handler
  const handleDragEnd = useCallback(() => {
    if (!dragStartRef.current) return
    
    const rawDragDistance = rawDragDistanceRef.current
    const visualOffset = dragOffsetRef.current
    const dragDuration = Math.max(Date.now() - dragStartRef.current.time, 1)
    const rawVelocity = rawDragDistance / dragDuration
    const screenHeight = window.innerHeight
    const minDragDuration = 150
    
    const shouldClose = 
      dragDuration >= minDragDuration && (
        rawDragDistance > 150 || 
        rawVelocity > 0.5 || 
        rawDragDistance > screenHeight * 0.25
      )
    
    if (shouldClose) {
      try {
        Haptics.impact({ style: ImpactStyle.Heavy })
      } catch (error) {}
      handleClose()
    } else {
      try {
        Haptics.impact({ style: ImpactStyle.Light })
      } catch (error) {}
      setDragStart(null)
      dragStartRef.current = null
      setIsHandleDrag(false)
      setIsDragging(false)
      setCanDragFromScroll(false)
      setHasTriggeredHaptic(false)
      dragOffsetRef.current = 0
      rawDragDistanceRef.current = 0
      requestAnimationFrame(() => {
        setDragOffset(0)
      })
    }
  }, [handleClose, hasTriggeredHaptic])

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
      if (!dragStartRef.current) return
      const offset = e.clientY - dragStartRef.current.y
      if (offset > 0) {
        const rawDragDistance = offset
        const rubberBandOffset = applyRubberBandEffect(rawDragDistance)
        rawDragDistanceRef.current = rawDragDistance
        setDragOffset(rubberBandOffset)
        dragOffsetRef.current = rubberBandOffset
      }
    }
    
    const handleMouseUp = () => {
      if (dragStartRef.current) {
        const rawDragDistance = rawDragDistanceRef.current
        const dragDuration = Math.max(Date.now() - dragStartRef.current.time, 1)
        const rawVelocity = rawDragDistance / dragDuration
        const screenHeight = window.innerHeight
        const minDragDuration = 150
        
        const shouldClose = 
          dragDuration >= minDragDuration && (
            rawDragDistance > 150 || 
            rawVelocity > 0.5 || 
            rawDragDistance > screenHeight * 0.25
          )
        
        if (shouldClose) {
          try {
            Haptics.impact({ style: ImpactStyle.Heavy })
          } catch (error) {}
          handleClose()
        } else {
          try {
            Haptics.impact({ style: ImpactStyle.Light })
          } catch (error) {}
          setDragStart(null)
          dragStartRef.current = null
          setIsHandleDrag(false)
          setIsDragging(false)
          setCanDragFromScroll(false)
          setHasTriggeredHaptic(false)
          dragOffsetRef.current = 0
          rawDragDistanceRef.current = 0
          requestAnimationFrame(() => {
            setDragOffset(0)
          })
        }
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

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
          background: 'rgb(235, 240, 230)',
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

          {/* 상단 페이드 가림막 */}
          <div 
            className="absolute left-0 right-0 h-14 pointer-events-none z-10 transition-opacity duration-200 ease-out"
            style={{
              top: '24px',
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
          {!isSuccess ? (
            <>
              {/* 헤더 */}
              <div className="text-center mb-8 pt-4 fade-start fade-title">
                <h1 className="text-lg -mx-2 font-black text-gray-800 mb-1 font-noto-serif-kr tracking-wide">
                  비밀번호를 잊으셨나요? 🔐
                </h1>
                <p className="text-sm text-gray-600 font-bold font-noto-serif-kr leading-relaxed">
                  등록된 이메일로 재설정 링크를 보내드립니다
                </p>
              </div>

              {/* 이메일 입력 */}
              <div className="mb-6 fade-start fade-form">
                <label className="block text-sm ml-1 font-bold text-gray-500 mb-2 font-noto-serif-kr text-left">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => {
                    const error = validateEmail(email)
                    setErrors(prev => ({ ...prev, email: error }))
                  }}
                  placeholder="가입하신 이메일을 입력하세요"
                  className="w-full px-4 py-3 bg-[#eae4d7] font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-400"
                  style={{
                    textDecoration: 'none',
                    WebkitTextDecorationLine: 'none'
                  }}
                  spellCheck="false"
                  autoCorrect="off"
                  autoCapitalize="off"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-[#ea6666] pl-1 pt-0.5 text-sm mt-1 font-bold font-noto-serif-kr">{errors.email}</p>
                )}
              </div>

              {/* 일반 에러 메시지 */}
              <div className={`transition-all duration-700 ease-out overflow-hidden ${
                errors.general ? 'mb-6 opacity-100 max-h-16' : 'mb-0 opacity-0 max-h-0'
              }`}>
                {errors.general && (
                  <div className="error-message-slide">
                    <p className="text-red-500 text-sm text-center font-bold font-noto-serif-kr transition-all duration-300">{errors.general}</p>
                  </div>
                )}
              </div>

              {/* 재설정 링크 보내기 버튼 */}
              <div className="space-y-3 mb-6 fade-start fade-buttons">
                <button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className={`w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg plan-button-clickable ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ 
                    backgroundColor: '#db6161',
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
                    {isLoading ? '전송 중...' : '재설정 링크 보내기'}
                  </span>
                </button>
              </div>

              {/* 돌아가기 링크 */}
              <div className="text-center pt-4 border-t border-[#ccd2cb] fade-start fade-back">
                <button
                  className="text-[#759861] font-extrabold font-noto-serif-kr transition-colors"
                  onClick={() => {
                    handleClose()
                    setTimeout(() => {
                      setLoginModalOpen(true)
                    }, 300)
                  }}
                >
                  로그인으로 돌아가기
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 성공 화면 */}
              <div className="text-center py-8 fade-start fade-success">
                <div className="text-6xl mb-4">📧</div>
                <h1 className="text-lg font-black text-gray-800 mb-2 font-noto-serif-kr tracking-wide">
                  재설정 링크를 보냈습니다!
                </h1>
                <p className="text-sm text-gray-600 font-bold font-noto-serif-kr leading-relaxed mb-6">
                  <span className="text-[#759861] font-black">{email}</span>로<br />
                  비밀번호 재설정 링크를 보냈습니다.<br />
                  이메일을 확인해주세요.
                </p>
                
                <div className="space-y-3 mb-4">
                  <button
                    onClick={() => {
                      handleClose()
                      setTimeout(() => {
                        setLoginModalOpen(true)
                      }, 300)
                    }}
                    className="w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg plan-button-clickable"
                    style={{ 
                      backgroundColor: '#56874f',
                      color: 'white',
                      transform: 'scale(1)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    로그인으로 돌아가기
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 font-bold font-noto-serif-kr">
                  이메일이 오지 않았나요? 스팸함도 확인해보세요.
                </p>
              </div>
            </>
          )}
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
        
        .fade-form { 
          animation: fadeIn 0.8s ease-out 1.2s forwards; 
        }
        
        .fade-error { 
          animation: fadeIn 0.8s ease-out 1.4s forwards; 
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
        
        .fade-buttons { 
          animation: fadeIn 0.8s ease-out 1.6s forwards; 
        }
        
        .fade-back { 
          animation: fadeIn 0.8s ease-out 1.8s forwards; 
        }
        
        .fade-success { 
          animation: fadeIn 0.8s ease-out 0.6s forwards; 
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
      `}</style>
    </>
  )
}