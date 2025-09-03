'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../contexts/AuthContext'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { completeOnboarding } from '../../utils/onboarding'
import LoadingOverlay from '../common/LoadingOverlay'

interface OnboardingCompleteClientProps {
  locale: string
}

export default function OnboardingCompleteClient({ locale }: OnboardingCompleteClientProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { completeOnboarding: completeOnboardingDB, user } = useAuth()
  const { state } = useOnboarding()
  const [isCompleting, setIsCompleting] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    const handleOnboardingCompletion = async () => {
      if (!user) return

      try {
        setIsCompleting(true)
        
        // 로컬 스토리지에 온보딩 완료 저장
        completeOnboarding()
        
        // DB에 온보딩 완료 상태 업데이트
        const result = await completeOnboardingDB()
        
        if (result.success) {
          console.log('✅ 온보딩 완료 처리 성공')
          // 온보딩 데이터를 DB에 저장하는 로직은 나중에 구현
          // TODO: user_settings에 온보딩 데이터 저장
        } else {
          console.error('❌ 온보딩 완료 처리 실패:', result.error)
        }
      } catch (error) {
        console.error('❌ 온보딩 완료 처리 중 오류:', error)
      } finally {
        setIsCompleting(false)
      }
    }

    handleOnboardingCompletion()
  }, [user, completeOnboardingDB])

  const handleStart = () => {
    setShowOverlay(true)
    
    // 로딩 오버레이와 함께 홈페이지로 이동
    setTimeout(() => {
      router.replace(`/${locale}`)
    }, 800)
  }

  return (
    <>
      {/* 로딩 오버레이 */}
      <LoadingOverlay 
        isVisible={showOverlay} 
        message="홈페이지로 이동 중입니다..." 
      />
      
      <div className="flex flex-col mb-[20vh] items-center w-full h-full text-center relative">
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
      <div className="flex-1 flex flex-col justify-start w-full max-w-md px-4">
        {/* 완료 아이콘 */}
        <div className="mb-8 relative fade-start fade-icon">
          <div className="flex justify-center mb-4">
            <div className="w-36 h-36 flex items-center justify-center">
              <img 
                src="/Complete.png" 
                alt="완료"
                className="w-36 h-36 object-contain"
              />
            </div>
          </div>
          <div className="w-20 h-1 retro-meadow rounded-full mx-auto"></div>
        </div>

        {/* 타이틀 */}
        <h1 className="text-xl -mx-2 font-extrabold text-gray-800 mb-4 mt-6 font-noto-serif-kr tracking-wide fade-start fade-title">
          모든 준비가 완료되었어요!
        </h1>

        {/* 부제목 */}
        <p className="text-base text-gray-500 mb-6 font-bold font-noto-serif-kr leading-relaxed fade-start fade-subtitle">
          매일 작은 감사를 찾아<br />기록해보세요
        </p>
      </div>

      {/* 시작하기 버튼 */}
      <div className="w-full max-w-sm px-4 pb-24 fade-start fade-loading">
        <button
          onClick={handleStart}
          className="w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg simple-button"
          style={{ 
            background: '#4f8750'
          }}
        >
          시작하기
        </button>
      </div>
    </div>
    </>
  )
}