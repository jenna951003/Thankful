'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '../utils/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import { Profile } from '../utils/supabase/types'

// Supabase 클라이언트를 컴포넌트 외부에서 한 번만 생성
const supabase = createClient()

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // 프로필 데이터 fetch 함수 (useCallback으로 메모이제이션)
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    console.log('🔍 AuthProvider fetchProfile started for userId:', userId)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('💥 Profile fetch error:', error)
        return null
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
        fullName: data.full_name
      })
      return data
    } catch (err) {
      console.error('💥 Profile fetch exception:', err)
      return null
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    // Get initial session and profile
    const getInitialSession = async () => {
      try {
        console.log('🚀 AuthProvider 초기화 시작...')
        const { data: { session } } = await supabase.auth.getSession()

        if (!isMounted) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          console.log('📋 초기 세션 발견:', session.user.email)
          // 프로필 로드
          try {
            const userProfile = await fetchProfile(session.user.id)
            if (isMounted) {
              console.log('📝 초기 프로필 로드 결과:', userProfile ? 'SUCCESS' : 'FAILED')
              setProfile(userProfile)
            }
          } catch (error) {
            console.error('❌ 초기 프로필 로드 에러:', error)
            if (isMounted) setProfile(null)
          }
        } else {
          console.log('📭 초기 세션 없음')
          setProfile(null)
        }

        // 초기화 완료
        if (isMounted) {
          console.log('✅ AuthProvider 초기화 완료')
          setLoading(false)
        }
      } catch (error) {
        console.error('💥 AuthProvider 초기화 에러:', error)
        if (isMounted) {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        console.log(`🔑 Auth event: ${event}`, session?.user?.email)

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // 프로필 로드
          try {
            const userProfile = await fetchProfile(session.user.id)
            if (isMounted) {
              console.log('📝 Profile result:', userProfile ? 'SUCCESS' : 'FAILED')
              setProfile(userProfile)
            }
          } catch (error) {
            console.error('❌ 프로필 로드 에러:', error)
            if (isMounted) setProfile(null)
          }
        } else {
          console.log('🚪 User signed out')
          setProfile(null)
        }
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await supabase.auth.signInWithPassword({
      email,
      password
    })
    setLoading(false)
    return result
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true)
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || '익명 사용자'
        }
      }
    })
    setLoading(false)
    return result
  }

  const signOut = async () => {
    setLoading(true)
    const result = await supabase.auth.signOut()
    setLoading(false)
    return result
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    setLoading(false)
    return result
  }

  const resetPassword = async (email: string) => {
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return result
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
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}