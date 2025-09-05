'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { OnboardingProvider, useOnboarding } from '../../contexts/OnboardingContext'
import ProgressIndicator from './ProgressIndicator'
import SubscriptionModal from './SubscriptionModal'
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'
import ForgotPasswordModal from './ForgotPasswordModal'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'
import { useAuth } from '../../contexts/AuthContext'
import { saveOnboardingData } from '../../utils/onboarding'

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

interface OnboardingLayoutClientProps {
  children: React.ReactNode
  locale: string
}

function OnboardingContent({ children, locale }: OnboardingLayoutClientProps) {
  const { isWebEnvironment } = useDeviceDetection()
  const [showProgress, setShowProgress] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [showBottomImage, setShowBottomImage] = useState(false)
  const [displayStep, setDisplayStep] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
  const { state, startTransition, setStep } = useOnboarding()
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  // 현재 스텝 번호 추출
  const currentStep = parseInt(pathname.split('/').pop() || '1')
  const canGoBack = currentStep > 1

  // 로그인 성공 핸들러
  const handleLoginSuccess = (shouldRedirectToOnboarding?: boolean) => {
    console.log('로그인 성공', { shouldRedirectToOnboarding })
    
    if (shouldRedirectToOnboarding) {
      // 온보딩 미완료 시 2페이지로 이동
      startTransition()
      setTimeout(() => {
        setStep(2)
        router.push(`/${locale}/onboarding/2`)
      }, 400)
    } else {
      // 온보딩 완료 시 홈페이지로 이동
      router.replace(`/${locale}`)
    }
  }



  // 온보딩 데이터 저장 처리
  useEffect(() => {
    // 온보딩 데이터가 변경될 때마다 처리
    if (state.data) {
      if (!user) {
        // 로그인하지 않은 경우, 로컬스토리지에 저장
        saveOnboardingData(state.data)
        console.log('💾 Saved onboarding data to localStorage')
      } else {
        // 로그인한 경우, 온보딩 완료 상태만 DB에 저장
        if (state.currentStep > 1 && state.currentStep <= 8) {
          // onboarding_data와 onboarding_step 필드는 profiles 테이블에 없으므로
          // 온보딩이 진행 중이라는 것만 표시 (완료되면 onboarding_completed: true로 설정됨)
          console.log(`📝 Onboarding in progress: step ${state.currentStep}`)
          // 실제 온보딩 데이터는 localStorage에만 저장하고, 
          // 완료 시점에 onboarding_completed: true로 설정됨
        }
      }
    }
  }, [state.data, state.currentStep, user, updateProfile])

  useEffect(() => {
    // 페이지 변경 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0)
    
    // 전환 중이면 콘텐츠를 숨김 (프로그레스바는 항상 표시)
    if (state.isTransitioning) {
      setShowContent(false)
      setShowBottomImage(false)
      return
    }

    // UI 요소만 스테거드 애니메이션 (세이프존 제외)
    console.log('🎭 Starting UI-focused staggered fade-in')
    
    // 프로그레스바는 항상 표시 상태로 유지
    
    // 1단계: 메인 콘텐츠 (150ms 후)
    const timer1 = setTimeout(() => {
      console.log('🟡 Step 1: Showing main content')
      setShowContent(true)
    }, 150)

    // 2단계: 하단 이미지 (300ms 후)
    const timer2 = setTimeout(() => {
      console.log('🟢 Step 2: Showing bottom image')
      setDisplayStep(currentStep) // 이미지가 나타나기 직전에 단계 업데이트
      setShowBottomImage(true)
    }, 300)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [state.isTransitioning, pathname])



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
          overflow: 'hidden'
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
          backgroundColor: isWebEnvironment ? 'blue' : 'red', 
          opacity: '0.8',
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
        {children}
      </div>

      {/* 하단 세이프존 - 고정 표시 */}
      <div 
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--actual-safe-bottom)',
          backgroundColor: isWebEnvironment ? 'blue' : 'red', 
          opacity: '0.8',
          zIndex: 1000
        }}
      />



      {/* 하단 이미지 - 단계별로 다른 이미지 */}
      <div 
        style={{ 
          position: 'absolute',
          bottom: 'var(--actual-safe-bottom)',
          left: 0,
          right: 0,
          zIndex: 1,
          opacity: showBottomImage ? '1' : '0',
          transform: showBottomImage ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          maxHeight: '25vh',
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        <img 
          src={
            displayStep === 2 ? "/Grow5.png" :
            displayStep === 3 ? "/Grow6.png" :
            displayStep === 4 ? "/Grow7.png" :
            displayStep === 5 ? "/Grow8.png" :
            displayStep === 6 ? "/Grow9.png" :
            displayStep === 7 ? "/Grow10.png" :
            displayStep === 8 ? "/Grow11.png" :
            "/Grow4.png"
          } 
          alt="Grow" 
          style={{ 
            width: '100%', 
            height: 'auto',
            maxHeight: '25vh',
            objectFit: 'contain'
          }}
        />
      </div>

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
          
          // "시작하기" 버튼과 동일한 전환 효과 적용
          startTransition()
          
          // 페이드아웃 후 페이지 이동
          setTimeout(() => {
            setStep(2)
            router.push(`/${locale}/onboarding/2`)
          }, 400) // 400ms 후 페이지 이동 (페이드아웃 시간과 맞춤)
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

export default function OnboardingLayoutClient({ children, locale }: OnboardingLayoutClientProps) {
  return (
    <OnboardingProvider>
      <OnboardingContent children={children} locale={locale} />
    </OnboardingProvider>
  )
}