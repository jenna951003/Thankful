'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const premiumFeatures = [
  { 
    icon: '📖', 
    title: '1000+ 감사 프롬프트',
    description: '다양한 상황별 맞춤 질문들'
  },
  { 
    icon: '🤖', 
    title: 'AI 개인 맞춤 분석',
    description: '감사 패턴 분석과 인사이트 제공'
  },
  { 
    icon: '📊', 
    title: '감사 성장 리포트',
    description: '월간/연간 감사 여정 리포트'
  },
  { 
    icon: '⛪', 
    title: '설교노트 & 기도노트',
    description: '말씀과 기도 기록 통합 관리'
  },
  { 
    icon: '👥', 
    title: '믿음의 커뮤니티',
    description: '함께 나누는 감사의 교제'
  }
]

export default function SubscriptionScreen() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleStartTrial = () => {
    // TODO: 구독 로직 구현
    router.push('/onboarding/complete')
  }

  const handleExploreFirst = () => {
    router.push('/onboarding/complete')
  }

  return (
    <div className="flex flex-col h-full">
      {/* 상단 콘텐츠 */}
      <div className="flex-1">
        <div 
          className={`text-center mb-8 transition-all duration-800 ease-out ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* 아이콘 */}
          <div className="text-5xl mb-6">🌟</div>
          
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-jua">
            더 깊은 감사 여정을<br />시작해보세요
          </h1>
          
          {/* 설명 */}
          <p className="text-gray-600 font-noto-serif-kr">
            프리미엄으로 더욱 풍성한 감사 생활을
          </p>
        </div>

        {/* 프리미엄 기능들 */}
        <div 
          className={`space-y-4 mb-8 transition-all duration-800 ease-out delay-200 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {premiumFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-r from-white/90 to-white/70 border border-gray-200 
                       rounded-2xl p-4 flex items-center space-x-4 hover:shadow-md
                       transition-all duration-200 hover:scale-[1.01]`}
              style={{
                animationDelay: `${300 + index * 100}ms`
              }}
            >
              {/* 아이콘 */}
              <div className={`w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 
                            rounded-xl flex items-center justify-center text-xl`}>
                {feature.icon}
              </div>

              {/* 텍스트 */}
              <div className="flex-1">
                <div className="font-bold text-gray-800 font-jua">
                  {feature.title}
                </div>
                <div className="text-sm text-gray-600 font-noto-serif-kr">
                  {feature.description}
                </div>
              </div>

              {/* 체크 아이콘 */}
              <div className="text-green-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* 가격 정보 */}
        <div 
          className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 
                     rounded-3xl p-6 text-center mb-6 transition-all duration-800 ease-out delay-400 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-4xl font-bold text-blue-700 font-jua mb-2">
            7일 무료 체험
          </div>
          <div className="text-gray-600 font-noto-serif-kr mb-3">
            그 후 월 $4.99
          </div>
          <div className="text-sm text-gray-500 font-noto-serif-kr">
            언제든 취소 가능
          </div>
        </div>
      </div>

      {/* 하단 버튼들 */}
      <div 
        className={`space-y-3 transition-all duration-800 ease-out delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* 무료 체험 시작 버튼 */}
        <button
          onClick={handleStartTrial}
          className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
                   text-white font-bold py-5 px-6 rounded-3xl shadow-lg hover:shadow-xl
                   transform hover:scale-[1.02] active:scale-[0.98]
                   transition-all duration-200 font-jua text-lg
                   relative overflow-hidden`}
        >
          {/* 반짝임 효과 */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        transform -skew-x-12 animate-shimmer`} />
          무료로 시작하기 ✨
        </button>

        {/* 둘러보기 버튼 */}
        <button
          onClick={handleExploreFirst}
          className={`w-full bg-white/70 hover:bg-white/90 text-gray-600 font-semibold py-4 px-6 
                   rounded-2xl border-2 border-gray-200 hover:border-gray-300
                   transition-all duration-200 font-noto-serif-kr`}
        >
          나중에 둘러볼게요
        </button>

        {/* 약관 텍스트 */}
        <p className="text-xs text-gray-500 text-center font-noto-serif-kr leading-relaxed">
          무료 체험 기간 종료 전 언제든 취소하실 수 있습니다.<br />
          구독 시 <span className="underline">이용약관</span> 및 <span className="underline">개인정보처리방침</span>에 동의하게 됩니다.
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}