'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'

const moodOptions = [
  { id: 'joyful', emoji: '😊', label: '기쁨' },
  { id: 'peaceful', emoji: '😌', label: '평안' },
  { id: 'grateful', emoji: '🥰', label: '감사' },
  { id: 'hopeful', emoji: '🌟', label: '소망' },
  { id: 'blessed', emoji: '🙏', label: '축복' }
]

export default function FirstGratitudeScreen() {
  const router = useRouter()
  const { setFirstGratitude } = useOnboarding()
  const [gratitudeItems, setGratitudeItems] = useState(['', '', ''])
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...gratitudeItems]
    newItems[index] = value
    setGratitudeItems(newItems)
  }

  const handleNext = () => {
    const filledItems = gratitudeItems.filter(item => item.trim() !== '')
    setFirstGratitude({
      items: filledItems,
      mood: selectedMood || undefined
    })
    router.push('/onboarding/7')
  }

  const hasAnyContent = gratitudeItems.some(item => item.trim() !== '')

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
          <div className="text-5xl mb-6">📝</div>
          
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-jua">
            첫 번째 감사를<br />기록해보세요
          </h1>
          
          {/* 설명 */}
          <p className="text-gray-600 font-noto-serif-kr mb-2">
            오늘 하나님께 감사한 일이 있다면?
          </p>
        </div>

        {/* 감사 입력 필드들 */}
        <div 
          className={`space-y-4 mb-8 transition-all duration-800 ease-out delay-200 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {gratitudeItems.map((item, index) => (
            <div key={index} className="relative">
              <textarea
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={`${index + 1}. 감사한 일을 적어보세요...`}
                className={`w-full p-5 bg-white/80 border-2 border-gray-200 rounded-2xl 
                         focus:border-blue-500 focus:bg-white focus:outline-none
                         font-noto-serif-kr placeholder-gray-400 resize-none
                         hover:border-gray-300 hover:bg-white/90
                         transition-all duration-200`}
                rows={3}
              />
              {item.trim() && (
                <div className="absolute top-3 right-3 text-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 팁 */}
        <div 
          className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6 transition-all duration-800 ease-out delay-300 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="text-lg">💡</div>
            <div>
              <div className="font-semibold text-blue-800 font-jua mb-1">팁</div>
              <div className="text-sm text-blue-700 font-noto-serif-kr">
                아주 작은 것도 좋아요! "따뜻한 커피 한 잔", "안전한 하루" 등
              </div>
            </div>
          </div>
        </div>

        {/* 기분 선택 */}
        <div 
          className={`transition-all duration-800 ease-out delay-400 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-4">
            <h3 className="font-semibold text-gray-800 font-jua mb-2">지금 기분은 어떤가요?</h3>
          </div>
          
          <div className="flex justify-center space-x-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200
                           ${selectedMood === mood.id
                             ? 'border-blue-500 bg-blue-50 scale-110'
                             : 'border-gray-200 bg-white/70 hover:bg-white/90 hover:border-gray-300'
                           }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className={`text-xs font-noto-serif-kr
                               ${selectedMood === mood.id ? 'text-blue-700' : 'text-gray-600'}`}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 저장 버튼 */}
      <div 
        className={`pt-6 transition-all duration-800 ease-out delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <button
          onClick={handleNext}
          className={`w-full font-bold py-5 px-6 rounded-3xl 
                     transition-all duration-200 font-jua text-lg
                     ${hasAnyContent || selectedMood
                       ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                       : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                     }`}
        >
          {hasAnyContent ? '저장하고 계속' : '건너뛰기'}
        </button>
      </div>
    </div>
  )
}