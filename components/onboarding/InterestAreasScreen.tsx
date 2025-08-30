'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'

const interestOptions = [
  { 
    id: 'daily', 
    label: '일상의 작은 것들', 
    icon: '☕',
    color: 'from-amber-400 to-orange-400'
  },
  { 
    id: 'family', 
    label: '가족과 관계', 
    icon: '👨‍👩‍👧‍👦',
    color: 'from-pink-400 to-rose-400'
  },
  { 
    id: 'guidance', 
    label: '하나님의 인도하심', 
    icon: '🕊️',
    color: 'from-blue-400 to-indigo-400'
  },
  { 
    id: 'health', 
    label: '건강과 생명', 
    icon: '💚',
    color: 'from-green-400 to-emerald-400'
  },
  { 
    id: 'dreams', 
    label: '꿈과 비전', 
    icon: '🌟',
    color: 'from-purple-400 to-violet-400'
  },
  { 
    id: 'prayers', 
    label: '기도 응답', 
    icon: '🙏',
    color: 'from-yellow-400 to-amber-400'
  },
  { 
    id: 'community', 
    label: '교회 공동체', 
    icon: '⛪',
    color: 'from-cyan-400 to-teal-400'
  }
]

export default function InterestAreasScreen() {
  const router = useRouter()
  const { setInterests } = useOnboarding()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleToggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleNext = () => {
    setInterests(selectedInterests)
    router.push('/onboarding/5')
  }

  return (
    <div className="flex flex-col h-full">
      {/* 상단 콘텐츠 */}
      <div className="flex-1">
        <div 
          className={`text-center mb-10 transition-all duration-800 ease-out ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* 아이콘 */}
          <div className="text-5xl mb-6">🎯</div>
          
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-jua">
            어떤 것에 감사를<br />더 표현하고 싶나요?
          </h1>
          
          {/* 설명 */}
          <p className="text-gray-600 font-noto-serif-kr mb-2">
            맞춤 프롬프트를 준비해드릴게요
          </p>
          <p className="text-sm text-gray-500 font-noto-serif-kr">
            복수 선택 가능해요
          </p>
        </div>

        {/* 선택 옵션들 - 격자 레이아웃 */}
        <div 
          className={`grid grid-cols-2 gap-3 transition-all duration-800 ease-out delay-200 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {interestOptions.map((option, index) => {
            const isSelected = selectedInterests.includes(option.id)
            return (
              <button
                key={option.id}
                onClick={() => handleToggleInterest(option.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 
                           flex flex-col items-center space-y-2 group hover:scale-[1.02]
                           ${isSelected 
                             ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg' 
                             : 'border-gray-200 bg-white/80 hover:bg-white/95 hover:border-gray-300 hover:shadow-md'
                           }`}
                style={{
                  animationDelay: `${300 + index * 80}ms`
                }}
              >
                {/* 아이콘 배경 */}
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300
                             ${isSelected 
                               ? `bg-gradient-to-br ${option.color}` 
                               : 'bg-gray-100 group-hover:bg-gray-200'
                             }`}
                >
                  <span className={isSelected ? 'text-white' : ''}>
                    {option.icon}
                  </span>
                </div>

                {/* 라벨 */}
                <div 
                  className={`text-sm font-semibold font-noto-serif-kr text-center leading-tight
                             ${isSelected 
                               ? 'text-blue-700' 
                               : 'text-gray-700'
                             }`}
                >
                  {option.label}
                </div>

                {/* 체크 인디케이터 */}
                <div 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                             ${isSelected 
                               ? 'border-blue-500 bg-blue-500 scale-110' 
                               : 'border-gray-300'
                             }`}
                >
                  {isSelected && (
                    <svg 
                      className="w-3 h-3 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* 선택된 개수 표시 */}
        {selectedInterests.length > 0 && (
          <div 
            className={`text-center mt-6 transition-all duration-300 ease-out ${
              showContent ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold font-noto-serif-kr">
              {selectedInterests.length}개 선택됨
            </span>
          </div>
        )}
      </div>

      {/* 하단 다음 버튼 */}
      <div 
        className={`pt-6 transition-all duration-800 ease-out delay-400 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <button
          onClick={handleNext}
          className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
                   text-white font-bold py-5 px-6 rounded-3xl shadow-lg hover:shadow-xl
                   transform hover:scale-[1.02] active:scale-[0.98]
                   transition-all duration-200 font-jua text-lg`}
        >
          {selectedInterests.length > 0 ? '다음으로' : '건너뛰기'}
        </button>
      </div>
    </div>
  )
}