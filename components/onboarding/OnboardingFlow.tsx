'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { OnboardingProvider, useOnboarding } from '../../contexts/OnboardingContext'
import ProgressIndicator from './ProgressIndicator'
import SubscriptionModal from './SubscriptionModal'
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'
import ForgotPasswordModal from './ForgotPasswordModal'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useAuth } from '../../contexts/AuthProvider'
import { saveOnboardingData } from '../../utils/onboarding'

// 온보딩 스크린 컴포넌트들 임포트
import WelcomeScreen from './WelcomeScreen'
import GratitudeExperienceScreen from './GratitudeExperienceScreen'
import UsagePurposeScreen from './UsagePurposeScreen'
import InterestAreasScreen from './InterestAreasScreen'
import NotificationSettingsScreen from './NotificationSettingsScreen'
import FirstGratitudeScreen from './FirstGratitudeScreen'
import SubscriptionScreen from './SubscriptionScreen'
import OnboardingCompleteClient from './OnboardingCompleteClient'

// 구독 모달 컨텍스트
const SubscriptionModalContext = createContext<{
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}>({
  isModalOpen: false,
  setIsModalOpen: () => {}
})

export const useSubscriptionModal = () => useContext(SubscriptionModalContext)

// 로그인 모달 컨텍스트
const LoginModalContext = createContext<{
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}>({
  isModalOpen: false,
  setIsModalOpen: () => {}
})

export const useLoginModal = () => useContext(LoginModalContext)

// 회원가입 모달 컨텍스트
const SignUpModalContext = createContext<{
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}>({
  isModalOpen: false,
  setIsModalOpen: () => {}
})

export const useSignUpModal = () => useContext(SignUpModalContext)

// 비밀번호 찾기 모달 컨텍스트
const ForgotPasswordModalContext = createContext<{
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}>({
  isModalOpen: false,
  setIsModalOpen: () => {}
})

export const useForgotPasswordModal = () => useContext(ForgotPasswordModalContext)


interface OnboardingFlowProps {
  locale: string
}

function OnboardingContent({ locale }: OnboardingFlowProps) {
  const { isWebEnvironment } = useDeviceDetection()
  const [showProgress, setShowProgress] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [showBottomImage, setShowBottomImage] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [displayStep, setDisplayStep] = useState(1)
  const [imageKey, setImageKey] = useState(0) // 이미지 강제 리렌더링용
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false) // 🎯 페이드아웃 상태 추가
  const { state, startTransition, setStep } = useOnboarding()
  const { user, updateProfile } = useAuth()
  const router = useRouter()

  const canGoBack = currentStep > 1

  // OnboardingContext와 로컬 state 동기화
  useEffect(() => {
    if (state.currentStep !== currentStep) {
      setCurrentStep(state.currentStep)
      setDisplayStep(state.currentStep)
    }
  }, [state.currentStep])

  // 스텝 변경 함수
  const changeStep: (step: number) => void = (newStep: number) => {
    if (newStep < 1 || newStep > 8) return
    
    // 전환 시작
    startTransition()
    
    // 페이드아웃 후 스텝 변경 (기존 타이밍 그대로 유지)
    setTimeout(() => {
      setCurrentStep(newStep)
      setStep(newStep)
    }, 400)
  }

  // 로그인 성공 핸들러
  const handleLoginSuccess = (shouldRedirectToOnboarding?: boolean) => {
    console.log('🎯🎯🎯 LOGIN SUCCESS HANDLER CALLED!!! 🎯🎯🎯', { shouldRedirectToOnboarding })
    console.log('🎯 로그인 성공 - 페이드아웃 시작', { shouldRedirectToOnboarding })
    
    if (shouldRedirectToOnboarding) {
      // 온보딩 미완료 시 2페이지로 이동
      changeStep(2)
    } else {
      // 🎯 온보딩 완료 시 홈페이지로 부드럽게 전환
      console.log('🎯 Step 3: onLoginSuccess called - waiting 1s before fadeout')
      
      // 🎯 1단계: 1초 대기 (모달 닫힌 후 여유 시간)
      setTimeout(() => {
        console.log('🎯 Step 4: 1s wait completed - starting fadeout')
        // 2단계: 페이드아웃 시작
        setIsFadingOut(true)
        
        // 🎯 3단계: 페이드아웃 완료 후 라우터 이동 (500ms 후)
        setTimeout(() => {
          console.log('🎯 Step 5: Fadeout complete - navigating to home')
          // 로그인 후 리다이렉트임을 표시
          console.log('🎯 Setting sessionStorage flags before navigation')
          sessionStorage.setItem('justLoggedIn', 'true')
          // 🎯 homePageNoFadeIn 플래그는 제거 (새로운 애니메이션 시스템 사용)
          console.log('🎯 SessionStorage flags set:', {
            justLoggedIn: sessionStorage.getItem('justLoggedIn')
          })
          console.log('🎯 About to navigate to:', `/${locale}`)
          router.replace(`/${locale}`)
          console.log('🎯 Navigation completed')
        }, 500) // 페이드아웃 애니메이션 시간
      }, 1000) // 모달 닫힌 후 대기 시간
    }
  }

  // 온보딩 데이터 저장 처리 (기존과 동일)
  useEffect(() => {
    if (state.data) {
      if (!user) {
        saveOnboardingData(state.data)
        console.log('💾 Saved onboarding data to localStorage')
      } else {
        if (state.currentStep > 1 && state.currentStep <= 8) {
          console.log(`📝 Onboarding in progress: step ${state.currentStep}`)
        }
      }
    }
  }, [state.data, state.currentStep, user, updateProfile])

  // 애니메이션 로직 (기존과 동일)
  useEffect(() => {
    // 페이지 변경 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0)
    
    // 전환 중이면 콘텐츠를 숨김 (프로그레스바는 항상 표시)
    if (state.isTransitioning) {
      setShowContent(false)
      setShowBottomImage(false)
      return
    }

    // 🎯 새로운 안정적인 애니메이션 시퀀스
    console.log('🎭 Starting stabilized animation sequence')
    
    // 1단계: 메인 콘텐츠 페이드인 (150ms 후)
    const timer1 = setTimeout(() => {
      console.log('🟡 Step 1: Showing main content')
      setShowContent(true)
    }, 150)

    // 2단계: 이미지 완전히 페이드아웃 (400ms 후)
    const timer2 = setTimeout(() => {
      console.log('🟡 Step 2: Completely hiding bottom image')
      setShowBottomImage(false)
    }, 400)
    
    // 3단계: displayStep 업데이트 + 이미지 소스 변경 (800ms 후 - 페이드아웃 완전 완료 후)
    const timer3 = setTimeout(() => {
      console.log('🟢 Step 3: Updating display step after fadeout complete')
      setDisplayStep(currentStep)
      setImageKey(prev => prev + 1) // 강제 리렌더링
    }, 800)
    
    // 4단계: 새 이미지 페이드인 (850ms 후)
    const timer4 = setTimeout(() => {
      console.log('🟢 Step 4: Showing new image')
      setShowBottomImage(true)
    }, 850)
    
    // 5단계: isTransitioning 해제 (1250ms 후 - 모든 애니메이션 완료 후)
    const timer5 = setTimeout(() => {
      console.log('✅ Step 5: Animation sequence complete')
      // OnboardingContext의 isTransitioning을 해제하기 위해 setStep 호출
      setStep(currentStep)
    }, 1250)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [state.isTransitioning, currentStep])


  return (
    <SubscriptionModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      <LoginModalContext.Provider value={{ isModalOpen: isLoginModalOpen, setIsModalOpen: setIsLoginModalOpen }}>
        <SignUpModalContext.Provider value={{ isModalOpen: isSignUpModalOpen, setIsModalOpen: setIsSignUpModalOpen }}>
          <ForgotPasswordModalContext.Provider value={{ isModalOpen: isForgotPasswordModalOpen, setIsModalOpen: setIsForgotPasswordModalOpen }}>
            <div 
              style={{ 
                background: 'var(--bg-base)',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                opacity: isFadingOut ? '0' : '1',
                transition: 'opacity 0.5s ease-out'
              }}
            >
              {/* 상단 세이프존 - 고정 표시 */}
              <div 
                style={{ 
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 'var(--actual-safe-top)',
                  backgroundColor: isWebEnvironment ? 'blue' : 'transparent', 
                  opacity: isWebEnvironment ? '0.8' : '0',
                  zIndex: 1000
                }}
              />

              {/* 프로그레스 인디케이터 */}
              <div 
                style={{ 
                  padding: '16px 20px 0 20px',
                  marginTop: 'var(--actual-safe-top)',
                  opacity: showProgress ? '1' : '0',
                  transition: 'opacity 0.6s ease-out',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <ProgressIndicator />
              </div>

              {/* 메인 콘텐츠 영역 */}
              <div 
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '20px',
                  opacity: showContent ? '1' : '0',
                  transform: showContent ? 'translateY(0)' : 'translateY(0)',
                  transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                  minHeight: 0,
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                {/* 현재 스텝 컴포넌트를 props와 함께 렌더링 */}
                {currentStep === 1 && (
                  <WelcomeScreen 
                    onStepChange={changeStep}
                    currentStep={currentStep}
                  />
                )}
                {currentStep === 2 && (
                  <GratitudeExperienceScreen 
                    onStepChange={changeStep}
                    currentStep={currentStep}
                  />
                )}
                {currentStep === 3 && (
                  <UsagePurposeScreen 
                    onStepChange={changeStep}
                    currentStep={currentStep}
                  />
                )}
                {currentStep === 4 && (
                  <InterestAreasScreen 
                    onStepChange={changeStep}
                    currentStep={currentStep}
                  />
                )}
                {currentStep === 5 && (
                  <NotificationSettingsScreen 
                    onStepChange={changeStep}
                    currentStep={currentStep}
                  />
                )}
                {currentStep === 6 && (
                  <FirstGratitudeScreen 
                    onStepChange={changeStep}
                    currentStep={currentStep}
                  />
                )}
                {currentStep === 7 && (
                  <SubscriptionScreen 
                    onStepChange={changeStep}
                    currentStep={currentStep}
                  />
                )}
                {currentStep === 8 && (
                  <OnboardingCompleteClient 
                    locale={locale}
                    onStepChange={changeStep}
                    currentStep={currentStep}
                  />
                )}
              </div>

              {/* 하단 세이프존 - 여백 차지하지 않음 */}
              <div 
                style={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 0,
                  backgroundColor: isWebEnvironment ? 'blue' : 'transparent', 
                  opacity: isWebEnvironment ? '0.8' : '0',
                  zIndex: 1000
                }}
              />

              {/* 하단 이미지 - Framer Motion으로 부드러운 애니메이션 */}
              <motion.div
                key={`bottom-image-${imageKey}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: showBottomImage ? 1 : 0,
                  y: showBottomImage ? 0 : 20
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1] // Material Design cubic-bezier (부드럽고 자연스러운 이징)
                }}
                style={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1,
                  maxHeight: '25vh',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}
              >
                <motion.img 
                  key={`grow-image-${displayStep}-${imageKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  src={
                    displayStep === 2 ? "/Grow2.webp" :
                    displayStep === 3 ? "/Grow3.webp" :
                    displayStep === 4 ? "/Grow4.webp" :
                    displayStep === 5 ? "/Grow5.webp" :
                    displayStep === 6 ? "/Grow6.webp" :
                    displayStep === 7 ? "/Grow7.webp" :
                    displayStep === 8 ? "/Grow8.webp" :
                    "/Grow1.webp"
                  } 
                  alt="Grow" 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    maxHeight: '30vh',
                    objectFit: 'contain'
                  }}
                />
              </motion.div>

              {/* 구독 모달 */}
              <SubscriptionModal 
                isOpen={isModalOpen} 
                onClose={() => {
                  setIsModalOpen(false)
                  // 모달이 닫힐 때 모든 버튼 리셋
                  setTimeout(() => {
                    document.querySelectorAll('.simple-button').forEach((button) => {
                      const btn = button as HTMLElement
                      btn.blur()
                      btn.style.transform = ''
                      // 강제로 reflow 트리거
                      btn.offsetHeight
                    })
                    // 빈 곳 클릭 효과
                    const event = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true,
                      clientX: 0,
                      clientY: 0
                    })
                    document.body.dispatchEvent(event)
                  }, 100)
                }} 
              />

              {/* 로그인 모달 */}
              <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => {
                  setIsLoginModalOpen(false)
                  // 모달이 닫힐 때 모든 버튼 리셋
                  setTimeout(() => {
                    document.querySelectorAll('.simple-button').forEach((button) => {
                      const btn = button as HTMLElement
                      btn.blur()
                      btn.style.transform = ''
                      // 강제로 reflow 트리거
                      btn.offsetHeight
                    })
                    // 빈 곳 클릭 효과
                    const event = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true,
                      clientX: 0,
                      clientY: 0
                    })
                    document.body.dispatchEvent(event)
                  }, 100)
                }}
                onLoginSuccess={handleLoginSuccess}
              />

              {/* 회원가입 모달 */}
              <SignUpModal 
                isOpen={isSignUpModalOpen} 
                onClose={() => {
                  setIsSignUpModalOpen(false)
                  // 모달이 닫힐 때 모든 버튼 리셋
                  setTimeout(() => {
                    document.querySelectorAll('.simple-button').forEach((button) => {
                      const btn = button as HTMLElement
                      btn.blur()
                      btn.style.transform = ''
                      btn.offsetHeight
                    })
                    const event = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true,
                      clientX: 0,
                      clientY: 0
                    })
                    document.body.dispatchEvent(event)
                  }, 100)
                }}
                onSignUpSuccess={() => {
                  // 회원가입 성공 시 처리
                  console.log('회원가입 성공! 2페이지로 이동합니다.')
                  
                  // 회원가입 완료 플래그 설정
                  sessionStorage.setItem('justSignedUp', 'true')
                  
                  // "시작하기" 버튼과 동일한 전환 효과 적용
                  changeStep(2)
                }} 
              />

              {/* 비밀번호 찾기 모달 */}
              <ForgotPasswordModal 
                isOpen={isForgotPasswordModalOpen} 
                onClose={() => {
                  setIsForgotPasswordModalOpen(false)
                  // 모달이 닫힐 때 모든 버튼 리셋
                  setTimeout(() => {
                    document.querySelectorAll('.simple-button').forEach((button) => {
                      const btn = button as HTMLElement
                      btn.blur()
                      btn.style.transform = ''
                      btn.offsetHeight
                    })
                    const event = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true,
                      clientX: 0,
                      clientY: 0
                    })
                    document.body.dispatchEvent(event)
                  }, 100)
                }}
                onSuccess={() => {
                  // 비밀번호 재설정 이메일 전송 성공 시 처리
                  console.log('비밀번호 재설정 이메일 전송 완료!')
                }} 
              />
            </div>
          </ForgotPasswordModalContext.Provider>
        </SignUpModalContext.Provider>
      </LoginModalContext.Provider>
    </SubscriptionModalContext.Provider>
  )
}

export default function OnboardingFlow({ locale }: OnboardingFlowProps) {
  return (
    <OnboardingProvider>
      <OnboardingContent locale={locale} />
    </OnboardingProvider>
  )
}