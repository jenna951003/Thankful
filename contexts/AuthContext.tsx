'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/client'
import { Profile } from '../utils/supabase/types'
import { retryAsync, isNetworkError, isRetryableSupabaseError } from '../utils/retry'
import { getOnboardingData, clearOnboardingData, completeOnboarding as setOnboardingComplete } from '../utils/onboarding'

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
  const [loading, setLoading] = useState(false) // 임시로 false로 시작
  const [error, setError] = useState<string | null>(null)
  
  // 중복 처리 방지를 위한 상태 추가
  const [processingUserId, setProcessingUserId] = useState<string | null>(null)
  const [isAuthStateChanging, setIsAuthStateChanging] = useState(false)
  
  const supabase = createClient()

  console.log('🚨 IMMEDIATE: AuthProvider rendered with loading:', loading)

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
          avatarUrl: data.avatar_url,
          fullName: data.full_name,
          onboardingCompleted: data.onboarding_completed,
          subscriptionTier: data.subscription_tier
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

  // OAuth 사용자를 위한 프로필 생성/확인 (Account Linking 지원)
  const ensureProfileExists = async (user: User): Promise<Profile | null> => {
    // 중복 처리 방지
    if (processingUserId === user.id) {
      console.log('🚫 Profile creation already in progress for user:', user.id)
      return null
    }
    
    setProcessingUserId(user.id)
    
    try {
      console.log('🔍 Ensuring profile exists for user:', user.id)
      
      // 1단계: 기존 프로필 확인 (UUID 기준)
      let profile = await fetchProfile(user.id)
      
      if (profile) {
        console.log('✅ Profile already exists')
        return profile
      }
      
      // 2단계: Account Linking - 이메일로 기존 계정 검색
      const email = user.email?.toLowerCase().trim()
      if (email) {
        console.log('🔗 Checking for existing account with email:', email)
        
        try {
          const { data: existingProfiles, error: searchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .limit(1)
          
          if (!searchError && existingProfiles && existingProfiles.length > 0) {
            const existingProfile = existingProfiles[0]
            const oldUserId = existingProfile.id
            console.log('🎯 Found existing account with same email, linking accounts...', { oldUserId, newUserId: user.id })
            
            try {
              // 트랜잭션으로 모든 테이블 업데이트
              console.log('🔄 Updating all related tables...')
              
              // 1. 프로필 테이블 업데이트
              const { data: linkedProfile, error: profileUpdateError } = await supabase
                .from('profiles')
                .update({
                  id: user.id, // 새로운 OAuth user ID로 업데이트
                  updated_at: new Date().toISOString(),
                  // OAuth에서 가져온 추가 정보로 보강 (기존 정보 우선)
                  avatar_url: existingProfile.avatar_url || user.user_metadata?.picture || user.user_metadata?.avatar_url || null,
                  full_name: existingProfile.full_name || user.user_metadata?.full_name || user.user_metadata?.name || null
                })
                .eq('id', oldUserId)
                .select()
                .single()
              
              if (profileUpdateError) {
                throw new Error(`Profile update failed: ${profileUpdateError.message}`)
              }
              
              // 2. user_settings 테이블 업데이트
              const { error: settingsUpdateError } = await supabase
                .from('user_settings')
                .update({ user_id: user.id })
                .eq('user_id', oldUserId)
              
              if (settingsUpdateError) {
                console.warn('⚠️ User settings update failed:', settingsUpdateError)
              }
              
              // 3. streaks 테이블 업데이트
              const { error: streaksUpdateError } = await supabase
                .from('streaks')
                .update({ user_id: user.id })
                .eq('user_id', oldUserId)
              
              if (streaksUpdateError) {
                console.warn('⚠️ Streaks update failed:', streaksUpdateError)
              }
              
              // 4. notes 테이블 업데이트
              const { error: notesUpdateError } = await supabase
                .from('notes')
                .update({ user_id: user.id })
                .eq('user_id', oldUserId)
              
              if (notesUpdateError) {
                console.warn('⚠️ Notes update failed:', notesUpdateError)
              }
              
              console.log('✅ Successfully linked OAuth account to existing profile and migrated all data')
              return linkedProfile as Profile
              
            } catch (linkingError) {
              console.error('❌ Account linking failed:', linkingError)
              // 연동 실패 시 기존 방식으로 새 계정 생성
            }
          }
        } catch (linkingError) {
          console.warn('⚠️ Account linking failed, proceeding with new profile:', linkingError)
        }
      }
      
      // 3단계: 새 프로필 생성 (기존 계정이 없거나 연동 실패 시)
      console.log('⚠️ No existing account found, creating new profile...')
      
      // 사용자 메타데이터에서 정보 추출
      const metadata = user.user_metadata || {}
      
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

  // 초기 세션 및 프로필 로드
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🚀 AuthProvider 초기화 시작...')
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          console.log('📋 초기 세션 발견:', session.user.email)
          setUser(session.user)

          // 초기 세션이 있으면 프로필도 로드
          try {
            const userProfile = await ensureProfileExists(session.user)
            console.log('📝 초기 프로필 로드 결과:', userProfile ? 'SUCCESS' : 'FALLBACK')
            setProfile(userProfile)
          } catch (profileError) {
            console.error('❌ 초기 프로필 로드 실패:', profileError)
            setProfile(null)
          }
        } else {
          console.log('📭 초기 세션 없음')
        }
      } catch (err) {
        console.error('💥 Auth 초기화 오류:', err)
      }
    }

    initAuth()
  }, [supabase])

  // Listen for auth changes (별도 useEffect)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // 중복 처리 방지
        if (isAuthStateChanging) {
          console.log('🚫 Auth state change already in progress, skipping...')
          return
        }
        
        setIsAuthStateChanging(true)
        let authTimeout: NodeJS.Timeout
        
        try {
          console.log('🔐 Auth state changed:', event, {
            userId: session?.user?.id,
            email: session?.user?.email,
            provider: session?.user?.app_metadata?.provider,
            metadata: session?.user?.user_metadata
          })
          
          // 최대 15초 후 강제로 처리 완료 (안전장치)
          authTimeout = setTimeout(() => {
            console.log('⚠️ Auth state change timeout - forcing completion')
            setLoading(false)
            setIsAuthStateChanging(false)
          }, 15000)
          
          if (session?.user) {
            setUser(session.user)

            // 모든 세션(신규 로그인 및 기존 세션 복원)에 대해 프로필 로드
            console.log(`🔑 User session active (${event}), loading profile...`)
            try {
              const userProfile = await ensureProfileExists(session.user)
              console.log('📝 Profile result:', userProfile ? 'SUCCESS' : 'FALLBACK')
              setProfile(userProfile)
            } catch (profileError) {
              console.error('❌ Profile load failed:', profileError)
              setProfile(null)
            }
          } else {
            console.log('🚪 User signed out')
            setUser(null)
            setProfile(null)
          }
          
          console.log('✅ Auth state change completed - setting loading to false')
          setLoading(false)
          setError(null)
        } catch (err) {
          console.error('💥 Error in auth state change handler:', err)
          setError('인증 상태 처리 중 오류가 발생했습니다.')
          setLoading(false)
        } finally {
          console.log('🔚 Auth state change handler finished')
          setIsAuthStateChanging(false)
          if (authTimeout) clearTimeout(authTimeout)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    let signInTimeout: NodeJS.Timeout
    
    try {
      console.log('🔐 Starting sign in process for:', email)
      setLoading(true)
      setError(null)

      // 최대 20초 후 강제로 로딩 해제 (안전장치)
      signInTimeout = setTimeout(() => {
        console.log('⚠️ Sign in timeout - forcing loading to false')
        setLoading(false)
      }, 20000)

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
        clearTimeout(signInTimeout)
        setLoading(false)
        return { success: false, error: errorMessage }
      }

      if (data.user) {
        console.log('👤 User authenticated, fetching profile...')
        
        // 프로필 로딩에 타임아웃 추가
        const profilePromise = fetchProfile(data.user.id)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile loading timeout')), 8000)
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
      console.log('🔐 Sign in process completed - setting loading to false')
      if (signInTimeout) clearTimeout(signInTimeout)
      setLoading(false)
    }
  }

  // Google 소셜 로그인 함수
  const signInWithGoogle = async () => {
    let googleTimeout: NodeJS.Timeout
    
    try {
      setLoading(true)
      setError(null)

      // 최대 15초 후 강제로 로딩 해제 (소셜 로그인용)
      googleTimeout = setTimeout(() => {
        console.log('⚠️ Google OAuth timeout - forcing loading to false')
        setLoading(false)
      }, 15000)

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
        clearTimeout(googleTimeout)
        setLoading(false)
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (err) {
      console.error('Google OAuth exception:', err)
      const errorMessage = 'Google 로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      console.log('Google OAuth completed - setting loading to false')
      if (googleTimeout) clearTimeout(googleTimeout)
      setLoading(false)
    }
  }

  // Facebook 소셜 로그인 함수
  const signInWithFacebook = async () => {
    let facebookTimeout: NodeJS.Timeout
    
    try {
      setLoading(true)
      setError(null)

      facebookTimeout = setTimeout(() => {
        console.log('⚠️ Facebook OAuth timeout - forcing loading to false')
        setLoading(false)
      }, 15000)

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
        clearTimeout(facebookTimeout)
        setLoading(false)
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = 'Facebook 로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      console.log('Facebook OAuth completed - setting loading to false')
      if (facebookTimeout) clearTimeout(facebookTimeout)
      setLoading(false)
    }
  }

  // Apple 소셜 로그인 함수
  const signInWithApple = async () => {
    let appleTimeout: NodeJS.Timeout
    
    try {
      setLoading(true)
      setError(null)

      appleTimeout = setTimeout(() => {
        console.log('⚠️ Apple OAuth timeout - forcing loading to false')
        setLoading(false)
      }, 15000)

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
        clearTimeout(appleTimeout)
        setLoading(false)
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (err) {
      const errorMessage = 'Apple 로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      console.log('Apple OAuth completed - setting loading to false')
      if (appleTimeout) clearTimeout(appleTimeout)
      setLoading(false)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, fullName: string) => {
    let signUpTimeout: NodeJS.Timeout
    
    try {
      setLoading(true)
      setError(null)

      // 최대 20초 후 강제로 로딩 해제 (회원가입용)
      signUpTimeout = setTimeout(() => {
        console.log('⚠️ Sign up timeout - forcing loading to false')
        setLoading(false)
      }, 20000)

      // Validate inputs
      if (!email || !password || !fullName) {
        const errorMessage = '모든 필드를 입력해주세요.'
        setError(errorMessage)
        clearTimeout(signUpTimeout)
        setLoading(false)
        return { success: false, error: errorMessage }
      }

      if (password.length < 6) {
        const errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.'
        setError(errorMessage)
        clearTimeout(signUpTimeout)
        setLoading(false)
        return { success: false, error: errorMessage }
      }

      // 로컬스토리지에서 온보딩 데이터 확인
      const onboardingData = getOnboardingData()
      let userData: any = {
        full_name: fullName.trim(),
        display_name: fullName.trim()
      }
      
      // 온보딩 데이터가 있으면 회원가입 완료 상태로 설정
      if (onboardingData) {
        console.log('📦 Found onboarding data, will mark as completed after signup')
        // onboarding_data는 user metadata에 저장하지 않음 (DB 스키마에 없음)
        // 대신 회원가입 후 onboarding_completed만 true로 설정
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: userData
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
        clearTimeout(signUpTimeout)
        setLoading(false)
        return { success: false, error: errorMessage }
      }

      // For immediate signup without email confirmation
      if (data.user && data.session) {
        // 온보딩 완료 처리
        if (onboardingData) {
          try {
            // 온보딩 완료 상태만 업데이트 (onboarding_data 필드는 profiles 테이블에 없음)
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ onboarding_completed: true })
              .eq('id', data.user.id)
            
            if (updateError) {
              console.error('❌ Failed to update onboarding status:', updateError)
            } else {
              console.log('✅ Onboarding completed status updated')
            }
            
            // 로컬스토리지 정리
            clearOnboardingData()
            setOnboardingComplete()
            console.log('🎉 Onboarding data cleared from localStorage')
          } catch (err) {
            console.error('❌ Error updating onboarding status:', err)
          }
        }
        
        const userProfile = await fetchProfile(data.user.id)
        setProfile(userProfile)
        return { success: true }
      }

      // 이메일 인증이 필요한 경우에도 로컬스토리지 정리
      if (data.user && onboardingData) {
        clearOnboardingData()
        setOnboardingComplete()
        console.log('🎉 Onboarding data will be synced after email confirmation')
      }

      return { success: true }
    } catch (err) {
      const errorMessage = '네트워크 오류가 발생했습니다.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      console.log('🔐 Sign up process completed - setting loading to false')
      if (signUpTimeout) clearTimeout(signUpTimeout)
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

      console.log('🔄 Sending password reset email to:', email)

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        console.error('❌ Reset password error:', error)
        let errorMessage = '비밀번호 재설정에 실패했습니다.'
        
        switch (error.message) {
          case 'Invalid email':
          case 'Invalid email address':
            errorMessage = '올바른 이메일 형식이 아닙니다.'
            break
          case 'Unable to validate email address: invalid format':
            errorMessage = '이메일 형식이 올바르지 않습니다.'
            break
          case 'For security purposes, you can only request this once every 60 seconds':
            errorMessage = '보안상 60초마다 한 번씩만 요청할 수 있습니다.'
            break
          case 'Email not confirmed':
            errorMessage = '이메일 인증이 완료되지 않은 계정입니다.'
            break
          case 'User not found':
          case 'Email address not found':
            errorMessage = '등록되지 않은 이메일입니다. 가입된 이메일을 확인해주세요.'
            break
          case 'Too many requests':
            errorMessage = '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.'
            break
          default:
            // Supabase는 존재하지 않는 이메일에 대해서도 성공을 반환하는 경우가 있음
            // 하지만 일부 에러 케이스에서는 구체적인 메시지를 제공
            if (error.message.toLowerCase().includes('not found') || 
                error.message.toLowerCase().includes('not exist')) {
              errorMessage = '등록되지 않은 이메일입니다. 가입된 이메일을 확인해주세요.'
            } else {
              errorMessage = error.message || '비밀번호 재설정에 실패했습니다.'
            }
        }
        
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      console.log('✅ Password reset email sent successfully')
      return { success: true }
    } catch (err) {
      console.error('❌ Reset password exception:', err)
      const errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
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