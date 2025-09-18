'use client'

import { useState } from 'react'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { useTranslation } from '../../../hooks/useTranslation'

interface TodayGratitudeCardProps {
  user: User | null
}

export default function TodayGratitudeCard({ user }: TodayGratitudeCardProps) {
  const { t } = useTranslation()

  const handleGratitudeNote = () => {
    // TODO: 감사노트 작성 페이지로 이동
    console.log('감사노트 작성 페이지로 이동')
  }

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  return (
    <div className="bg-[#dcd4c6] rounded-2xl p-6 mb-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 font-jua">
            오늘의 말씀
          </h2>
          <p className="text-sm text-gray-600 font-bold font-noto-serif-kr">
            {today}
          </p>
        </div>
        <Image
          src="/Home/Bible.png"
          alt="성경"
          width={36}
          height={36}
          className="select-none"
        />
      </div>

      {/* 오늘의 말씀 구절 */}
      <div
        className="mb-4 p-4 py-16 rounded-lg"
        style={{ background: '#f4efe7' }}
      >
        <div className="text-center">
          <p className="text-base font-medium text-gray-700 mb-2 font-noto-serif-kr">
            " 여호와는 나의 목자시니 내게 부족함이 없으리로다 "
          </p>
          <p className="text-xs text-gray-500 font-bold font-noto-serif-kr">
            시편 23:1
          </p>
        </div>
      </div>


      {/* 감사노트 안내 */}
      <div
        className="mt-4 p-3 rounded-lg"
        style={{ background: '#f0f5f0' }}
      >
        <p className="text-sm text-gray-700 font-noto-serif-kr text-center">
          💚 <strong>이 말씀을 통해 받은 은혜와 감사함을</strong><br/>
          <strong>감사노트에 기록해보세요</strong>
        </p>
      </div>

      {/* 감사노트 작성 버튼 */}
      <button
        onClick={handleGratitudeNote}
        className="w-full mt-4 py-3 px-6 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 font-jua"
        style={{ background: 'var(--retro-green-gradient)' }}
      >
        🙏 감사노트 작성하기
      </button>
    </div>
  )
}