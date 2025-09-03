'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useAuth } from '../../contexts/AuthContext'
import { useLoginModal } from './OnboardingLayoutClient'

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSignUpSuccess?: () => void
}

export default function SignUpModal({ isOpen, onClose, onSignUpSuccess }: SignUpModalProps) {
  const { signUp, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth()
  const { setIsModalOpen: setLoginModalOpen } = useLoginModal()
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    fullName?: string
    general?: string
  }>({})
  
  // 지연된 오류 제거를 위한 상태
  const [delayedErrors, setDelayedErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    fullName?: string
    general?: string
  }>({})
  
  // Drag states (same as login modal)
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
  
  // Refs (same as login modal)
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

  // 지연된 오류 제거를 위한 타이머 관리
  const errorTimeoutRefs = useRef<{[key: string]: NodeJS.Timeout}>({})

  // errors 상태가 변경될 때 delayedErrors 동기화
  useEffect(() => {
    Object.keys(errors).forEach(key => {
      const errorKey = key as keyof typeof errors
      
      if (errors[errorKey]) {
        // 새 오류가 있으면 즉시 표시
        setDelayedErrors(prev => ({ ...prev, [errorKey]: errors[errorKey] }))
        
        // 기존 타이머가 있으면 취소
        if (errorTimeoutRefs.current[errorKey]) {
          clearTimeout(errorTimeoutRefs.current[errorKey])
        }
      } else {
        // 오류가 제거되면 애니메이션 시간 후에 DOM에서 제거
        errorTimeoutRefs.current[errorKey] = setTimeout(() => {
          setDelayedErrors(prev => ({ ...prev, [errorKey]: undefined }))
        }, 500) // 500ms = duration-500과 동일
      }
    })
    
    // 클리너
    return () => {
      Object.values(errorTimeoutRefs.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout)
      })
    }
  }, [errors])

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return '이메일을 입력해주세요.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return '올바른 이메일 형식이 아닙니다.'
    }
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return '비밀번호를 입력해주세요.'
    if (password.length < 6) return '비밀번호는 최소 6자 이상이어야 합니다.'
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return '비밀번호는 영문과 숫자를 포함해야 합니다.'
    }
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return '비밀번호 확인을 입력해주세요.'
    if (password !== confirmPassword) return '비밀번호가 일치하지 않습니다.'
    return undefined
  }

  const validateFullName = (fullName: string): string | undefined => {
    if (!fullName) return '이름을 입력해주세요.'
    if (fullName.length < 2) return '이름은 최소 2자 이상이어야 합니다.'
    if (fullName.length > 20) return '이름은 20자 이하로 입력해주세요.'
    if (!/^[가-힣a-zA-Z_]+$/.test(fullName)) return '이름은 한글, 영문, 언더스코어(_)만 사용 가능합니다.'
    return undefined
  }

  // Handle input changes - only clear specific field errors
  const handleEmailChange = (value: string) => {
    setEmail(value)
    // 사용자가 입력을 시작하면 해당 필드와 일반 에러 메시지 부드럽게 제거
    if (errors.email || errors.general) {
      setErrors(prev => ({ ...prev, email: undefined, general: undefined }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    // 사용자가 입력을 시작하면 해당 필드와 일반 에러 메시지 부드럽게 제거
    if (errors.password || errors.general) {
      setErrors(prev => ({ ...prev, password: undefined, general: undefined }))
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    // 사용자가 입력을 시작하면 해당 필드와 일반 에러 메시지 부드럽게 제거
    if (errors.confirmPassword || errors.general) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined, general: undefined }))
    }
  }

  const handleFullNameChange = (value: string) => {
    setFullName(value)
    // 사용자가 입력을 시작하면 해당 필드와 일반 에러 메시지 부드럽게 제거
    if (errors.fullName || errors.general) {
      setErrors(prev => ({ ...prev, fullName: undefined, general: undefined }))
    }
  }

  // Modal opening/closing logic (same as login modal)
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
      setPassword('')
      setConfirmPassword('')
      setFullName('')
      setErrors({})
    }
    
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  // Google 소셜 회원가입/로그인 핸들러
  const handleGoogleSignUp = async () => {
    // OAuth는 즉시 리다이렉션되므로 로컬 로딩 상태 설정하지 않음
    // AuthContext의 loading만 사용하여 깜빡거림 방지
    setErrors({})
    
    try {
      const result = await signInWithGoogle()
      
      if (result.success) {
        if (onSignUpSuccess) {
          onSignUpSuccess()
        }
        // OAuth 로그인은 리다이렉션이므로 모달을 닫지 않음
      } else {
        setErrors({ general: result.error || 'Google 회원가입에 실패했습니다.' })
      }
    } catch (error) {
      console.error('Google 회원가입 실패:', error)
      setErrors({ general: 'Google 회원가입 중 오류가 발생했습니다.' })
    }
    // OAuth는 페이지를 떠나므로 finally 블록 불필요
  }

  // Facebook 소셜 회원가입/로그인 핸들러
  const handleFacebookSignUp = async () => {
    // OAuth는 즉시 리다이렉션되므로 로컬 로딩 상태 설정하지 않음
    // AuthContext의 loading만 사용하여 깜빡거림 방지
    setErrors({})
    
    try {
      const result = await signInWithFacebook()
      
      if (result.success) {
        if (onSignUpSuccess) {
          onSignUpSuccess()
        }
        // OAuth 로그인은 리다이렉션이므로 모달을 닫지 않음
      } else {
        setErrors({ general: result.error || 'Facebook 회원가입에 실패했습니다.' })
      }
    } catch (error) {
      console.error('Facebook 회원가입 실패:', error)
      setErrors({ general: 'Facebook 회원가입 중 오류가 발생했습니다.' })
    }
    // OAuth는 페이지를 떠나므로 finally 블록 불필요
  }

  // Apple 소셜 회원가입/로그인 핸들러
  const handleAppleSignUp = async () => {
    // OAuth는 즉시 리다이렉션되므로 로컬 로딩 상태 설정하지 않음
    // AuthContext의 loading만 사용하여 깜빡거림 방지
    setErrors({})
    
    try {
      const result = await signInWithApple()
      
      if (result.success) {
        if (onSignUpSuccess) {
          onSignUpSuccess()
        }
        // OAuth 로그인은 리다이렉션이므로 모달을 닫지 않음
      } else {
        setErrors({ general: result.error || 'Apple 회원가입에 실패했습니다.' })
      }
    } catch (error) {
      console.error('Apple 회원가입 실패:', error)
      setErrors({ general: 'Apple 회원가입 중 오류가 발생했습니다.' })
    }
    // OAuth는 페이지를 떠나므로 finally 블록 불필요
  }

  // Handle sign up
  const handleSignUp = async () => {
    // 기존 에러 상태를 우선 보존 (깜빡임 방지)
    
    // Validate all fields
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
    const fullNameError = validateFullName(fullName)
    
    if (emailError || passwordError || confirmPasswordError || fullNameError) {
      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        fullName: fullNameError
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await signUp(email, password, fullName)
      
      if (result.success) {
        if (onSignUpSuccess) {
          onSignUpSuccess()
        }
        handleClose()
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: '회원가입 중 오류가 발생했습니다.' })
    } finally {
      setIsLoading(false)
    }
  }

  // All drag handling functions (same as login modal - abbreviated for brevity)
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
        className={`fixed bottom-0 left-0 right-0 rounded-t-3xl z-[2200] max-h-[90vh] overflow-hidden ${
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
              top: '22px',
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
          className="px-6 overflow-y-auto max-h-[calc(90vh-2rem)]"
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
              감사 노트를 시작해요
            </h1>
            <p className="text-sm text-gray-600 font-bold font-noto-serif-kr leading-relaxed">
              하나님의 은혜를 아름답게 기록해보세요
            </p>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-3 mb-6 fade-start fade-social">
            {/* Google 회원가입 */}
            <button
              onClick={handleGoogleSignUp}
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
              Google로 시작하기
            </button>

            {/* Facebook 회원가입 */}
            <button
              onClick={handleFacebookSignUp}
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
              Facebook으로 시작하기
            </button>

            {/* Apple 회원가입 */}
            <button
              onClick={handleAppleSignUp}
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
              Apple로 시작하기
            </button>
          </div>
          
          <div className="w-24 h-1 rounded-full mx-auto mb-6 retro-forest fade-start fade-retro-bar"></div>

          {/* 구분선 */}
          <div className="flex items-center mb-6 fade-start fade-divider">
            <div className="flex-1 h-px bg-[#ccd2cb]"></div>
            <span className="px-4 text-sm text-gray-500 bg-[rgb(235,240,230)] font-noto-serif-kr font-extrabold">또는 이메일로</span>
            <div className="flex-1 h-px bg-[#ccd2cb]"></div>
          </div>

          {/* 회원가입 폼 */}
          <div className="space-y-4 mb-2 fade-start fade-form">
            {/* 이름 입력 */}
            <div className="relative">
              <label className="block text-sm ml-1 font-bold text-gray-600 mb-2 font-noto-serif-kr text-left">
                이름
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                placeholder="이름을 입력하세요"
                className={`w-full px-4 py-3 bg-[#eae4d7] font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-400 ${
                  errors.fullName ? '' : ''
                }`}
                style={{
                  textDecoration: 'none',
                  WebkitTextDecorationLine: 'none'
                }}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                disabled={isLoading}
              />
              {/* 이름 오류 메시지 */}
              <div className={`transition-all ease-out overflow-hidden ${
                errors.fullName ? 'mt-1 mb-1 max-h-16 duration-300' : 'mt-0 mb-0 max-h-0 duration-300 delay-200'
              }`}>
                {delayedErrors.fullName && (
                  <div className={`transition-opacity ease-out ${
                    errors.fullName ? 'opacity-100 duration-200' : 'opacity-0 duration-200'
                  }`}>
                    <p className="text-[#ea6666] pl-1 pt-0.5 text-sm font-bold font-noto-serif-kr">{delayedErrors.fullName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 이메일 입력 */}
            <div className="relative">
              <label className="block text-sm ml-1 font-bold text-gray-600 mb-2 font-noto-serif-kr text-left">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="이메일을 입력하세요"
                className={`w-full px-4 py-3 bg-[#eae4d7] font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-400 ${
                  errors.email ? '' : ''
                }`}
                style={{
                  textDecoration: 'none',
                  WebkitTextDecorationLine: 'none'
                }}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                disabled={isLoading}
              />
              {/* 이메일 오류 메시지 */}
              <div className={`transition-all ease-out overflow-hidden ${
                errors.email ? 'mt-1 mb-1 max-h-16 duration-300' : 'mt-0 mb-0 max-h-0 duration-300 delay-200'
              }`}>
                {delayedErrors.email && (
                  <div className={`transition-opacity ease-out ${
                    errors.email ? 'opacity-100 duration-200' : 'opacity-0 duration-200'
                  }`}>
                    <p className="text-[#ea6666] pl-1 pt-0.5 text-sm font-bold font-noto-serif-kr">{delayedErrors.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="relative">
              <label className="block text-sm ml-1 font-bold text-gray-600 mb-2 font-noto-serif-kr text-left">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className={`w-full px-4 py-3 bg-[#eae4d7] font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-400 ${
                  errors.password ? '' : ''
                }`}
                style={{
                  textDecoration: 'none',
                  WebkitTextDecorationLine: 'none'
                }}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                disabled={isLoading}
              />
              {/* 비밀번호 오류 메시지 */}
              <div className={`transition-all ease-out overflow-hidden ${
                errors.password ? 'mt-1 mb-1 max-h-16 duration-300' : 'mt-0 mb-0 max-h-0 duration-300 delay-200'
              }`}>
                {delayedErrors.password && (
                  <div className={`transition-opacity ease-out ${
                    errors.password ? 'opacity-100 duration-200' : 'opacity-0 duration-200'
                  }`}>
                    <p className="text-[#ea6666] pl-1 pt-0.5 text-sm font-bold font-noto-serif-kr">{delayedErrors.password}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="relative">
              <label className="block text-sm ml-1 font-bold text-gray-600 mb-2 font-noto-serif-kr text-left">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className={`w-full px-4 py-3 bg-[#eae4d7] font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-400 ${
                  errors.confirmPassword ? '' : ''
                }`}
                style={{
                  textDecoration: 'none',
                  WebkitTextDecorationLine: 'none'
                }}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                disabled={isLoading}
              />
              {/* 비밀번호 확인 오류 메시지 */}
              <div className={`transition-all ease-out overflow-hidden ${
                errors.confirmPassword ? 'mt-1 mb-1 max-h-16 duration-300' : 'mt-0 mb-0 max-h-0 duration-300 delay-200'
              }`}>
                {delayedErrors.confirmPassword && (
                  <div className={`transition-opacity ease-out ${
                    errors.confirmPassword ? 'opacity-100 duration-200' : 'opacity-0 duration-200'
                  }`}>
                    <p className="text-[#ea6666] pl-1 pt-0.5 text-sm font-bold font-noto-serif-kr">{delayedErrors.confirmPassword}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 일반 에러 메시지 */}
          <div className={`transition-all ease-out overflow-hidden ${
            errors.general ? 'mb-4 max-h-16 duration-300' : 'mb-0 max-h-0 duration-300 delay-200'
          }`}>
            {delayedErrors.general && (
              <div className={`transition-opacity ease-out ${
                errors.general ? 'opacity-100 duration-200' : 'opacity-0 duration-200'
              }`}>
                <p className="text-[#ea6666] text-sm text-center font-bold font-noto-serif-kr">{delayedErrors.general}</p>
              </div>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <div className="space-y-3 fade-start fade-buttons mb-6 mt-6">
            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className={`w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg plan-button-clickable ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
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
                {isLoading ? '가입 중...' : '회원가입'}
              </span>
            </button>
          </div>

          {/* 로그인 링크 */}
          <div className="text-center pt-4 border-t border-[#ccd2cb] fade-start fade-signup">
            <p className="text-sm text-gray-500 font-bold font-noto-serif-kr">
              이미 계정이 있으신가요?{' '}
              <button
                className="text-[#759861] font-bold transition-colors"
                onClick={() => {
                  handleClose()
                  setTimeout(() => {
                    setLoginModalOpen(true)
                  }, 300)
                }}
              >
                로그인
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
          animation: fadeIn 0.8s ease-out 2.2s forwards; 
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
          animation: fadeIn 0.8s ease-out 2.4s forwards; 
        }
        
        .fade-signup { 
          animation: fadeIn 0.8s ease-out 2.6s forwards; 
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