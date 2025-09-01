'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'

const experienceOptions = [
  { 
    id: 'frequent', 
    label: '자주 써요', 
    icon: '/Forest.png',
    description: '고급 기능을 추천해드릴게요'
  },
  { 
    id: 'sometimes', 
    label: '가끔 써봤어요', 
    icon: '/Tree.png',
    description: '중급 가이드로 안내해드릴게요'
  },
  { 
    id: 'beginner', 
    label: '처음이에요', 
    icon: '/Gross.png',
    description: '기초부터 차근차근 알려드릴게요'
  }
]

export default function GratitudeExperienceScreen() {
  const router = useRouter()
  const { setGratitudeExperience, startTransition, setStep } = useOnboarding()
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    if (selectedExperience) {
      setGratitudeExperience(selectedExperience)
      
      // 전환 시작
      startTransition()
      
      // 페이드아웃 후 페이지 이동
      setTimeout(() => {
        setStep(3)
        router.push('/onboarding/3')
      }, 400)
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
        
        .fade-title { 
          animation: fadeIn 0.8s ease-out 0.8s forwards; 
        }
        
        .fade-subtitle { 
          animation: fadeIn 0.8s ease-out 1.2s forwards; 
        }
        
        .fade-options { 
          animation: fadeIn 0.8s ease-out 1.6s forwards; 
        }
        
        .fade-buttons { 
          animation: fadeIn 0.8s ease-out 2.0s forwards; 
        }
        
        .simple-button {
          transition: transform 0.15s ease-out, opacity 0.3s ease-out, background-color 0.3s ease-out;
        }
        
        .simple-button:active {
          transform: scale(0.98);
        }

        .simple-button2 {
          transition: all 0.5s ease-in-out;
        }

        .simple-button2:active {
          transform: translateY(-2px);
        }

        .option-card {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .check-icon {
          animation: checkAppear 0.4s ease-out forwards;
        }

        @keyframes checkAppear {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(-15deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }          
      `}</style>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-start w-full max-w-md px-4">
        {/* 타이틀 */}
        <h1 className="text-xl font-bold text-gray-800 mb-1 mt-6 font-noto-serif-kr fade-start fade-title">
          감사 일기 써본 적 있어요?
        </h1>

        {/* 부제목 */}
        <p className="text-base text-gray-600 mb-6 font-semibold font-noto-serif-kr leading-relaxed fade-start fade-subtitle">
          당신에게 맞는 시작점을 찾아드릴게요
        </p>

        {/* 선택 옵션들 */}
        <div className="space-y-3 mb-6 fade-start fade-options">
          {experienceOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedExperience(option.id)}
              className={`w-full h-16 p-3 rounded-lg font-noto-serif-kr option-card simple-button2 flex items-center relative 
                         ${selectedExperience === option.id 
                           ? 'bg-[#dad8c8] text-[#4d6f5e] ' 
                           : 'bg-white text-gray-700 '
                         }`}
            >
              <div className="flex items-center space-x-1 w-full">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <img 
                    src={option.icon} 
                    alt={option.label}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left flex-1 space-y-0.5">
                  <div className="font-extrabold text-[14px]">{option.label}</div>
                  <div className="text-xs text-gray-500 font-bold">{option.description}</div>
                </div>
              </div>
              
              {/* 체크 이미지 - 선택된 경우에만 표시 */}
              {selectedExperience === option.id && (
                <div className="absolute -top-4 -right-4 w-12 h-12 check-icon">
                  <img 
                    src="/Check3.png" 
                    alt="Selected"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="w-full max-w-sm px-4 space-y-3 pb-4 fade-start fade-buttons">
        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!selectedExperience}
          className={`w-full retro-button button-screen-texture tracking-wider
                   font-semibold py-4 px-6 text-white font-jua text-lg
                   simple-button ${
                     selectedExperience 
                       ? 'opacity-100' 
                       : 'opacity-50 cursor-not-allowed'
                   }`}
          style={{ 
            background: '#4f8750'
          }}
        >
          다음
        </button>

        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => {
            // 전환 시작
            startTransition()
            
            // 페이드아웃 후 페이지 이동
            setTimeout(() => {
              setStep(1)
              router.push('/onboarding/1')
            }, 400)
          }}
          className="w-full retro-card text-gray-700 font-semibold py-4 px-6 font-jua simple-button"
        >
          뒤로
        </button>
      </div>
    </div>
  )
}