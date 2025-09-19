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
    <div
      className="bg-[#dcd4c6] rounded-2xl p-6 mb-6 select-none"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        touchAction: 'pan-y',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 font-jua select-none" style={{
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none'
          }}>
            오늘의 말씀
          </h2>
          <p className="text-sm text-gray-600 font-bold font-noto-serif-kr select-none" style={{
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none'
          }}>
            {today}
          </p>
        </div>
        <Image
          src="/Home/Bible.png"
          alt="성경"
          width={42}
          height={42}
          className="select-none active:scale-95 transition-all duration-300"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      {/* 오늘의 말씀 구절 */}
      <div
        className="mb-4 p-8 pb-36 pt-24 rounded-3xl relative overflow-hidden"
        style={{ background: '#f4efe7' }}
      >
        {/* 배경 이미지 오버레이 */}
        <Image
          src="/Home/Verse.webp"
          alt="말씀 배경"
          fill
          className="object-cover object-center select-none"
          style={{
            zIndex: 1,
            opacity: 0.5,
            touchAction: 'pan-y',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none'
          }}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />

        {/* 텍스트 콘텐츠 */}
        <div className="text-center select-none relative" style={{ zIndex: 2 }}>
          <p className="text-base font-medium text-gray-700 mb-2 font-noto-serif-kr select-none" style={{
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none'
          }}>
            " 여호와는 나의 목자시니 내게 부족함이 없으리로다 "
          </p>
          <p className="text-xs text-gray-500 font-bold font-noto-serif-kr select-none" style={{
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            userSelect: 'none'
          }}>
            시편 23:1
          </p>
        </div>
      </div>


      {/* 감사노트 안내 */}
      <div
        className="mt-4 p-3 rounded-lg"
        style={{ background: '' }}
      >
        <p className="text-xl text-gray-700 font-nanum-brush-script text-center select-none" style={{
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          userSelect: 'none'
        }}>
          <strong>이 말씀을 통해 받은 은혜와 감사함을</strong><br/>
          <strong>감사노트에 기록해보세요</strong>
        </p>
      </div>

      {/* 감사노트 작성 버튼 */}
      <button
        onClick={handleGratitudeNote}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full mt-4 py-3 px-6 text-white font-bold rounded-2xl transition-all duration-200 active:scale-95 font-jua select-none"
        style={{
          background: '#729774',
          touchAction: 'pan-y',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <span className="select-none" style={{
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          userSelect: 'none'
        }}>감사노트 작성하기</span>
      </button>
    </div>
  )
}