'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../utils/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error during auth callback:', error.message)
        router.push('/')
        return
      }

      if (data.session) {
        console.log('User authenticated successfully')
        router.push('/')
      } else {
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-[#eeead9] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto animate-pulse">
          📖
        </div>
        <p className="font-jua text-xl text-gray-700 mb-2">로그인 처리 중...</p>
        <p className="font-hubballi text-gray-600">잠시만 기다려 주세요</p>
      </div>
    </div>
  )
}