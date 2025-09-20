'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef, memo } from 'react'
import { createClient } from '../utils/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import { Profile } from '../utils/supabase/types'
import { useTranslation } from '../hooks/useTranslation'
import { debugLogger } from '../utils/debugLogger'

// Supabase 클라이언트를 컴포넌트 외부에서 한 번만 생성
const supabase = createClient()


interface AuthResult {
  success: boolean
  error?: string
  shouldRedirectToOnboarding?: boolean
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
  signInWithGoogle: () => Promise<AuthResult>
  signInWithFacebook: () => Promise<AuthResult>
  signInWithApple: () => Promise<AuthResult>
  resetPassword: (email: string) => Promise<AuthResult>
  updateProfile: (updates: Partial<Profile>) => Promise<AuthResult>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

// 🎯 React.memo로 불필요한 리렌더링 방지
export const AuthProvider = memo(function AuthProvider({ children }: AuthProviderProps) {
  const { t } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // 🎯 중복 초기화 방지용 ref
  const initializationRef = useRef(false)
  const subscriptionRef = useRef<any>(null)

  // 🎯 프로필 캐싱 및 중복 요청 방지
  const profileCacheRef = useRef<Map<string, Profile | null>>(new Map())
  const fetchingProfileRef = useRef<Set<string>>(new Set())

  // 프로필 데이터 fetch 함수 (캐싱 및 중복 요청 방지)
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    // 캐시에서 확인
    const cachedProfile = profileCacheRef.current.get(userId)
    if (cachedProfile !== undefined) {
      if (process.env.NODE_ENV === 'development') {
        debugLogger.log('🎯 Using cached profile for userId:', userId)
      }
      return cachedProfile
    }

    // 이미 요청 중인지 확인
    if (fetchingProfileRef.current.has(userId)) {
      if (process.env.NODE_ENV === 'development') {
        debugLogger.log('⏳ Profile fetch already in progress for userId:', userId)
      }
      // 잠시 대기 후 캐시에서 다시 확인
      await new Promise(resolve => setTimeout(resolve, 100))
      return profileCacheRef.current.get(userId) || null
    }

    // 요청 시작 플래그 설정
    fetchingProfileRef.current.add(userId)

    if (process.env.NODE_ENV === 'development') {
      debugLogger.log('🔍 AuthProvider fetchProfile started for userId:', userId)
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('💥 Profile fetch error:', error)
        }
        // 캐시에 null 저장
        profileCacheRef.current.set(userId, null)
        return null
      }

      if (!data) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ No profile found for user:', userId)
        }
        // 캐시에 null 저장
        profileCacheRef.current.set(userId, null)
        return null
      }

      if (process.env.NODE_ENV === 'development') {
        debugLogger.log('✅ Profile fetch successful:', {
          id: data.id,
          email: data.email,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
          fullName: data.full_name
        })
      }

      // 캐시에 저장
      profileCacheRef.current.set(userId, data)
      return data
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('💥 Profile fetch exception:', err)
      }
      // 캐시에 null 저장
      profileCacheRef.current.set(userId, null)
      return null
    } finally {
      // 요청 완료 플래그 제거
      fetchingProfileRef.current.delete(userId)
    }
  }, [])

  useEffect(() => {
    // 🎯 중복 초기화 방지 - 이미 초기화되었다면 건너뛰기
    if (initializationRef.current) {
      if (process.env.NODE_ENV === 'development') {
        debugLogger.log('🛑 AuthProvider 중복 초기화 방지 - 이미 초기화됨')
      }
      return
    }

    if (process.env.NODE_ENV === 'development') {
      debugLogger.log('🚀 AuthProvider 초기화 시작... (첫 번째 실행)')
    }
    initializationRef.current = true

    let isMounted = true

    // Get initial session and profile
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!isMounted) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          if (process.env.NODE_ENV === 'development') {
            debugLogger.log('📋 초기 세션 발견:', session.user.email)
          }
          // 프로필 로드
          try {
            const userProfile = await fetchProfile(session.user.id)
            if (isMounted) {
              if (process.env.NODE_ENV === 'development') {
                debugLogger.log('📝 초기 프로필 로드 결과:', userProfile ? 'SUCCESS' : 'FAILED')
              }
              setProfile(userProfile)
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ 초기 프로필 로드 에러:', error)
            }
            if (isMounted) setProfile(null)
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            debugLogger.log('📭 초기 세션 없음')
          }
          setProfile(null)
        }

        // 초기화 완료
        if (isMounted) {
          if (process.env.NODE_ENV === 'development') {
            debugLogger.log('✅ AuthProvider 초기화 완료')
          }
          setLoading(false)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('💥 AuthProvider 초기화 에러:', error)
        }
        if (isMounted) {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // 🎯 기존 구독이 있으면 해지 (중복 방지)
    if (subscriptionRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🧹 기존 auth subscription 해지')
      }
      subscriptionRef.current.unsubscribe()
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        if (process.env.NODE_ENV === 'development') {
          debugLogger.log(`🔑 Auth event: ${event}`, session?.user?.email)
        }

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // 프로필 로드
          try {
            const userProfile = await fetchProfile(session.user.id)
            if (isMounted) {
              if (process.env.NODE_ENV === 'development') {
                debugLogger.log('📝 Profile result:', userProfile ? 'SUCCESS' : 'FAILED')
              }
              setProfile(userProfile)
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ 프로필 로드 에러:', error)
            }
            if (isMounted) setProfile(null)
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            debugLogger.log('🚪 User signed out')
          }
          setProfile(null)
        }
      }
    )

    // 구독 ref에 저장
    subscriptionRef.current = subscription

    return () => {
      isMounted = false
      if (subscription) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🧹 AuthProvider cleanup - subscription 해지')
        }
        subscription.unsubscribe()
      }
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 AuthProvider signIn called:', { email })
    }
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Login error:', error.message)
        console.log('🌍 Using fixed translation key: onboarding.login.errors.loginFailed')
        setLoading(false)
        return {
          success: false,
          error: t('onboarding.login.errors.loginFailed')
        }
      }

      if (!data.user) {
        console.error('❌ No user data received')
        setLoading(false)
        return {
          success: false,
          error: t('onboarding.login.errors.loginFailed')
        }
      }

      console.log('✅ Login successful, checking onboarding status...')

      // 프로필 정보 가져오기 (온보딩 완료 상태 확인용)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()

      const shouldRedirectToOnboarding = !profileData?.onboarding_completed

      console.log('📋 Login result:', {
        success: true,
        shouldRedirectToOnboarding,
        onboardingCompleted: profileData?.onboarding_completed
      })

      setLoading(false)
      return {
        success: true,
        shouldRedirectToOnboarding
      }
    } catch (err) {
      console.error('💥 Login exception:', err)
      console.log('🌍 Using fixed translation key: onboarding.login.errors.loginFailed')
      setLoading(false)
      return {
        success: false,
        error: t('onboarding.login.errors.loginFailed')
      }
    }
  }

  const signUp = async (email: string, password: string, displayName?: string): Promise<AuthResult> => {
    console.log('🔑 AuthProvider signUp called:', { email, displayName })
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || '익명 사용자'
          }
        }
      })

      if (error) {
        console.error('❌ SignUp error:', error.message)

        // 이미 가입된 이메일인지 확인
        if (error.message.includes('User already registered') ||
            error.message.includes('already registered') ||
            error.message.includes('Email address already in use')) {
          console.log('🌍 Using translation key: onboarding.signUp.errors.emailAlreadyExists')
          setLoading(false)
          return {
            success: false,
            error: t('onboarding.signUp.errors.emailAlreadyExists')
          }
        }

        console.log('🌍 Using fixed translation key: onboarding.signUp.errors.signUpFailed')
        setLoading(false)
        return {
          success: false,
          error: t('onboarding.signUp.errors.signUpFailed')
        }
      }

      console.log('✅ SignUp successful')
      setLoading(false)
      return {
        success: true,
        shouldRedirectToOnboarding: true
      }
    } catch (err) {
      console.error('💥 SignUp exception:', err)

      // catch 블록에서도 이메일 중복 체크
      const errorMessage = err instanceof Error ? err.message : String(err)
      if (errorMessage.includes('User already registered') ||
          errorMessage.includes('already registered') ||
          errorMessage.includes('Email address already in use')) {
        console.log('🌍 Using translation key: onboarding.signUp.errors.emailAlreadyExists')
        setLoading(false)
        return {
          success: false,
          error: t('onboarding.signUp.errors.emailAlreadyExists')
        }
      }

      console.log('🌍 Using fixed translation key: onboarding.signUp.errors.signUpFailed')
      setLoading(false)
      return {
        success: false,
        error: t('onboarding.signUp.errors.signUpFailed')
      }
    }
  }

  const signOut = async (): Promise<AuthResult> => {
    console.log('🚪 AuthProvider signOut called')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('❌ SignOut error:', error.message)
        console.log('🌍 Using fixed translation key: onboarding.login.errors.loginFailed')
        setLoading(false)
        return {
          success: false,
          error: t('onboarding.login.errors.loginFailed')
        }
      }

      console.log('✅ SignOut successful')
      setLoading(false)
      return {
        success: true
      }
    } catch (err) {
      console.error('💥 SignOut exception:', err)
      console.log('🌍 Using fixed translation key: onboarding.login.errors.loginFailed')
      setLoading(false)
      return {
        success: false,
        error: t('onboarding.login.errors.loginFailed')
      }
    }
  }

  const signInWithGoogle = async (): Promise<AuthResult> => {
    console.log('🔑 AuthProvider signInWithGoogle called')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('❌ Google login error:', error.message)
        console.log('🌍 Using fixed translation key: onboarding.login.errors.googleLoginError')
        setLoading(false)
        return {
          success: false,
          error: t('onboarding.login.errors.googleLoginError')
        }
      }

      console.log('✅ Google login initiated successfully')
      setLoading(false)
      return {
        success: true
      }
    } catch (err) {
      console.error('💥 Google login exception:', err)
      console.log('🌍 Using fixed translation key: onboarding.login.errors.googleLoginError')
      setLoading(false)
      return {
        success: false,
        error: t('onboarding.login.errors.googleLoginError')
      }
    }
  }

  const signInWithFacebook = async (): Promise<AuthResult> => {
    console.log('🔑 AuthProvider signInWithFacebook called')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('❌ Facebook login error:', error.message)
        console.log('🌍 Using fixed translation key: onboarding.login.errors.facebookLoginError')
        setLoading(false)
        return {
          success: false,
          error: t('onboarding.login.errors.facebookLoginError')
        }
      }

      console.log('✅ Facebook login initiated successfully')
      setLoading(false)
      return {
        success: true
      }
    } catch (err) {
      console.error('💥 Facebook login exception:', err)
      console.log('🌍 Using fixed translation key: onboarding.login.errors.facebookLoginError')
      setLoading(false)
      return {
        success: false,
        error: t('onboarding.login.errors.facebookLoginError')
      }
    }
  }

  const signInWithApple = async (): Promise<AuthResult> => {
    console.log('🔑 AuthProvider signInWithApple called')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('❌ Apple login error:', error.message)
        console.log('🌍 Using fixed translation key: onboarding.login.errors.appleLoginError')
        setLoading(false)
        return {
          success: false,
          error: t('onboarding.login.errors.appleLoginError')
        }
      }

      console.log('✅ Apple login initiated successfully')
      setLoading(false)
      return {
        success: true
      }
    } catch (err) {
      console.error('💥 Apple login exception:', err)
      console.log('🌍 Using fixed translation key: onboarding.login.errors.appleLoginError')
      setLoading(false)
      return {
        success: false,
        error: t('onboarding.login.errors.appleLoginError')
      }
    }
  }

  const resetPassword = async (email: string): Promise<AuthResult> => {
    console.log('🔑 AuthProvider resetPassword called:', { email })

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        console.error('❌ Reset password error:', error.message)
        console.log('🌍 Using fixed translation key: onboarding.forgotPassword.errors.resetFailed')
        return {
          success: false,
          error: t('onboarding.forgotPassword.errors.resetFailed')
        }
      }

      console.log('✅ Reset password email sent successfully')
      return {
        success: true
      }
    } catch (err) {
      console.error('💥 Reset password exception:', err)
      console.log('🌍 Using fixed translation key: onboarding.forgotPassword.errors.resetError')
      return {
        success: false,
        error: t('onboarding.forgotPassword.errors.resetError')
      }
    }
  }

  const updateProfile = async (updates: Partial<Profile>): Promise<AuthResult> => {
    console.log('🔑 AuthProvider updateProfile called:', updates)

    if (!user) {
      console.error('❌ No user found for profile update')
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('❌ Profile update error:', error.message)
        return {
          success: false,
          error: 'Failed to update profile'
        }
      }

      console.log('✅ Profile updated successfully:', data)
      setProfile(data)
      return {
        success: true
      }
    } catch (err) {
      console.error('💥 Profile update exception:', err)
      return {
        success: false,
        error: 'Failed to update profile'
      }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    resetPassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
})