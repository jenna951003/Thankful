'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface NotesChartWidgetProps {
  user: User | null
}

interface ChartDataPoint {
  gratitude: number
  sermon: number
  prayer: number
}

type ViewType = 'monthly' | 'yearly'

export default function NotesChartWidget({ user }: NotesChartWidgetProps) {
  const [viewType, setViewType] = useState<ViewType>('monthly')
  const [chartData, setChartData] = useState<{
    labels: string[]
    datasets: any[]
  }>({
    labels: [],
    datasets: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateChartData = () => {
      if (viewType === 'monthly') {
        // 최근 12개월 데이터
        const months = []
        const gratitudeData = []
        const sermonData = []
        const prayerData = []

        const now = new Date()
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          months.push(date.toLocaleDateString('ko-KR', { month: 'short' }))

          // 목업 데이터 생성 (실제로는 Supabase에서 조회)
          gratitudeData.push(Math.floor(Math.random() * 25) + 5)
          sermonData.push(Math.floor(Math.random() * 15) + 2)
          prayerData.push(Math.floor(Math.random() * 20) + 3)
        }

        setChartData({
          labels: months,
          datasets: [
            {
              label: '감사노트',
              data: gratitudeData,
              backgroundColor: 'rgba(109, 191, 119, 0.8)',
              borderColor: 'rgba(109, 191, 119, 1)',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: '설교노트',
              data: sermonData,
              backgroundColor: 'rgba(74, 144, 226, 0.8)',
              borderColor: 'rgba(74, 144, 226, 1)',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: '기도노트',
              data: prayerData,
              backgroundColor: 'rgba(139, 105, 195, 0.8)',
              borderColor: 'rgba(139, 105, 195, 1)',
              borderWidth: 1,
              borderRadius: 4,
            }
          ]
        })
      } else {
        // 최근 5년 데이터
        const years = []
        const gratitudeData = []
        const sermonData = []
        const prayerData = []

        const currentYear = new Date().getFullYear()
        for (let i = 4; i >= 0; i--) {
          const year = currentYear - i
          years.push(year.toString())

          // 목업 데이터 생성
          gratitudeData.push(Math.floor(Math.random() * 250) + 50)
          sermonData.push(Math.floor(Math.random() * 150) + 25)
          prayerData.push(Math.floor(Math.random() * 200) + 30)
        }

        setChartData({
          labels: years,
          datasets: [
            {
              label: '감사노트',
              data: gratitudeData,
              backgroundColor: 'rgba(109, 191, 119, 0.8)',
              borderColor: 'rgba(109, 191, 119, 1)',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: '설교노트',
              data: sermonData,
              backgroundColor: 'rgba(74, 144, 226, 0.8)',
              borderColor: 'rgba(74, 144, 226, 1)',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: '기도노트',
              data: prayerData,
              backgroundColor: 'rgba(139, 105, 195, 0.8)',
              borderColor: 'rgba(139, 105, 195, 1)',
              borderWidth: 1,
              borderRadius: 4,
            }
          ]
        })
      }
      setLoading(false)
    }

    generateChartData()
  }, [viewType, user])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Noto Serif KR',
            size: 12
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'rect'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        font: {
          family: 'Noto Serif KR'
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Noto Serif KR',
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: 'Noto Serif KR',
            size: 11
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    }
  }

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      {/* 헤더 및 토글 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h4 className="font-bold text-gray-800 font-jua">기록 추이</h4>
          <Image
            src="/Home/Memo.png"
            alt="기록추이"
            width={20}
            height={20}
            className="select-none"
          />
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewType('monthly')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors duration-200 font-noto-serif-kr ${
              viewType === 'monthly'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            월별
          </button>
          <button
            onClick={() => setViewType('yearly')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors duration-200 font-noto-serif-kr ${
              viewType === 'yearly'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            연도별
          </button>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="h-64 w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* 하단 설명 */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center font-noto-serif-kr">
          {viewType === 'monthly'
            ? '최근 12개월간의 노트 작성 현황입니다'
            : '최근 5년간의 노트 작성 현황입니다'
          }
        </p>
      </div>
    </div>
  )
}