'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../utils/supabase/client'
import { useAuth } from '../../../contexts/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const { refreshProfile } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isHandling, setIsHandling] = useState(false)
  const supabase = createClient()
  const isMounted = useRef(true)
  const hasProcessed = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    
    const handleAuthCallback = async () => {
      if (isHandling || hasProcessed.current || !isMounted.current) {
        console.log('Already handling auth callback, skipping...', {
          isHandling,
          hasProcessed: hasProcessed.current,
          isMounted: isMounted.current
        })
        return
      }
      
      setIsHandling(true)
      hasProcessed.current = true
      console.log('🚀 Starting auth callback handling...')
      
      try {
        // URL에서 인증 코드와 오류 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search)
        const errorParam = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        const code = urlParams.get('code')
        
        console.log('URL params:', { errorParam, errorDescription, code })
        
        if (errorParam) {
          console.error('OAuth Error:', errorParam, errorDescription)
          
          let errorMessage = '로그인 중 오류가 발생했습니다.'
          
          // 오류 유형별 메시지 처리
          if (errorParam === 'server_error') {
            if (errorDescription?.includes('Database error saving new user')) {
              console.error('데이터베이스 오류: 새 사용자 저장 실패')
              errorMessage = '계정 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            } else if (errorDescription?.includes('Flow state not found')) {
              console.error('OAuth flow state 오류')
              errorMessage = '로그인 세션이 만료되었습니다. 페이지를 새로고침하고 다시 시도해주세요.'
            } else {
              errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            }
          } else if (errorParam === 'access_denied') {
            errorMessage = '로그인이 취소되었습니다.'
          } else if (errorDescription) {
            errorMessage = errorDescription
          }
          
          setError(errorMessage)
          
          // Flow state 오류인 경우 즉시 홈으로, 다른 오류는 3초 후
          const delay = errorDescription?.includes('Flow state not found') ? 1000 : 3000
          setTimeout(() => {
            router.replace('/')
          }, delay)
          return
        }

        // 코드가 없으면 홈으로 리다이렉트
        if (!code) {
          console.log('No auth code found, redirecting to home')
          router.replace('/')
          return
        }

        console.log('Processing auth code...')
        
        // 먼저 현재 세션이 있는지 확인
        const { data: currentSession } = await supabase.auth.getSession()
        
        if (currentSession.session) {
          console.log('Session already exists, user authenticated')
          
          // AuthContext가 프로필 생성을 자동으로 처리하므로 여기서는 단순히 프로필 새로고침만
          console.log('Refreshing profile...')
          await refreshProfile()
          
          console.log('Redirecting to home...')
          router.replace('/')
          return
        }

        // 세션이 없으면 코드를 교환 시도
        console.log('No existing session, exchanging code for session...')
        
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError)
            setError('인증 코드 처리 중 오류가 발생했습니다.')
            setTimeout(() => {
              router.replace('/')
            }, 3000)
            return
          }

          if (data?.session && data?.user) {
            console.log('User authenticated successfully via code exchange')
            // AuthContext가 자동으로 프로필을 생성/처리하므로 바로 리다이렉트
            router.replace('/')
          } else {
            console.log('No session found after code exchange')
            router.replace('/')
          }
        } catch (error) {
          console.error('Code exchange failed:', error)
          setError('로그인 처리 중 오류가 발생했습니다.')
          setTimeout(() => {
            router.replace('/')
          }, 3000)
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        setError('예기치 않은 오류가 발생했습니다.')
        setTimeout(() => {
          router.replace('/')
        }, 3000)
      }
    }

    // URL 파라미터가 있을 때만 콜백 처리 실행
    const urlParams = new URLSearchParams(window.location.search)
    const hasParams = urlParams.has('code') || urlParams.has('error')
    
    if (hasParams && !isHandling && !hasProcessed.current) {
      console.log('📋 URL params detected:', Object.fromEntries(urlParams))
      handleAuthCallback()
    } else if (!hasParams && !hasProcessed.current) {
      // URL에 파라미터가 없으면 홈으로 리다이렉트
      console.log('❌ No URL parameters found, redirecting to home')
      hasProcessed.current = true
      router.replace('/')
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#eeead9] flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto">
              ❌
            </div>
            <p className="font-jua text-xl text-gray-700 mb-2">오류 발생</p>
            <p className="font-noto-serif-kr text-red-600 mb-4">{error}</p>
            <p className="font-noto-serif-kr text-sm text-gray-500">잠시 후 홈으로 이동합니다...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-[#759861] to-[#56874f] rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto animate-pulse">
              🙏
            </div>
            <p className="font-jua text-xl text-gray-700 mb-2">로그인 처리 중...</p>
            <p className="font-noto-serif-kr text-gray-600">잠시만 기다려 주세요</p>
          </>
        )}
      </div>
    </div>
  )
}