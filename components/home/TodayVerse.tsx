'use client'

import { useState, useEffect } from 'react'

interface TodayVerseProps {
  locale: string
}

interface Verse {
  text: string
  reference: string
  theme: string
}

export default function TodayVerse({ locale }: TodayVerseProps) {
  const [currentVerse, setCurrentVerse] = useState<Verse>({
    text: "쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라",
    reference: "데살로니가전서 5:17-18",
    theme: "기도와 감사"
  })

  const verses: Verse[] = [
    {
      text: "쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라",
      reference: "데살로니가전서 5:17-18",
      theme: "기도와 감사"
    },
    {
      text: "여호와께 감사하며 그의 이름을 불러 아뢰며 그의 행하심을 만민 중에 알게 하며",
      reference: "시편 105:1",
      theme: "찬양과 감사"
    },
    {
      text: "내 영혼아 여호와를 송축하라 내 속에 있는 모든 것들아 그의 거룩한 이름을 송축하라",
      reference: "시편 103:1",
      theme: "찬양"
    },
    {
      text: "너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라",
      reference: "베드로전서 5:7",
      theme: "평안과 신뢰"
    }
  ]

  useEffect(() => {
    // 날짜 기반으로 말씀 선택
    const today = new Date()
    const dayIndex = today.getDate() % verses.length
    setCurrentVerse(verses[dayIndex])
  }, [])

  const handleCreateVerseNote = () => {
    // 말씀 노트 생성 기능 (추후 구현)
    console.log('Creating verse note:', currentVerse)
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <h3 className="text-lg font-bold font-jua text-gray-800">
            오늘의 말씀
          </h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          {currentVerse.theme}
        </span>
      </div>
      
      <blockquote className="text-gray-700 font-noto-serif-kr text-base leading-relaxed mb-3 italic">
        "{currentVerse.text}"
      </blockquote>
      
      <div className="flex items-center justify-between">
        <cite className="text-sm font-medium text-blue-600 not-italic">
          - {currentVerse.reference}
        </cite>
        <button
          onClick={handleCreateVerseNote}
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-medium transition-colors"
        >
          노트 작성
        </button>
      </div>
    </div>
  )
}