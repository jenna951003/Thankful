'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { useDeviceDetection } from '../../hooks/useDeviceDetection'

const moodOptions = [
  { id: 'joyful', image: 'Smile.png', label: '기쁨' },
  { id: 'peaceful', image: 'Comfortable.png', label: '평안' },
  { id: 'grateful', image: 'Thanks.png', label: '감사' },
  { id: 'hopeful', image: 'Hope.png', label: '소망' },
  { id: 'blessed', image: 'Blessing.png', label: '축복' }
]

export default function FirstGratitudeScreen() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { setFirstGratitude, startTransition, setStep } = useOnboarding()
  const { isHomeButtonDevice } = useDeviceDetection()
  const [gratitudeItems, setGratitudeItems] = useState([''])
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [showContent, setShowContent] = useState(false)
  const [checkIconVisible, setCheckIconVisible] = useState(false)
  const [checkIconAnimating, setCheckIconAnimating] = useState(false)
  const [buttonText, setButtonText] = useState('건너뛰기')
  const [buttonTextAnimating, setButtonTextAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...gratitudeItems]
    const previousValue = newItems[index]
    newItems[index] = value
    setGratitudeItems(newItems)
    
    // 체크 아이콘 애니메이션 관리
    const hasContent = value.trim() !== ''
    const hadContent = previousValue.trim() !== ''
    
    if (hasContent && !hadContent) {
      // 내용이 생겼을 때 - 나타나는 애니메이션
      setCheckIconVisible(true)
      setCheckIconAnimating(true)
      setTimeout(() => {
        setCheckIconAnimating(false)
      }, 400)
      
      // 버튼 텍스트 애니메이션 - 건너뛰기 → 저장하고 계속
      if (buttonText === '건너뛰기') {
        setButtonTextAnimating(true)
        setTimeout(() => {
          setButtonText('저장하고 계속')
          setTimeout(() => {
            setButtonTextAnimating(false)
          }, 50)
        }, 200)
      }
    } else if (!hasContent && hadContent) {
      // 내용이 사라졌을 때 - 사라지는 애니메이션
      setCheckIconAnimating(true)
      setTimeout(() => {
        setCheckIconVisible(false)
        setCheckIconAnimating(false)
      }, 300)
      
      // 버튼 텍스트 애니메이션 - 저장하고 계속 → 건너뛰기
      if (buttonText === '저장하고 계속') {
        setButtonTextAnimating(true)
        setTimeout(() => {
          setButtonText('건너뛰기')
          setTimeout(() => {
            setButtonTextAnimating(false)
          }, 50)
        }, 200)
      }
    }
    
    // 자동 크기 조절
    const textarea = document.querySelector(`textarea[data-index="${index}"]`) as HTMLTextAreaElement
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  const handleNext = () => {
    const filledItems = gratitudeItems.filter(item => item.trim() !== '')
    setFirstGratitude({
      items: filledItems,
      mood: selectedMood || undefined
    })
    
    // 전환 시작
    startTransition()
    
    // 페이드아웃 후 페이지 이동
    setTimeout(() => {
      setStep(7)
      router.push(`/${locale}/onboarding/7`)
    }, 400)
  }

  const handleBack = () => {
    // 전환 시작
    startTransition()
    
    // 페이드아웃 후 페이지 이동
    setTimeout(() => {
      setStep(5)
      router.push(`/${locale}/onboarding/5`)
    }, 400)
  }

  const hasAnyContent = gratitudeItems.some(item => item.trim() !== '')

  return (
    <div className={`flex flex-col ${isHomeButtonDevice ? 'mb-[10vh]' : 'mb-[20vh]'} items-center w-full h-full text-center relative`}>
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
        
        .fade-inputs { 
          animation: fadeIn 0.8s ease-out 1.6s forwards; 
        }
        
        .fade-tip { 
          animation: fadeIn 0.8s ease-out 2.0s forwards; 
        }
        
        .fade-mood { 
          animation: fadeIn 0.8s ease-out 2.4s forwards; 
        }
        
        .fade-button { 
          animation: fadeIn 0.8s ease-out 2.8s forwards; 
        }
        
        .simple-button {
          transition: transform 0.15s ease-out;
        }
        
        .simple-button:active {
          transform: scale(0.98);
        }

        .simple-button2 {
          transition: all 0.7s ease-in-out;
        }

        .simple-button2:active {
          transform: translateY(-2px);
        }
        
        /* 플레이스홀더 페이드 애니메이션 */
        .placeholder-fade::placeholder {
          transition: opacity 0.3s ease-out;
        }
        
        .placeholder-fade:focus::placeholder {
          opacity: 0;
        }
        
        /* 자동 크기 조절 애니메이션 */
        .auto-resize {
          transition: height 0.2s ease-out;
        }

        /* 체크 아이콘 애니메이션 */
        .check-icon-enter {
          animation: checkAppear 0.4s ease-out forwards;
        }

        .check-icon-exit {
          animation: checkDisappear 0.3s ease-out forwards;
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

        @keyframes checkDisappear {
          from {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          to {
            opacity: 0;
            transform: scale(0.5) rotate(15deg);
          }
        }

        /* 기분 선택 체크 아이콘 애니메이션 */
        .mood-check-icon {
          animation: checkAppear 0.4s ease-out forwards;
        }

        /* 버튼 텍스트 애니메이션 */
        .button-text {
          transition: opacity 0.2s ease-out;
        }
        
        .button-text-fade-out {
          opacity: 0;
        }
        
        .button-text-fade-in {
          opacity: 1;
        }
      `}</style>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-start w-full max-w-md px-4">
        {/* 타이틀 */}
        <h1 className="text-lg -mx-2 font-bold text-gray-800 mb-1 mt-6 font-noto-serif-kr tracking-wide fade-start fade-title">
          첫 번째 감사를 기록해보세요!
        </h1>

        {/* 부제목 */}
        <p className="text-sm text-gray-600 mb-6 font-semibold font-noto-serif-kr leading-relaxed fade-start fade-subtitle">
          오늘 하나님께 감사한 일이 있다면?
        </p>

        {/* 감사 입력 필드 */}
        <div className="mb-3 fade-start fade-inputs">
          <div className="relative">
                          <textarea
                value={gratitudeItems[0]}
                onChange={(e) => handleItemChange(0, e.target.value)}
                placeholder="감사한 일을 적어보세요."
                className="w-full px-4 py-3 bg-white/80 text-base rounded-2xl focus:outline-none font-semibold font-noto-serif-kr placeholder-gray-400 resize-none placeholder-fade auto-resize"
                data-index="0"
                style={{ minHeight: '80px', height: 'auto' }}
                rows={1}
                spellCheck={false}
              />
              {checkIconVisible && (
                <div className={`absolute -top-3.5 -right-3.5 w-10 h-10 ${
                  checkIconAnimating 
                    ? (gratitudeItems[0].trim() ? 'check-icon-enter' : 'check-icon-exit')
                    : ''
                }`}>
                  <img 
                    src="/Check3.png" 
                    alt="Completed"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
          </div>
        </div>

        {/* 팁 */}
        <div className="fade-start fade-tip mb-6">
          <div className="relative py-2 px-5 bg-[#e5d4cd] font-noto-serif-kr rounded-2xl">
            <div className="absolute -top-5 -left-5 w-12 h-12 -rotate-12">
              <img 
                src="/Tip2.png" 
                alt="Tip"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-[14px] text-gray-800">
                팁 &nbsp;<span className="text-[12px] font-bold text-gray-500">"오늘 주신 건강", "가족의 평안", "말씀으로 주신 위로" 등</span>
              </div>
            </div>
          </div>
        </div>

        {/* 기분 선택 */}
        <div className="fade-start fade-mood">
          <div className="text-center mb-2">
            <h3 className="font-semibold text-gray-700 tracking-wide font-jua mb-4">지금 기분은 어떤가요?</h3>
          </div>
          
          <div className="flex justify-between w-full gap-2 mb-8">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex-1 relative flex flex-col items-center py-1.5 px-1 rounded-lg simple-button2
                           ${selectedMood === mood.id
                             ? 'bg-[#dad8c8] text-[#4d6f5e] -translate-y-1.5'
                             : 'bg-white text-gray-700'
                           }`}
              >
                <div className="w-10 h-10 -my-2">
                  <img 
                    src={`/${mood.image}`} 
                    alt={mood.label}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className={`text-xs font-noto-serif-kr font-bold
                               ${selectedMood === mood.id ? 'text-[#4d6f5e]' : 'text-gray-600'}`}>
                  {mood.label}
                </div>
                
                {/* 체크 이미지 - 선택된 경우에만 표시 */}
                {selectedMood === mood.id && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 mood-check-icon">
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
      </div>

      {/* 하단 저장 버튼 */}
      <div className="w-full max-w-sm px-4 space-y-3 pb-4 fade-start fade-button">
        <button
          onClick={handleNext}
          className={`w-full retro-button button-screen-texture tracking-wider
                   font-semibold py-4 px-6 text-white font-jua text-lg simple-button`}
          style={{ 
            background: '#4f8750'
          }}
        >
          <span className={`button-text ${buttonTextAnimating ? 'button-text-fade-out' : 'button-text-fade-in'}`}>
            {buttonText}
          </span>
        </button>

        {/* 뒤로 가기 버튼 */}
        <button
          onClick={handleBack}
          className="w-full retro-card text-gray-700 font-semibold py-4 px-6 font-jua simple-button"
        >
          뒤로
        </button>
      </div>
    </div>
  )
}