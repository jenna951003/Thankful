'use client'

import { useRouter, useParams } from 'next/navigation'
import { useTranslation } from '../../hooks/useTranslation'

export default function WelcomeScreen() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslation()

  const handleStart = () => {
    router.push(`/${locale}/onboarding/2`)
  }

  const handleSignIn = () => {
    // TODO: 로그인 로직 구현
    console.log('Sign in clicked')
  }


  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-2 relative">
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
        
        .fade-start-btn { 
          animation: fadeIn 0.8s ease-out 2.0s forwards; 
        }
        
        .fade-signin-btn { 
          animation: fadeIn 0.8s ease-out 2.4s forwards; 
        }
        
        .simple-button {
          transition: transform 0.15s ease-out;
        }
        
        .simple-button:active {
          transform: scale(0.95);
        }
      `}</style>

      {/* 메인 콘텐츠 */}
      <div>
        {/* 웰컴 이미지 */}
        <div className="mb-8 relative fade-start fade-icon">
          <div className="flex justify-center mb-4">
            <img 
              src="/Welcome2.png" 
              alt="Welcome" 
              className="w-42 h-42 object-contain"
            />
          </div>
          <div className="w-20 h-1 retro-warm rounded-full mx-auto"></div>
        </div>

        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4 font-sour-gummy tracking-wide fade-start fade-title">
          {t('onboarding.welcome.title')}
        </h1>

        {/* 부제목 */}
        <p className="text-lg text-gray-600 mb-16 font-semibold font-noto-serif-kr leading-relaxed max-w-sm mx-auto fade-start fade-subtitle">
          {t('onboarding.welcome.subtitle')}
        </p>

        {/* 장식선 */}

      </div>

      {/* 버튼들 */}
      <div className="w-full max-w-sm space-y-4">
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
                   font-noto-serif-kr
                   fade-start fade-signin-btn simple-button`}
        >
          {t('onboarding.welcome.signInButton')}
        </button>
      </div>

    </div>
  )
}