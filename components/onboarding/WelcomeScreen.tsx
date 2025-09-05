'use client'

import { useRouter, useParams } from 'next/navigation'
import { useTranslation } from '../../hooks/useTranslation'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useLoginModal } from './OnboardingLayoutClient'
import { resetOnboarding, clearOnboardingData } from '../../utils/onboarding'
import { useAuth } from '../../contexts/AuthContext'
import { createClient } from '../../utils/supabase/client'

export default function WelcomeScreen() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslation()
  const { startTransition, setStep, reset } = useOnboarding()
  const { setIsModalOpen } = useLoginModal()
  const { signOut } = useAuth()
  const supabase = createClient()

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

  // 로컬스토리지 초기화 (개발용)
  const handleResetLocalStorage = async () => {
    console.log('🗑️ Resetting everything...')
    
    try {
      // 1. Supabase 로그아웃 (세션 종료)
      await signOut()
      
      // 2. Supabase 세션 직접 제거
      await supabase.auth.signOut()
      
      // 3. 온보딩 데이터 초기화
      resetOnboarding()
      clearOnboardingData()
      reset()
      
      // 4. 로컬스토리지 완전 초기화
      localStorage.clear()
      
      // 5. 세션스토리지 초기화
      sessionStorage.clear()
      
      // 6. 쿠키 삭제 (Supabase 관련 쿠키)
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // 7. IndexedDB 초기화 (Supabase가 사용할 수 있음)
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases()
        databases.forEach(db => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name)
          }
        })
      }
      
      console.log('✅ Complete reset done!')
      alert('모든 데이터가 초기화되었습니다!\n페이지를 새로고침합니다.')
      
      // 8. 페이지 강제 새로고침 (캐시 무시)
      window.location.href = `/${locale}/onboarding/1`
      
    } catch (error) {
      console.error('Reset error:', error)
      // 오류가 발생해도 강제 초기화
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
    }
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
        
        .fade-reset-btn { 
          animation: fadeIn 0.4s ease-out 2.6s forwards; 
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

        {/* 로컬스토리지 초기화 버튼 (테스트용) */}
        <button
          onClick={handleResetLocalStorage}
          className={`w-full bg-red-100 border-2 border-red-300 text-red-600 
                   font-semibold py-3 px-4 rounded-xl
                   font-noto-serif-kr text-sm 
                   fade-start fade-reset-btn simple-button
                   hover:bg-red-200 transition-colors`}
        >
          🗑️ 로컬스토리지 초기화 (테스트용)
        </button>
      </div>
    </div>
  )
}