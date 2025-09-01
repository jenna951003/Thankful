'use client'

import { useState } from 'react'

interface AboutSectionProps {
  locale: string
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedback, setFeedback] = useState('')

  const appInfo = {
    version: '1.0.0',
    buildNumber: '2024.12.31',
    platform: 'iOS/Android',
    developer: 'ThirdSaas Team',
    lastUpdate: '2024년 12월 31일'
  }

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      // TODO: Submit feedback to backend
      console.log('Submitting feedback:', feedback)
      setFeedbackSubmitted(true)
      setFeedback('')
      setTimeout(() => setFeedbackSubmitted(false), 3000)
    }
  }

  const handleRateApp = () => {
    // TODO: Open app store rating
    console.log('Opening app store for rating')
  }

  const handleShareApp = () => {
    // TODO: Implement native sharing
    if (navigator.share) {
      navigator.share({
        title: 'Thankful - 영적 여정 기록 앱',
        text: '감사, 설교, 기도를 아름다운 캔버스로 기록해보세요',
        url: 'https://thankful.app'
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `Thankful - 영적 여정 기록 앱\n감사, 설교, 기도를 아름다운 캔버스로 기록해보세요\nhttps://thankful.app`
      navigator.clipboard.writeText(shareText)
      alert('링크가 클립보드에 복사되었습니다!')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 mx-auto">
          📖
        </div>
        <h2 className="text-2xl font-bold font-jua text-gray-800 mb-2">
          Thankful
        </h2>
        <p className="text-sm text-gray-600 font-hubballi">
          영적 여정을 시각적으로 기록하는 앱
        </p>
      </div>

      {/* App Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          📱 앱 정보
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">버전</span>
            <span className="font-medium text-gray-800">{appInfo.version}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">빌드 번호</span>
            <span className="font-medium text-gray-800">{appInfo.buildNumber}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">플랫폼</span>
            <span className="font-medium text-gray-800">{appInfo.platform}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">개발자</span>
            <span className="font-medium text-gray-800">{appInfo.developer}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">마지막 업데이트</span>
            <span className="font-medium text-gray-800">{appInfo.lastUpdate}</span>
          </div>
        </div>
      </div>

      {/* App Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          💝 앱 응원하기
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={handleRateApp}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            ⭐ 앱스토어에서 평점 남기기
          </button>
          
          <button
            onClick={handleShareApp}
            className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            🎁 친구들에게 추천하기
          </button>
        </div>
      </div>

      {/* Feedback */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          💬 피드백 보내기
        </h3>
        
        <div className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="앱에 대한 의견이나 개선사항을 자유롭게 적어주세요. 여러분의 소중한 의견이 더 나은 앱을 만드는 데 큰 도움이 됩니다!"
            className="w-full h-32 p-4 bg-gray-50 rounded-2xl border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 font-hubballi"
          />
          
          <button
            onClick={handleFeedbackSubmit}
            disabled={!feedback.trim() || feedbackSubmitted}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
              feedbackSubmitted
                ? 'bg-green-100 text-green-700'
                : feedback.trim()
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
            }`}
          >
            {feedbackSubmitted ? '✅ 피드백이 전송되었습니다!' : '📨 피드백 보내기'}
          </button>
        </div>
      </div>

      {/* Support & Legal */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          🛟 지원 및 문의
        </h3>
        
        <div className="space-y-3">
          <button className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors">
            📧 고객지원 이메일
          </button>
          
          <button className="w-full py-3 bg-purple-50 text-purple-700 rounded-xl font-medium hover:bg-purple-100 transition-colors">
            💬 실시간 채팅 문의
          </button>
          
          <button className="w-full py-3 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors">
            📚 사용법 가이드
          </button>
          
          <button className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors">
            🐛 버그 신고하기
          </button>
        </div>
      </div>

      {/* Legal */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          📄 약관 및 정책
        </h3>
        
        <div className="space-y-3">
          <button className="w-full py-3 text-left text-gray-600 hover:text-gray-800 transition-colors border-b border-gray-100">
            서비스 이용약관
          </button>
          
          <button className="w-full py-3 text-left text-gray-600 hover:text-gray-800 transition-colors border-b border-gray-100">
            개인정보 처리방침
          </button>
          
          <button className="w-full py-3 text-left text-gray-600 hover:text-gray-800 transition-colors border-b border-gray-100">
            오픈소스 라이선스
          </button>
          
          <button className="w-full py-3 text-left text-gray-600 hover:text-gray-800 transition-colors border-b border-gray-100">
            커뮤니티 가이드라인
          </button>
        </div>
      </div>

      {/* Credits */}
      <div className="text-center py-6 border-t border-gray-100">
        <p className="text-sm text-gray-500 font-hubballi mb-2">
          Made with ❤️ by ThirdSaas Team
        </p>
        <p className="text-xs text-gray-400 font-hubballi">
          © 2024 Thankful App. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 font-hubballi mt-2">
          "쉬지 말고 기도하라 범사에 감사하라" - 데살로니가전서 5:17-18
        </p>
      </div>
    </div>
  )
}