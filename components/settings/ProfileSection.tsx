'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import { useNotes } from '../../hooks/useNotes'
import { supabase } from '../../utils/supabase'

interface ProfileSectionProps {
  locale: string
}

export default function ProfileSection({ locale }: ProfileSectionProps) {
  const { user, signOut } = useAuth()
  const { notes } = useNotes()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [displayName, setDisplayName] = useState('')
  
  const [profile, setProfile] = useState({
    displayName: '익명 사용자',
    email: 'user@example.com',
    joinDate: '2024년 1월',
    totalNotes: 0,
    longestStreak: 0,
    favoriteType: 'gratitude' as 'gratitude' | 'sermon' | 'prayer'
  })

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          // Fetch user streaks for longest streak
          const { data: streaks } = await supabase
            .from('streaks')
            .select('longest_streak')
            .eq('user_id', user.id)

          const longestStreak = Math.max(...(streaks?.map(s => s.longest_streak) || [0]))

          setProfile({
            displayName: profileData?.display_name || '익명 사용자',
            email: user.email || 'user@example.com',
            joinDate: new Date(user.created_at).toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long' 
            }),
            totalNotes: notes.length,
            longestStreak,
            favoriteType: profileData?.favorite_note_type || 'gratitude'
          })

          setDisplayName(profileData?.display_name || '익명 사용자')

        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      }

      fetchProfile()
    }
  }, [user, notes])

  const handleProfileUpdate = async () => {
    if (!user || !displayName.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id)

      if (error) throw error

      setProfile(prev => ({ ...prev, displayName: displayName.trim() }))
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'gratitude': return '감사 노트'
      case 'sermon': return '설교 노트'
      case 'prayer': return '기도 노트'
      default: return '감사 노트'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gratitude': return '🙏'
      case 'sermon': return '📖'
      case 'prayer': return '🕊️'
      default: return '🙏'
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-jua text-gray-800">
          프로필 정보
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          {isEditing ? '완료' : '편집'}
        </button>
      </div>

      {/* Profile Avatar & Basic Info */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
          👤
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            className="text-lg font-bold font-jua text-gray-800 text-center bg-transparent border-b-2 border-blue-300 focus:outline-none focus:border-blue-500 mb-2"
          />
        ) : (
          <h3 className="text-lg font-bold font-jua text-gray-800 mb-2">
            {profile.displayName}
          </h3>
        )}
        
        <p className="text-sm text-gray-500 font-hubballi">
          {profile.joinDate}부터 함께하고 있습니다
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {profile.totalNotes}
            </div>
            <div className="text-xs text-green-700 font-medium">
              총 작성한 노트
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {profile.longestStreak}
            </div>
            <div className="text-xs text-orange-700 font-medium">
              최장 연속 기록
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
          계정 설정
        </h3>
        
        {/* Email */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <div className="font-medium text-gray-800 font-jua">이메일</div>
            <div className="text-sm text-gray-500 font-hubballi">{profile.email}</div>
          </div>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
            변경
          </button>
        </div>

        {/* Favorite Note Type */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <div className="font-medium text-gray-800 font-jua">선호하는 노트 유형</div>
            <div className="text-sm text-gray-500 font-hubballi flex items-center gap-1">
              <span>{getTypeIcon(profile.favoriteType)}</span>
              <span>{getTypeLabel(profile.favoriteType)}</span>
            </div>
          </div>
          {isEditing ? (
            <select
              value={profile.favoriteType}
              onChange={(e) => setProfile({ ...profile, favoriteType: e.target.value as any })}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="gratitude">감사 노트</option>
              <option value="sermon">설교 노트</option>
              <option value="prayer">기도 노트</option>
            </select>
          ) : (
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
              변경
            </button>
          )}
        </div>

        {/* Account Actions */}
        <div className="pt-4">
          <div className="space-y-3">
            <button className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors">
              프로필 사진 변경
            </button>
            
            <button className="w-full py-3 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors">
              다른 기기와 동기화
            </button>
            
            <button className="w-full py-3 bg-yellow-50 text-yellow-700 rounded-xl font-medium hover:bg-yellow-100 transition-colors">
              계정 백업하기
            </button>
            
            <button 
              onClick={handleSignOut}
              className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 pt-6 border-t border-red-100">
        <h3 className="text-lg font-semibold font-jua text-red-800 mb-4">
          위험한 작업
        </h3>
        
        <div className="space-y-3">
          <button className="w-full py-3 bg-red-50 text-red-700 rounded-xl font-medium hover:bg-red-100 transition-colors">
            모든 데이터 삭제
          </button>
          
          <button className="w-full py-3 bg-red-50 text-red-700 rounded-xl font-medium hover:bg-red-100 transition-colors">
            계정 영구 삭제
          </button>
        </div>
        
        <p className="text-xs text-red-500 mt-3 text-center font-hubballi">
          ⚠️ 이 작업들은 되돌릴 수 없습니다
        </p>
      </div>
    </div>
  )
}