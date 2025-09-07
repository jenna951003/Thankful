'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslationContext } from '../../contexts/TranslationContext'
import { useAuth } from '../../contexts/AuthContext'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { completeOnboarding, saveOnboardingData } from '../../utils/onboarding'
import { getUserDisplayName, saveUserDisplayName } from '../../utils/device'
import LoadingOverlay from '../common/LoadingOverlay'

interface OnboardingCompleteClientProps {
  locale: string
  onStepChange?: (step: number) => void
  currentStep?: number
}

export default function OnboardingCompleteClient({ locale }: OnboardingCompleteClientProps) {
  const router = useRouter()
  const { t } = useTranslationContext()
  const { completeOnboarding: completeOnboardingDB, user, updateProfile } = useAuth()
  const { state } = useOnboarding()
  const [isCompleting, setIsCompleting] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayMessage, setOverlayMessage] = useState(t('loading.pleaseWait') || '잠시만 기다려주세요...')
  const [buttonState, setButtonState] = useState<'normal' | 'processing' | 'loading'>('normal')
  const [showContent, setShowContent] = useState(false)
  const [isSignupComplete, setIsSignupComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // 회원가입 완료 플래그 확인
    const justSignedUp = sessionStorage.getItem('justSignedUp') === 'true'
    setIsSignupComplete(justSignedUp)
  }, [])

  // 시작하기 버튼 클릭 핸들러
  const handleStart = async () => {
    try {
      // 1단계: 버튼 상태를 "처리 중..."으로 변경
      setButtonState('processing')
      
      // 2단계: 2초 대기
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 3단계: 로딩 오버레이 표시
      setShowOverlay(true)
      setButtonState('loading')
      setIsCompleting(true)
      
      // 회원가입 완료 시 특별 메시지, 아니면 기본 메시지
      if (isSignupComplete) {
        setOverlayMessage(t('loading.signupComplete') || '회원가입이 완료되었습니다!')
        // 플래그 제거
        sessionStorage.removeItem('justSignedUp')
      } else {
        setOverlayMessage(t('loading.pleaseWait') || '잠시만 기다려주세요...')
      }
      
      if (!user) {
        // 로그인하지 않은 경우: 로컬스토리지에만 저장
        console.log('💾 Saving onboarding completion to localStorage (not logged in)')
        
        // 디바이스 사용자 이름 가져와서 저장
        try {
          const displayName = await getUserDisplayName()
          console.log('📱 Got display name:', displayName)
          saveUserDisplayName(displayName)
        } catch (deviceError) {
          console.error('❌ Device API error:', deviceError)
          // Device API 오류 시 기본값 사용
          saveUserDisplayName('익명 사용자')
        }
        
        completeOnboarding()
        saveOnboardingData(state.data)
      } else {
        // 로그인한 경우: DB에 온보딩 완료 상태 업데이트
        console.log('💾 Saving onboarding completion to DB (logged in)')
        completeOnboarding() // 로컬스토리지에도 표시
        
        const result = await completeOnboardingDB()
        
        if (result.success) {
          console.log('✅ 온보딩 완료 처리 성공')
        } else {
          console.error('❌ 온보딩 완룼 처리 실패:', result.error)
        }
      }
      
      // 완료 후 메시지 변경 및 이동
      setOverlayMessage(t('loading.redirectingHome') || '홈페이지로 이동 중입니다...')
      
      // 1.5초 후 홈페이지로 이동
      setTimeout(() => {
        router.replace(`/${locale}`)
      }, 1500)
      
    } catch (error) {
      console.error('❌ 온보딩 완료 처리 중 오류:', error)
      setIsCompleting(false)
      setShowOverlay(false)
      setButtonState('normal')
    }
  }


  return (
    <>
      {/* 로딩 오버레이 */}
      <LoadingOverlay 
        isVisible={showOverlay} 
        message={overlayMessage}
        imageType={isSignupComplete ? 'signup' : 'default'}
        minDuration={2000} // 2초 최소 보장
      />
      
      <div className="flex flex-col mb-[20vh] md:mb-[25vh] items-center w-full h-full text-center relative">
      {/* CSS 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fade-start { opacity: 0; }
        
        .fade-icon { 
          animation: fadeIn 0.8s ease-out 0.8s forwards; 
        }
        
        .fade-title { 
          animation: fadeIn 0.8s ease-out 1.2s forwards; 
        }
        
        .fade-subtitle { 
          animation: fadeIn 0.8s ease-out 1.6s forwards; 
        }
        
        .fade-loading { 
          animation: fadeIn 0.8s ease-out 2.0s forwards; 
        }

        .simple-button {
          transition: transform 0.15s ease-out;
        }
        
        .simple-button:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* 메인 콘텐츠 */}
      <div 
        className="flex-1 flex flex-col justify-start w-full max-w-md px-4"
        style={{
          opacity: showContent ? '1' : '0',
          transition: 'opacity 0.6s ease-out'
        }}
      >
        {/* 완료 아이콘 */}
        <div className="mb-8 relative fade-start fade-icon">
          <div className="flex justify-center mb-4">
            <div className="w-36 h-36 md:w-48 md:h-48 md:mt-12 flex items-center justify-center">
              <img 
                src="/Complete.png" 
                alt="완료"
                className="w-36 h-36 md:w-48 md:h-48 object-contain"
              />
            </div>
          </div>
          <div className="w-20 h-1 retro-meadow rounded-full mx-auto"></div>
        </div>

        {/* 타이틀 */}
        <h1 className="text-xl md:text-2xl -mx-2 font-extrabold text-gray-700 mb-4 mt-6 font-noto-serif-kr tracking-wide fade-start fade-title">
          {t('onboarding.complete.title')}
        </h1>

        {/* 부제목 */}
        <p className="text-base md:text-lg text-gray-500 mb-6 font-bold font-noto-serif-kr leading-relaxed fade-start fade-subtitle">
          {t('onboarding.complete.subtitle')}
        </p>
      </div>

      {/* 시작하기 버튼 */}
      <div className="w-full max-w-sm md:max-w-md px-4 pb-24 fade-start fade-loading">
        <button
          onClick={handleStart}
          disabled={buttonState !== 'normal'}
          className={`w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg simple-button ${
            buttonState !== 'normal' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ 
            background: '#4f8750'
          }}
        >
          {buttonState === 'normal' 
            ? (t('onboarding.complete.startButton') || '시작하기') 
            : buttonState === 'processing' 
            ? (t('loading.processing') || '처리 중...') 
            : (t('loading.loading') || '로딩 중...')}
        </button>
      </div>
    </div>
    </>
  )
}