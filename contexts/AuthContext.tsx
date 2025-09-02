'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { createClient } from '../utils/supabase/client'
import { Profile } from '../utils/supabase/types'

// Types
export interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signInWithFacebook: () => Promise<{ success: boolean; error?: string }>
  signInWithApple: () => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
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
  
  const supabase = createClient()

  // Get user profile from database
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error fetching profile:', err)
      return null
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
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (session?.user) {
          setUser(session.user)
          const userProfile = await fetchProfile(session.user.id)
          setProfile(userProfile)
        } else {
          setUser(null)
          setProfile(null)
        }
        
        setLoading(false)
        setError(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) {
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
        const userProfile = await fetchProfile(data.user.id)
        setProfile(userProfile)
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

  // Google 소셜 로그인 함수
  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        let errorMessage = 'Google 로그인에 실패했습니다.'
        
        switch (error.message) {
          case 'Provider not enabled':
            errorMessage = 'Google 로그인이 비활성화되어 있습니다.'
            break
          case 'Network error':
            errorMessage = '네트워크 오류가 발생했습니다.'
            break
          default:
            errorMessage = error.message || 'Google 로그인에 실패했습니다.'
        }
        
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (err) {
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
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}