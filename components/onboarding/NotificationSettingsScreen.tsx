'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'

const timeOptions = [
  { 
    id: 'morning', 
    time: '8:00', 
    label: '오전 8시', 
    description: '새벽 기도 후',
    icon: '🌅'
  },
  { 
    id: 'evening', 
    time: '18:00', 
    label: '오후 6시', 
    description: '퇴근길',
    icon: '🌆'
  },
  { 
    id: 'night', 
    time: '21:00', 
    label: '오후 9시', 
    description: '잠들기 전',
    icon: '🌙'
  },
  { 
    id: 'none', 
    time: null, 
    label: '설정하지 않음', 
    description: '나중에 설정할게요',
    icon: '🔕'
  }
]

export default function NotificationSettingsScreen() {
  const router = useRouter()
  const { setNotifications } = useOnboarding()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [weeklyReview, setWeeklyReview] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    const selectedOption = timeOptions.find(option => option.id === selectedTime)
    setNotifications({
      dailyTime: selectedOption?.time || null,
      weeklyReview
    })
    router.push('/onboarding/6')
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
          <div className="text-5xl mb-6">🔔</div>
          
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-jua">
            감사 습관을<br />만들어볼까요?
          </h1>
          
          {/* 설명 */}
          <p className="text-gray-600 font-noto-serif-kr">
            매일 감사 리마인더
          </p>
        </div>

        {/* 시간 선택 옵션들 */}
        <div 
          className={`space-y-3 mb-8 transition-all duration-800 ease-out delay-200 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {timeOptions.map((option, index) => {
            const isSelected = selectedTime === option.id
            return (
              <button
                key={option.id}
                onClick={() => setSelectedTime(option.id)}
                className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 
                           flex items-center space-x-4 group hover:scale-[1.01]
                           ${isSelected 
                             ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg' 
                             : 'border-gray-200 bg-white/80 hover:bg-white/95 hover:border-gray-300 hover:shadow-md'
                           }`}
                style={{
                  animationDelay: `${300 + index * 100}ms`
                }}
              >
                {/* 라디오 버튼 */}
                <div 
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                             ${isSelected 
                               ? 'border-blue-500 bg-blue-500 scale-110' 
                               : 'border-gray-300'
                             }`}
                >
                  {isSelected && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>

                {/* 아이콘 */}
                <div className="text-2xl">{option.icon}</div>

                {/* 텍스트 영역 */}
                <div className="flex-1 text-left">
                  <div 
                    className={`font-bold font-jua
                               ${isSelected 
                                 ? 'text-blue-700' 
                                 : 'text-gray-800'
                               }`}
                  >
                    {option.label}
                  </div>
                  <div 
                    className={`text-sm font-noto-serif-kr
                               ${isSelected 
                                 ? 'text-blue-600' 
                                 : 'text-gray-500'
                               }`}
                  >
                    {option.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* 주간 리뷰 설정 */}
        <div 
          className={`transition-all duration-800 ease-out delay-400 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">📅</div>
                <div>
                  <div className="font-bold text-gray-800 font-jua">주간 리뷰 알림</div>
                  <div className="text-sm text-gray-600 font-noto-serif-kr">일요일 저녁 (한 주 돌아보기)</div>
                </div>
              </div>
              
              {/* 토글 스위치 */}
              <button
                onClick={() => setWeeklyReview(!weeklyReview)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300
                           ${weeklyReview ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300
                             ${weeklyReview ? 'translate-x-7' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 다음 버튼 */}
      <div 
        className={`pt-6 transition-all duration-800 ease-out delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <button
          onClick={handleNext}
          disabled={!selectedTime}
          className={`w-full font-bold py-5 px-6 rounded-3xl 
                     transition-all duration-200 font-jua text-lg
                     ${selectedTime
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