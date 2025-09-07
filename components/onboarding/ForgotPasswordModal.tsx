'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useAuth } from '../../contexts/AuthContext'
import { useLoginModal } from './OnboardingFlow'
import { createClient } from '../../utils/supabase/client'
import { useTranslationContext } from '../../contexts/TranslationContext'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function ForgotPasswordModal({ isOpen, onClose, onSuccess }: ForgotPasswordModalProps) {
  const { resetPassword } = useAuth()
  const { setIsModalOpen: setLoginModalOpen } = useLoginModal()
  const { t } = useTranslationContext()
  const supabase = createClient()
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    general?: string
  }>({})
  const [delayedErrors, setDelayedErrors] = useState<{
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
  const errorTimeoutRef = useRef<{
    email?: NodeJS.Timeout
    general?: NodeJS.Timeout
  }>({})

  // Validation function
  // 지연된 에러 제거를 위한 로직 (로그인 모달과 동일)
  useEffect(() => {
    // 이메일 에러 처리
    if (errors.email) {
      setDelayedErrors(prev => ({ ...prev, email: errors.email }))
      if (errorTimeoutRef.current.email) {
        clearTimeout(errorTimeoutRef.current.email)
        delete errorTimeoutRef.current.email
      }
    } else {
      if (delayedErrors.email) {
        errorTimeoutRef.current.email = setTimeout(() => {
          setDelayedErrors(prev => ({ ...prev, email: undefined }))
          delete errorTimeoutRef.current.email
        }, 700) // ForgotPasswordModal은 duration-700
      }
    }
    
    // 일반 에러 처리
    if (errors.general) {
      setDelayedErrors(prev => ({ ...prev, general: errors.general }))
      if (errorTimeoutRef.current.general) {
        clearTimeout(errorTimeoutRef.current.general)
        delete errorTimeoutRef.current.general
      }
    } else {
      if (delayedErrors.general) {
        errorTimeoutRef.current.general = setTimeout(() => {
          setDelayedErrors(prev => ({ ...prev, general: undefined }))
          delete errorTimeoutRef.current.general
        }, 700)
      }
    }
    
    return () => {
      if (errorTimeoutRef.current.email) {
        clearTimeout(errorTimeoutRef.current.email)
        delete errorTimeoutRef.current.email
      }
      if (errorTimeoutRef.current.general) {
        clearTimeout(errorTimeoutRef.current.general)
        delete errorTimeoutRef.current.general
      }
    }
  }, [errors.email, errors.general, delayedErrors.email, delayedErrors.general])

  const validateEmail = (email: string): string | undefined => {
    if (!email) return t('onboarding.forgotPassword.errors.emailRequired')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return t('onboarding.forgotPassword.errors.emailInvalid')
    }
    return undefined
  }

  // Real-time validation
  const handleEmailChange = (value: string) => {
    setEmail(value)
    
    // 실시간 이메일 검증
    const emailError = validateEmail(value)
    
    // 일반 에러가 있으면 제거 (애니메이션으로)
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
    
    // 이메일 에러 상태 업데이트 (애니메이션 적용)
    if (errors.email !== emailError) {
      setErrors(prev => ({ ...prev, email: emailError }))
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

  // 이메일 존재 여부 검증 (추가 유유 검증)
  const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
    try {
      console.log('🔍 Checking if email exists:', email)
      
      // profiles 테이블에서 이메일 검색 (로그인 없이도 가능한 RPC 함수 사용)
      const { data, error } = await supabase.rpc('check_email_exists' as any, { 
        check_email: email.trim().toLowerCase() 
      } as any)
      
      if (error) {
        console.log('⚠️ RPC error, fallback to auth attempt:', error)
        // RPC 함수가 없다면 기본 체크 스킵
        return { exists: true }
      }
      
      const exists = data === true
      console.log(exists ? '✅ Email exists' : '❌ Email not found')
      return { exists }
      
    } catch (err) {
      console.warn('⚠️ Email check failed, proceeding:', err)
      // 검증 실패 시 기본적으로 진행
      return { exists: true }
    }
  }

  // Handle password reset
  const handleResetPassword = async () => {
    const emailError = validateEmail(email)
    if (emailError) {
      // 이미 에러가 있고 같은 에러면 유지, 다른 에러면 텍스트만 변경
      if (errors.email !== emailError || errors.general) {
        setErrors({ email: emailError })
      }
      return
    }
    
    setIsLoading(true)
    // 이메일 형식 에러가 없으면 에러 초기화
    if (!errors.general) {
      setErrors({})
    }
    
    try {
      // 1단계: 이메일 존재 여부 체크 (선택적)
      const emailCheck = await checkEmailExists(email)
      
      if (!emailCheck.exists) {
        console.log('❌ Email not registered, showing error')
        const newError = '등록되지 않은 이메일입니다. 가입된 이메일을 확인해주세요.'
        // 이미 에러가 있고 같은 에러면 유지, 다른 에러면 텍스트만 변경
        if (errors.general !== newError && !errors.email) {
          setErrors({ general: newError })
        } else if (errors.general !== newError) {
          setErrors({ general: newError })
        }
        return
      }
      
      // 2단계: Supabase 비밀번호 재설정 요청
      console.log('📧 Sending reset email...')
      const result = await resetPassword(email)
      
      if (result.success) {
        console.log('✅ Reset email sent successfully')
        setIsSuccess(true)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        console.error('❌ Reset email failed:', result.error)
        // 이미 에러가 있고 같은 에러면 유지, 다른 에러면 텍스트만 변경
        if (errors.general !== result.error && !errors.email) {
          setErrors({ general: result.error })
        } else if (errors.general !== result.error) {
          setErrors({ general: result.error })
        }
      }
    } catch (error) {
      console.error('❌ Unexpected error during reset:', error)
      const errorMessage = '비밀번호 재설정 중 오류가 발생했습니다.'
      // 이미 에러가 있고 같은 에러면 유지, 다른 에러면 텍스트만 변경
      if (errors.general !== errorMessage && !errors.email) {
        setErrors({ general: errorMessage })
      } else if (errors.general !== errorMessage) {
        setErrors({ general: errorMessage })
      }
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
      // 모달 내용 초기화
      setEmail('')
      setErrors({})
      setIsSuccess(false)
      setIsLoading(false)
      
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
          {!isSuccess ? (
            <>
              {/* 헤더 */}
              <div className="text-center mb-8 pt-4 fade-start fade-title">
                <h1 className="text-lg -mx-2 font-black text-gray-800 mb-1 font-noto-serif-kr tracking-wide">
                  {t('onboarding.forgotPassword.title')}
                </h1>
                <p className="text-sm text-gray-600 font-bold font-noto-serif-kr leading-relaxed">
                  {t('onboarding.forgotPassword.description')}
                </p>
              </div>

              {/* 이메일 입력 */}
              <div className="fade-start fade-form mb-2">
                <label className="block text-sm ml-1 font-bold text-gray-500 mb-2 font-noto-serif-kr text-left">
                  {t('onboarding.forgotPassword.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => {
                    const error = validateEmail(email)
                    setErrors(prev => ({ ...prev, email: error }))
                  }}
                  placeholder={t('onboarding.forgotPassword.emailPlaceholder')}
                  className="w-full px-4 py-3 bg-[#eae4d7] mb-4 font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-400"
                  style={{
                    textDecoration: 'none',
                    WebkitTextDecorationLine: 'none'
                  }}
                  spellCheck="false"
                  autoCorrect="off"
                  autoCapitalize="off"
                  disabled={isLoading}
                />
              </div>

              {/* 에러 메시지 (로그인 모달과 동일한 구조) */}
              <div className={`transition-all ease-out overflow-hidden -mt-4 relative z-50 ${
                (errors.email || errors.general) ? 'mb-6 max-h-16 duration-300' : 'mb-0 max-h-0 duration-300 delay-200'
              }`}>
                {(delayedErrors.email || delayedErrors.general) && (
                  <div className={`transition-opacity ease-out relative z-50 ${
                    (errors.email || errors.general) ? 'opacity-100 duration-200' : 'opacity-0 duration-200'
                  }`}>
                    <p className="text-[#ea6666] text-sm ml-1.5 text-left font-bold font-noto-serif-kr relative z-50">
                      {delayedErrors.email || delayedErrors.general}
                    </p>
                  </div>
                )}
              </div>

              {/* 재설정 링크 보내기 버튼 */}
              <div className="space-y-3 mb-6 mt-2 fade-start fade-buttons">
                <button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className={`w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg simple-button ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ 
                    backgroundColor: '#db6161',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span>
                    {isLoading ? t('onboarding.forgotPassword.sending') : t('onboarding.forgotPassword.sendButton')}
                  </span>
                </button>
              </div>

              {/* 돌아가기 링크 */}
              <div className="text-center pt-4 border-t border-[#ccd2cb] fade-start fade-back">
                <button
                  className="text-[#759861] font-extrabold font-noto-serif-kr transition-colors simple-button"
                  onClick={() => {
                    handleClose()
                    setTimeout(() => {
                      setLoginModalOpen(true)
                    }, 300)
                  }}
                >
                  {t('onboarding.forgotPassword.backToLogin')}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 성공 화면 */}
              <div className="text-center py-8 fade-start fade-success">
                <div className="text-6xl mb-4">📧</div>
                <h1 className="text-lg font-black text-gray-800 mb-2 font-noto-serif-kr tracking-wide">
                  {t('onboarding.forgotPassword.success')}
                </h1>
                <p className="text-sm text-gray-600 font-bold font-noto-serif-kr leading-relaxed mb-6">
                  {t('onboarding.forgotPassword.successDescription')}
                </p>

                {/* 안내 사항 */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                  <h3 className="text-sm font-black text-blue-800 mb-2 font-noto-serif-kr">
                    📝 확인 사항
                  </h3>
                  <ul className="text-xs text-blue-700 font-bold font-noto-serif-kr space-y-1">
                    <li>• 이메일이 도착하는데 몇 분 소요될 수 있습니다</li>
                    <li>• 스팸함도 함께 확인해주세요</li>
                    <li>• 링크는 24시간 동안 유효합니다</li>
                    <li>• 보안상 60초마다 한 번만 요청 가능합니다</li>
                  </ul>
                </div>
                
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
              </div>
            </>
          )}
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
          transform: scale(0.98) !important;
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