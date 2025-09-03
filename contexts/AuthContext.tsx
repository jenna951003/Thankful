'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/client'
import { Profile } from '../utils/supabase/types'
import { retryAsync, isNetworkError, isRetryableSupabaseError } from '../utils/retry'

// Types
export interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; shouldRedirectToOnboarding?: boolean }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; shouldRedirectToOnboarding?: boolean }>
  signInWithFacebook: () => Promise<{ success: boolean; error?: string; shouldRedirectToOnboarding?: boolean }>
  signInWithApple: () => Promise<{ success: boolean; error?: string; shouldRedirectToOnboarding?: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
  completeOnboarding: () => Promise<{ success: boolean; error?: string }>
  checkOnboardingStatus: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 중복 처리 방지를 위한 상태 추가
  const [processingUserId, setProcessingUserId] = useState<string | null>(null)
  const [isAuthStateChanging, setIsAuthStateChanging] = useState(false)
  
  const supabase = createClient()

  // 간단한 백그라운드 프로필 동기화 (재시도 1회만)
  const backgroundProfileSync = async (user: User): Promise<void> => {
    console.log(`🔄 Starting simple background sync for user ${user.id}`)

    try {
      // 3초 대기 후 프로필 fetch 시도
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const profile = await fetchProfile(user.id)
      
      if (profile && profile.id) {
        console.log('✅ Background sync successful!')
        setProfile(profile)
      } else {
        console.log('⚠️ Background sync failed - profile not found')
      }
      
    } catch (err) {
      console.warn('⚠️ Background sync failed:', err)
    }
  }

  // Get user profile from database with retry logic
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    const startTime = Date.now()
    console.log('🔍 fetchProfile started for userId:', userId)
    
    try {
      // 재시도 가능한 프로필 조회 함수
      const profileFetcher = async (): Promise<Profile | null> => {
        // Supabase 연결 상태 체크
        const { data: { session } } = await supabase.auth.getSession()
        console.log('🔐 Current session exists:', !!session)
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()
        
        if (error) {
          console.error('💥 Error fetching profile:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          
          // 재시도 가능한 오류인지 확인
          if (isRetryableSupabaseError(error) || isNetworkError(error)) {
            console.log('🔄 Retryable error detected, will retry...')
            throw error // 재시도를 위해 에러를 던짐
          } else {
            console.log('❌ Non-retryable error, returning null')
            return null
          }
        }

        if (!data) {
          console.warn('⚠️ No profile found for user:', userId)
          return null
        }

        console.log('✅ Profile fetch successful:', {
          id: data.id,
          email: data.email,
          displayName: data.display_name,
          onboardingCompleted: data.onboarding_completed
        })
        return data
      }

      // 재시도 로직으로 프로필 조회 (최대 3회, 1초 간격으로 지수 백오프)
      const profile = await retryAsync(profileFetcher, 3, 1000)
      
      const duration = Date.now() - startTime
      console.log('📤 Profile fetch completed:', { 
        hasData: !!profile,
        duration: `${duration}ms`
      })
      
      return profile
    } catch (err) {
      const duration = Date.now() - startTime
      
      // 네트워크 오류인지 확인
      if (isNetworkError(err) || isRetryableSupabaseError(err)) {
        console.error('🌐 Network/retryable error in fetchProfile:', {
          error: err instanceof Error ? err.message : 'Unknown error',
          duration: `${duration}ms`,
          userId
        })
      } else {
        console.error('💥 Non-retryable exception in fetchProfile:', {
          error: err instanceof Error ? err.message : 'Unknown error',
          duration: `${duration}ms`,
          userId
        })
      }
      
      return null
    }
  }

  // OAuth 사용자를 위한 프로필 생성/확인 (단순화된 버전)
  const ensureProfileExists = async (user: User): Promise<Profile | null> => {
    // 중복 처리 방지
    if (processingUserId === user.id) {
      console.log('🚫 Profile creation already in progress for user:', user.id)
      return null
    }
    
    setProcessingUserId(user.id)
    
    try {
      console.log('🔍 Ensuring profile exists for user:', user.id)
      
      // 기존 프로필 확인
      let profile = await fetchProfile(user.id)
      
      if (profile) {
        console.log('✅ Profile already exists')
        return profile
      }
      
      // 프로필이 없으면 새로 생성
      console.log('⚠️ No profile found, creating new one...')
      
      // 사용자 메타데이터에서 정보 추출
      const metadata = user.user_metadata || {}
      const email = user.email || ''
      
      const fullName = metadata.full_name || 
                       metadata.name || 
                       `${metadata.given_name || ''} ${metadata.family_name || ''}`.trim() ||
                       null
      
      const displayName = metadata.display_name || 
                         fullName || 
                         metadata.preferred_username ||
                         email.split('@')[0] || 
                         '익명 사용자'
      
      const avatarUrl = metadata.avatar_url || 
                       metadata.picture || 
                       metadata.photo_url || 
                       null
      
      const profileData = {
        id: user.id,
        email: email,
        full_name: fullName,
        display_name: displayName,
        avatar_url: avatarUrl
      }
      
      console.log('📋 Creating profile with data:', profileData)
      
      // 프로필 생성
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .maybeSingle()
      
      if (createError) {
        console.error('💥 Error creating profile:', createError.code, createError.message)
        
        // 중복 키 오류인 경우 기존 프로필 다시 검색
        if (createError.code === '23505') {
          profile = await fetchProfile(user.id)
          if (profile) {
            console.log('✅ Found existing profile after conflict')
            return profile
          }
        }
        
        // 실패 시 임시 프로필 반환 및 백그라운드 동기화
        const tempProfile = {
          id: user.id,
          email: email,
          full_name: fullName,
          display_name: displayName,
          avatar_url: avatarUrl,
          subscription_tier: 'free' as const,
          subscription_expires_at: null,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Profile
        
        // 백그라운드에서 다시 시도
        backgroundProfileSync(user).catch(err => 
          console.warn('Background sync failed:', err)
        )
        
        return tempProfile
      }
      
      console.log('🎉 Profile created successfully')
      
      // 사용자 설정 생성
      try {
        await supabase
          .from('user_settings')
          .insert({ user_id: user.id })
      } catch (err) {
        console.log('⚠️ Settings creation failed:', err)
      }
      
      // 스트릭 초기화
      const streakTypes = ['gratitude', 'sermon', 'prayer'] as const
      for (const noteType of streakTypes) {
        try {
          await supabase
            .from('streaks')
            .insert({ user_id: user.id, note_type: noteType })
        } catch (err) {
          console.log(`⚠️ Streak ${noteType} creation failed:`, err)
        }
      }
      
      return newProfile
    } catch (err) {
      console.error('💥 Unexpected error in ensureProfileExists:', err)
      
      // 오류 시 임시 프로필 반환
      const tempProfile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.name || user.user_metadata?.full_name || null,
        display_name: user.user_metadata?.name || user.email?.split('@')[0] || '익명 사용자',
        avatar_url: user.user_metadata?.picture || user.user_metadata?.avatar_url || null,
        subscription_tier: 'free' as const,
        subscription_expires_at: null,
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Profile
      
      // 백그라운드에서 다시 시도
      backgroundProfileSync(user).catch(syncErr => 
        console.warn('Background sync failed:', syncErr)
      )
      
      return tempProfile
    } finally {
      setProcessingUserId(null)
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          const userProfile = await fetchProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        setError('인증 초기화 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // 중복 처리 방지
        if (isAuthStateChanging) {
          console.log('🚫 Auth state change already in progress, skipping...')
          return
        }
        
        setIsAuthStateChanging(true)
        
        try {
          console.log('🔐 Auth state changed:', event, {
            userId: session?.user?.id,
            email: session?.user?.email,
            provider: session?.user?.app_metadata?.provider,
            metadata: session?.user?.user_metadata
          })
          
          if (session?.user) {
            setUser(session.user)
            
            // 모든 로그인(이메일/OAuth)에 대해 프로필 생성/확인 시도
            if (event === 'SIGNED_IN') {
              console.log('🔑 User signed in, ensuring profile exists...')
              const userProfile = await ensureProfileExists(session.user)
              console.log('📝 Profile result:', userProfile ? 'SUCCESS' : 'FALLBACK')
              setProfile(userProfile)
            } else {
              // 기존 세션인 경우 프로필 가져오기
              console.log('🔄 Existing session, fetching profile...')
              const userProfile = await fetchProfile(session.user.id)
              setProfile(userProfile)
            }
          } else {
            console.log('🚪 User signed out')
            setUser(null)
            setProfile(null)
          }
          
          setLoading(false)
          setError(null)
        } catch (err) {
          console.error('💥 Error in auth state change handler:', err)
          setError('인증 상태 처리 중 오류가 발생했습니다.')
        } finally {
          setIsAuthStateChanging(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting sign in process for:', email)
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      console.log('🔐 Auth response:', { success: !error, userId: data.user?.id })

      if (error) {
        console.error('❌ Auth error:', error)
        let errorMessage = '로그인에 실패했습니다.'
        
        switch (error.message) {
          case 'Invalid login credentials':
            errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
            break
          case 'Email not confirmed':
            errorMessage = '이메일 인증이 필요합니다.'
            break
          case 'Too many requests':
            errorMessage = '너무 많은 시도입니다. 잠시 후 다시 시도해주세요.'
            break
          default:
            errorMessage = error.message || '로그인에 실패했습니다.'
        }
        
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      if (data.user) {
        console.log('👤 User authenticated, fetching profile...')
        
        // 프로필 로딩에 타임아웃 추가
        const profilePromise = fetchProfile(data.user.id)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile loading timeout')), 10000)
        )
        
        let userProfile: any = null
        try {
          userProfile = await Promise.race([profilePromise, timeoutPromise])
          console.log('📋 Profile loaded:', !!userProfile)
        } catch (profileError) {
          console.error('⚠️ Profile loading failed:', profileError)
          // 프로필 로딩 실패 시에도 로그인을 성공으로 처리
          userProfile = null
        }
        
        setProfile(userProfile)
        
        // 온보딩 완료 여부 체크
        const shouldRedirectToOnboarding = !userProfile?.onboarding_completed
        console.log('🎯 Redirect to onboarding:', shouldRedirectToOnboarding)
        
        return { success: true, shouldRedirectToOnboarding }
      }

      return { success: true }
    } catch (err) {
      console.error('💥 Sign in error:', err)
      const errorMessage = err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      console.log('🔐 Sign in process completed')
      setLoading(false)
    }
  }

  // Google 소셜 로그인 함수
  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Starting Google OAuth...')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      })

      console.log('OAuth response:', { data, error })

      if (error) {
        let errorMessage = 'Google 로그인에 실패했습니다.'
        
        switch (error.message) {
          case 'Provider not enabled':
            errorMessage = 'Google 로그인이 비활성화되어 있습니다.'
            break
          case 'Network error':
            errorMessage = '네트워크 오류가 발생했습니다.'
            break
          case 'Flow state not found':
            errorMessage = '로그인 세션이 만료되었습니다. 다시 시도해주세요.'
            break
          default:
            errorMessage = error.message || 'Google 로그인에 실패했습니다.'
        }
        
        console.error('Google OAuth error:', error)
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (err) {
      console.error('Google OAuth exception:', err)
      const errorMessage = 'Google 로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Facebook 소셜 로그인 함수
  const signInWithFacebook = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        let errorMessage = 'Facebook 로그인에 실패했습니다.'
        
        switch (error.message) {
          case 'Provider not enabled':
            errorMessage = 'Facebook 로그인이 비활성화되어 있습니다.'
            break
          case 'Network error':
            errorMessage = '네트워크 오류가 발생했습니다.'
            break
          default:
            errorMessage = error.message || 'Facebook 로그인에 실패했습니다.'
        }
        
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = 'Facebook 로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Apple 소셜 로그인 함수
  const signInWithApple = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        let errorMessage = 'Apple 로그인에 실패했습니다.'
        
        switch (error.message) {
          case 'Provider not enabled':
            errorMessage = 'Apple 로그인이 비활성화되어 있습니다.'
            break
          case 'Network error':
            errorMessage = '네트워크 오류가 발생했습니다.'
            break
          default:
            errorMessage = error.message || 'Apple 로그인에 실패했습니다.'
        }
        
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = 'Apple 로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      setError(null)

      // Validate inputs
      if (!email || !password || !fullName) {
        const errorMessage = '모든 필드를 입력해주세요.'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      if (password.length < 6) {
        const errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            display_name: fullName.trim()
          }
        }
      })

      if (error) {
        let errorMessage = '회원가입에 실패했습니다.'
        
        switch (error.message) {
          case 'User already registered':
            errorMessage = '이미 가입된 이메일입니다.'
            break
          case 'Password should be at least 6 characters':
            errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.'
            break
          case 'Invalid email':
            errorMessage = '올바른 이메일 형식이 아닙니다.'
            break
          default:
            errorMessage = error.message || '회원가입에 실패했습니다.'
        }
        
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      // For immediate signup without email confirmation
      if (data.user && data.session) {
        const userProfile = await fetchProfile(data.user.id)
        setProfile(userProfile)
        return { success: true }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = '네트워크 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setError(null)
    } catch (err) {
      console.error('Error signing out:', err)
      setError('로그아웃 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        let errorMessage = '비밀번호 재설정에 실패했습니다.'
        
        switch (error.message) {
          case 'Invalid email':
            errorMessage = '올바른 이메일 형식이 아닙니다.'
            break
          default:
            errorMessage = error.message || '비밀번호 재설정에 실패했습니다.'
        }
        
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = '네트워크 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Update profile function
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        const errorMessage = '프로필 업데이트에 실패했습니다.'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      setProfile(data)
      return { success: true }
    } catch (err) {
      const errorMessage = '네트워크 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Refresh profile function
  const refreshProfile = async () => {
    if (!user) return

    try {
      const userProfile = await fetchProfile(user.id)
      setProfile(userProfile)
    } catch (err) {
      console.error('Error refreshing profile:', err)
    }
  }

  // Complete onboarding function
  const completeOnboarding = async () => {
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        const errorMessage = '온보딩 완료 처리에 실패했습니다.'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      setProfile(data)
      return { success: true }
    } catch (err) {
      const errorMessage = '네트워크 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Check onboarding status
  const checkOnboardingStatus = () => {
    return profile?.onboarding_completed || false
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
    completeOnboarding,
    checkOnboardingStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}