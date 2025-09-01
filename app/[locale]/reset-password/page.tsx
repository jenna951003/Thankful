'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../utils/supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user came from a valid reset link
    const { data: { session } } = supabase.auth.getSession()
    if (!session) {
      router.push('/')
    }
  }, [router])

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#eeead9] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 mx-auto">
            ✅
          </div>
          <h1 className="font-jua text-2xl text-gray-800 mb-4">
            비밀번호 변경 완료
          </h1>
          <p className="font-hubballi text-gray-600 mb-6">
            새로운 비밀번호로 변경되었습니다. 홈으로 이동합니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#eeead9] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 mx-auto">
            🔒
          </div>
          <h1 className="font-jua text-2xl text-gray-800 mb-2">
            새 비밀번호 설정
          </h1>
          <p className="font-hubballi text-gray-600">
            안전한 새 비밀번호를 설정해 주세요
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-jua">
              새 비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-300 font-hubballi"
              placeholder="최소 6자 이상 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-jua">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-300 font-hubballi"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-hubballi">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-jua"
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors font-jua"
          >
            취소
          </button>
        </form>
      </div>
    </div>
  )
}