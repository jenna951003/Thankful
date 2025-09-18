'use client'

interface DetailViewButtonProps {
  onClick?: () => void
}

export default function DetailViewButton({ onClick }: DetailViewButtonProps) {
  return (
    <button
      onClick={onClick || (() => console.log('상세 통계 페이지로 이동'))}
      className="w-full py-3 px-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* 통계 아이콘 */}
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          {/* 텍스트 */}
          <div className="text-left">
            <div className="text-sm font-bold text-gray-800 font-jua">
              더 자세한 통계 보기
            </div>
            <div className="text-xs text-gray-500 font-noto-serif-kr">
              월별, 연도별 상세 분석
            </div>
          </div>
        </div>

        {/* 화살표 SVG */}
        <svg
          className="w-5 h-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  )
}