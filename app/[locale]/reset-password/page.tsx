'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '../../../utils/supabase/client'
import { useTranslation } from '../../../hooks/useTranslation'
import LoadingOverlay from '../../../components/common/LoadingOverlay'

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { t } = useTranslation()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [errors, setErrors] = useState<{
    password?: string
    confirmPassword?: string
    general?: string
  }>({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [showContent, setShowContent] = useState(false)

  // 세션 검증
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('🔍 Checking reset session:', { hasSession: !!session, error })
        
        if (error || !session) {
          console.log('❌ No valid session, redirecting to home')
          router.replace(`/${locale}`)
          return
        }

        console.log('✅ Valid reset session found')
        setIsCheckingSession(false)
        
        // 콘텐츠 페이드인
        setTimeout(() => setShowContent(true), 100)
        
      } catch (err) {
        console.error('Session check error:', err)
        router.replace(`/${locale}`)
      }
    }

    checkSession()
  }, [supabase, router, locale])

  // 비밀번호 검증
  const validatePassword = (password: string): string | undefined => {
    if (!password) return '새 비밀번호를 입력해주세요.'
    if (password.length < 6) return '비밀번호는 최소 6자 이상이어야 합니다.'
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return '비밀번호는 영문과 숫자를 포함해야 합니다.'
    }
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return '비밀번호 확인을 입력해주세요.'
    if (password !== confirmPassword) return '비밀번호가 일치하지 않습니다.'
    return undefined
  }

  // 실시간 비밀번호 검증
  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (errors.password || errors.general) {
      const passwordError = validatePassword(value)
      setErrors(prev => ({ ...prev, password: passwordError, general: undefined }))
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (errors.confirmPassword || errors.general) {
      const confirmError = validateConfirmPassword(password, value)
      setErrors(prev => ({ ...prev, confirmPassword: confirmError, general: undefined }))
    }
  }

  // 비밀번호 재설정 처리
  const handlePasswordReset = async () => {
    // 검증
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
    
    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError
      })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      console.log('🔄 Updating password...')
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error('❌ Password update error:', error)
        
        let errorMessage = '비밀번호 변경에 실패했습니다.'
        switch (error.message) {
          case 'New password should be different from the old password.':
            errorMessage = '새 비밀번호는 기존 비밀번호와 달라야 합니다.'
            break
          case 'Password should be at least 6 characters':
            errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.'
            break
          case 'Invalid session':
            errorMessage = '세션이 만료되었습니다. 다시 시도해주세요.'
            break
          default:
            errorMessage = error.message || '비밀번호 변경에 실패했습니다.'
        }
        
        setErrors({ general: errorMessage })
        return
      }

      console.log('✅ Password updated successfully')
      setIsSuccess(true)
      
      // 3초 후 홈으로 리다이렉트
      setTimeout(() => {
        router.replace(`/${locale}`)
      }, 3000)

    } catch (err) {
      console.error('❌ Unexpected error:', err)
      setErrors({ general: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsLoading(false)
    }
  }

  // 세션 확인 중
  if (isCheckingSession) {
    return <LoadingOverlay isVisible={true} message="인증 확인 중..." />
  }

  // 성공 화면
  if (isSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'var(--bg-base)' }}
      >
        <div 
          className="retro-card w-full max-w-md p-8 text-center"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}
        >
          {/* 성공 아이콘 */}
          <div className="mb-6">
            <div className="w-20 h-20 retro-success rounded-2xl flex items-center justify-center text-white text-3xl mb-4 mx-auto">
              🔐
            </div>
            <div className="w-16 h-1 retro-warm rounded-full mx-auto"></div>
          </div>

          <h1 className="text-xl font-extrabold text-gray-800 mb-4 font-noto-serif-kr tracking-wide">
            비밀번호 변경 완료! 🎉
          </h1>
          
          <p className="text-base text-gray-600 mb-6 font-bold font-noto-serif-kr leading-relaxed">
            새로운 비밀번호로 안전하게<br />
            변경되었습니다.
          </p>

          <div className="text-sm text-gray-500 font-noto-serif-kr">
            3초 후 자동으로 홈페이지로 이동합니다...
          </div>
        </div>
      </div>
    )
  }

  // 비밀번호 재설정 폼
  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          background: 'var(--bg-base)',
          paddingTop: 'var(--actual-safe-top)',
          paddingBottom: 'var(--actual-safe-bottom)'
        }}
      >
        <div 
          className="retro-card w-full max-w-md p-8"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}
        >
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 retro-meadow rounded-2xl flex items-center justify-center text-white text-3xl mb-4 mx-auto">
              🔒
            </div>
            <div className="w-16 h-1 retro-warm rounded-full mx-auto mb-6"></div>
            
            <h1 className="text-xl font-extrabold text-gray-800 mb-3 font-noto-serif-kr tracking-wide">
              새 비밀번호 설정
            </h1>
            <p className="text-base text-gray-600 font-bold font-noto-serif-kr leading-relaxed">
              안전한 새 비밀번호를<br />
              설정해주세요
            </p>
          </div>

          {/* 비밀번호 입력 폼 */}
          <div className="space-y-6">
            {/* 새 비밀번호 */}
            <div>
              <label className="block text-sm ml-1 font-bold text-gray-600 mb-2 font-noto-serif-kr text-left">
                새 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="영문과 숫자를 포함해 6자 이상"
                className="w-full px-4 py-3 bg-[#eae4d7] font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-400"
                style={{
                  textDecoration: 'none',
                  WebkitTextDecorationLine: 'none'
                }}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-[#ea6666] pl-1 pt-0.5 text-sm mt-1 font-bold font-noto-serif-kr">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm ml-1 font-bold text-gray-600 mb-2 font-noto-serif-kr text-left">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full px-4 py-3 bg-[#eae4d7] font-bold rounded-xl font-noto-serif-kr text-gray-800 text-base transition-all placeholder-fade placeholder:text-gray-400"
                style={{
                  textDecoration: 'none',
                  WebkitTextDecorationLine: 'none'
                }}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-[#ea6666] pl-1 pt-0.5 text-sm mt-1 font-bold font-noto-serif-kr">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 일반 에러 메시지 */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-bold font-noto-serif-kr">
                {errors.general}
              </div>
            )}

            {/* 버튼들 */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handlePasswordReset}
                disabled={isLoading || !password || !confirmPassword}
                className={`w-full retro-button button-screen-texture tracking-wider font-semibold py-4 px-6 text-white font-jua text-lg simple-button ${
                  isLoading || !password || !confirmPassword ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{ 
                  backgroundColor: '#56874f',
                  color: 'white'
                }}
              >
                {isLoading ? '변경 중...' : '비밀번호 변경'}
              </button>

              <button
                onClick={() => router.replace(`/${locale}`)}
                disabled={isLoading}
                className={`w-full retro-card text-gray-700 font-semibold py-4 px-6 font-jua text-lg simple-button ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS 스타일 */}
      <style jsx>{`
        .simple-button {
          transition: transform 0.15s ease-out;
        }
        
        .simple-button:active:not(:disabled) {
          transform: scale(0.98);
        }
        
        .simple-button:focus {
          outline: none;
          box-shadow: none !important;
        }
        
        input:focus {
          outline: none;
          ring: none;
        }
        
        .placeholder-fade::placeholder {
          transition: opacity 0.3s ease-out;
        }
        
        .placeholder-fade:focus::placeholder {
          opacity: 0;
        }
      `}</style>
    </>
  )
}