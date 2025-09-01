'use client'

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthProvider'

interface AuthScreenProps {
  onClose?: () => void
}

export default function AuthScreen({ onClose }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const { signIn, signUp, signInWithGoogle, resetPassword, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName)
        if (error) throw error
        alert('회원가입 확인 이메일을 보냈습니다. 이메일을 확인해 주세요!')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        onClose?.()
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('비밀번호를 재설정하려면 이메일을 먼저 입력해 주세요')
      return
    }

    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      alert('비밀번호 재설정 링크를 이메일로 보냈습니다!')
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 mx-auto">
            📖
          </div>
          <h1 className="font-jua text-2xl text-gray-800 mb-2">
            {isSignUp ? '회원가입' : '로그인'}
          </h1>
          <p className="font-hubballi text-gray-600">
            {isSignUp ? '새로운 계정을 만들어 보세요' : '계정에 로그인하세요'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-jua">
                사용자 이름
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-300 font-hubballi"
                placeholder="표시될 이름을 입력하세요"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-jua">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-300 font-hubballi"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-jua">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-300 font-hubballi"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-hubballi">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-jua"
          >
            {loading ? (isSignUp ? '가입 중...' : '로그인 중...') : (isSignUp ? '회원가입' : '로그인')}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-hubballi">또는</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-jua flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 {isSignUp ? '회원가입' : '로그인'}
          </button>

          {!isSignUp && (
            <button
              type="button"
              onClick={handlePasswordReset}
              className="w-full text-sm text-blue-600 hover:text-blue-800 font-hubballi"
            >
              비밀번호를 잊으셨나요?
            </button>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600 font-hubballi">
            {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
          </p>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium font-jua"
          >
            {isSignUp ? '로그인하기' : '회원가입하기'}
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}