'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useTranslation } from '../../hooks/useTranslation'

const faithOptions = [
  { id: 'protestant', icon: '✝️' },
  { id: 'catholic', icon: '⛪' },
  { id: 'orthodox', icon: '☦️' },
  { id: 'other', icon: '🙏' },
  { id: 'exploring', icon: '🔍' }
]

export default function FaithBackgroundScreen() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslation()
  const { setFaithBackground } = useOnboarding()
  const [selectedFaith, setSelectedFaith] = useState<string | null>(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    if (selectedFaith) {
      setFaithBackground(selectedFaith)
      router.push(`/${locale}/onboarding/3`)
    }
  }

  const handleSkip = () => {
    router.push(`/${locale}/onboarding/3`)
  }

  return (
    <div className="flex flex-col h-full">
      {/* 상단 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-center">
        <div 
          className={`text-center mb-12 transition-opacity duration-800 ease-out ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* 아이콘 */}
          <div className="text-5xl mb-6">📖</div>
          
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-jua">
            {t('onboarding.faith.title')}
          </h1>
          
          {/* 설명 */}
          <p className="text-gray-600 font-noto-serif-kr">
            {t('onboarding.faith.subtitle')}
          </p>
        </div>

        {/* 선택 옵션들 */}
        <div 
          className={`space-y-3 transition-opacity duration-800 ease-out delay-200 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {faithOptions.map((option, index) => (
            <button
              key={option.id}
              onClick={() => setSelectedFaith(option.id)}
              className={`w-full p-5 retro-card transition-all duration-200 
                         flex items-center space-x-4 group
                         ${selectedFaith === option.id 
                           ? 'retro-blue' 
                           : ''
                         }`}
              style={{
                animationDelay: `${300 + index * 100}ms`
              }}
            >
              {/* 라디오 버튼 */}
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                           ${selectedFaith === option.id 
                             ? 'border-white bg-white' 
                             : 'border-gray-300'
                           }`}
              >
                {selectedFaith === option.id && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>

              {/* 아이콘 */}
              <div className="text-2xl">{option.icon}</div>

              {/* 라벨 */}
              <div 
                className={`font-semibold font-noto-serif-kr
                           ${selectedFaith === option.id 
                             ? 'text-white' 
                             : 'text-gray-700'
                           }`}
              >
                {t(`onboarding.faith.options.${option.id}`)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 버튼들 */}
      <div 
        className={`flex space-x-3 pt-6 transition-opacity duration-800 ease-out delay-400 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* 나중에 버튼 */}
        <button
          onClick={handleSkip}
          className={`flex-1 retro-card text-gray-600 font-semibold py-4 px-6 
                   transition-all duration-200 font-noto-serif-kr`}
        >
          {t('onboarding.faith.laterButton')}
        </button>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!selectedFaith}
          className={`flex-1 font-semibold py-4 px-6 retro-button 
                     transition-all duration-200 font-jua text-lg text-white
                     ${selectedFaith
                       ? 'retro-button-ocean'
                       : 'opacity-50 cursor-not-allowed'
                     }`}
        >
          {t('onboarding.faith.nextButton')}
        </button>
      </div>
    </div>
  )
}