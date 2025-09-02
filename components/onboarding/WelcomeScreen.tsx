'use client'

import { useRouter, useParams } from 'next/navigation'
import { useTranslation } from '../../hooks/useTranslation'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useLoginModal } from './OnboardingLayoutClient'

export default function WelcomeScreen() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslation()
  const { startTransition, setStep } = useOnboarding()
  const { setIsModalOpen } = useLoginModal()

  const handleStart = () => {
    // 전환 시작
    startTransition()
    
    // 페이드아웃 후 페이지 이동
    setTimeout(() => {
      setStep(2)
      router.push(`/${locale}/onboarding/2`)
    }, 400) // 400ms 후 페이지 이동 (페이드아웃 시간과 맞춤)
  }

  const handleSignIn = () => {
    setIsModalOpen(true)
  }

  const handleLoginSuccess = () => {
    // 로그인 성공 시 메인 페이지로 이동 또는 다른 처리
    console.log('로그인 성공')
    // TODO: 로그인 성공 후 적절한 페이지로 리다이렉션
  }


  return (
    <div className="flex flex-col mb-[20vh] items-center w-full h-full text-center relative">
      {/* CSS 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fade-start { opacity: 0; }
        
        .fade-icon { 
          animation: fadeIn 0.4s ease-out 0.2s forwards; 
        }
        
        .fade-title { 
          animation: fadeIn 0.4s ease-out 1.0s forwards; 
        }
        
        .fade-subtitle { 
          animation: fadeIn 0.4s ease-out 1.4s forwards; 
        }
        
        .fade-start-btn { 
          animation: fadeIn 0.4s ease-out 1.8s forwards; 
        }
        
        .fade-signin-btn { 
          animation: fadeIn 0.4s ease-out 2.2s forwards; 
        }
        
        .simple-button {
          transition: transform 0.15s ease-out;
        }
        
        .simple-button:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-start items-center px-4">
        {/* 웰컴 이미지 */}
        <div className="mb-12  relative fade-start fade-icon w-full max-w-sm">
          <div className="px-4">
            <img 
              src="/Welcome3.png" 
              alt="Welcome" 
              className="w-full h-auto max-h-[30vh] object-contain rounded-2xl"
            />
          </div>
          <div className="w-16 h-1 retro-warm rounded-full mx-auto mt-2"></div>
        </div>

        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3 font-sour-gummy tracking-wide fade-start fade-title">
          {t('onboarding.welcome.title')}
        </h1>

        {/* 부제목 */}
        <p className="text-lg text-gray-600 mb-8 font-semibold font-noto-serif-kr leading-relaxed max-w-sm mx-auto fade-start fade-subtitle">
          {t('onboarding.welcome.subtitle')}
        </p>
      </div>

      {/* 버튼들 */}
      <div className="w-full max-w-sm space-y-3 px-4 pb-4">
        {/* Welcome4.png - 시작하기 버튼 왼쪽 */}


        {/* 시작하기 버튼 */}
        <button
          onClick={handleStart}
          className={`w-full retro-button button-screen-texture tracking-wider
                   font-semibold py-4 px-6 text-white font-jua text-lg 
                   fade-start fade-start-btn simple-button`}
          style={{ 
            background: '#4f8750'
          }}
        >
          {t('onboarding.welcome.startButton')}
        </button>

        {/* 로그인 버튼 */}
        <button
          onClick={handleSignIn}
          className={`w-full retro-card text-gray-700 font-semibold py-4 px-6 
                   font-jua text-lg 
                   fade-start fade-signin-btn simple-button`}
        >
          {t('onboarding.welcome.signInButton')}
        </button>
      </div>
    </div>
  )
}