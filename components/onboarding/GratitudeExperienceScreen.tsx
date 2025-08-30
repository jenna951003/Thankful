'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'

const experienceOptions = [
  { 
    id: 'frequent', 
    label: '자주 써요', 
    icon: '✨',
    description: '고급 기능을 추천해드릴게요',
    gradient: 'from-green-400 to-green-500'
  },
  { 
    id: 'sometimes', 
    label: '가끔 써봤어요', 
    icon: '📖',
    description: '중급 가이드로 안내해드릴게요',
    gradient: 'from-blue-400 to-blue-500'
  },
  { 
    id: 'beginner', 
    label: '처음이에요', 
    icon: '🌱',
    description: '기초부터 차근차근 알려드릴게요',
    gradient: 'from-purple-400 to-purple-500'
  }
]

export default function GratitudeExperienceScreen() {
  const router = useRouter()
  const { setGratitudeExperience } = useOnboarding()
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
      router.push('/onboarding/4')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 상단 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-center">
        <div 
          className={`text-center mb-12 transition-all duration-800 ease-out ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* 아이콘 */}
          <div className="text-5xl mb-6">✨</div>
          
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-jua">
            감사 일기 써본 적 있어요?
          </h1>
          
          {/* 설명 */}
          <p className="text-gray-600 font-noto-serif-kr">
            당신에게 맞는 시작점을 찾아드릴게요
          </p>
        </div>

        {/* 선택 옵션들 */}
        <div 
          className={`space-y-4 transition-all duration-800 ease-out delay-200 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {experienceOptions.map((option, index) => (
            <button
              key={option.id}
              onClick={() => setSelectedExperience(option.id)}
              className={`w-full p-6 rounded-3xl border-2 transition-all duration-300 
                         flex items-center space-x-5 group hover:scale-[1.01]
                         ${selectedExperience === option.id 
                           ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg' 
                           : 'border-gray-200 bg-white/80 hover:bg-white/95 hover:border-gray-300 hover:shadow-md'
                         }`}
              style={{
                animationDelay: `${300 + index * 150}ms`
              }}
            >
              {/* 아이콘 배경 */}
              <div 
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl
                           ${selectedExperience === option.id 
                             ? `bg-gradient-to-br ${option.gradient}` 
                             : 'bg-gray-100 group-hover:bg-gray-200'
                           } transition-all duration-300`}
              >
                <span className={selectedExperience === option.id ? 'text-white' : ''}>
                  {option.icon}
                </span>
              </div>

              {/* 텍스트 영역 */}
              <div className="flex-1 text-left">
                <div 
                  className={`text-lg font-bold font-jua mb-1
                             ${selectedExperience === option.id 
                               ? 'text-blue-700' 
                               : 'text-gray-800'
                             }`}
                >
                  {option.label}
                </div>
                <div 
                  className={`text-sm font-noto-serif-kr
                             ${selectedExperience === option.id 
                               ? 'text-blue-600' 
                               : 'text-gray-500'
                             }`}
                >
                  {option.description}
                </div>
              </div>

              {/* 선택 인디케이터 */}
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                           ${selectedExperience === option.id 
                             ? 'border-blue-500 bg-blue-500 scale-110' 
                             : 'border-gray-300'
                           }`}
              >
                {selectedExperience === option.id && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 다음 버튼 */}
      <div 
        className={`pt-6 transition-all duration-800 ease-out delay-400 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <button
          onClick={handleNext}
          disabled={!selectedExperience}
          className={`w-full font-bold py-5 px-6 rounded-3xl 
                     transition-all duration-200 font-jua text-lg
                     ${selectedExperience
                       ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
        >
          다음으로
        </button>
      </div>
    </div>
  )
}