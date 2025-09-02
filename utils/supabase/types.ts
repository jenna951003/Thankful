export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          display_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'premium' | 'church'
          subscription_expires_at: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'premium' | 'church'
          subscription_expires_at?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'premium' | 'church'
          subscription_expires_at?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          language: string
          theme: 'light' | 'dark' | 'auto'
          daily_reminder_enabled: boolean
          daily_reminder_time: string
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language?: string
          theme?: 'light' | 'dark' | 'auto'
          daily_reminder_enabled?: boolean
          daily_reminder_time?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          theme?: 'light' | 'dark' | 'auto'
          daily_reminder_enabled?: boolean
          daily_reminder_time?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          type: 'gratitude' | 'sermon' | 'prayer'
          title: string
          content: string
          tags: string[]
          is_favorite: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'gratitude' | 'sermon' | 'prayer'
          title: string
          content: string
          tags?: string[]
          is_favorite?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'gratitude' | 'sermon' | 'prayer'
          title?: string
          content?: string
          tags?: string[]
          is_favorite?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          note_type: 'gratitude' | 'sermon' | 'prayer'
          current_streak: number
          longest_streak: number
          last_recorded_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          note_type: 'gratitude' | 'sermon' | 'prayer'
          current_streak?: number
          longest_streak?: number
          last_recorded_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          note_type?: 'gratitude' | 'sermon' | 'prayer'
          current_streak?: number
          longest_streak?: number
          last_recorded_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      note_type: 'gratitude' | 'sermon' | 'prayer'
      prayer_category: 'healing' | 'family' | 'work' | 'spiritual' | 'world'
      subscription_tier: 'free' | 'premium' | 'church'
      theme_type: 'light' | 'dark' | 'auto'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
    ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
    ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
    ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"])
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicEnumNameOrOptions["schema"]]["Enums"])[EnumName]
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"])
    ? (Database["public"]["Enums"])[PublicEnumNameOrOptions]
    : never

// Convenience types
export type Profile = Tables<'profiles'>
export type UserSettings = Tables<'user_settings'>
export type Note = Tables<'notes'>
export type Streak = Tables<'streaks'>

export type ProfileInsert = TablesInsert<'profiles'>
export type UserSettingsInsert = TablesInsert<'user_settings'>
export type NoteInsert = TablesInsert<'notes'>
export type StreakInsert = TablesInsert<'streaks'>

export type ProfileUpdate = TablesUpdate<'profiles'>
export type UserSettingsUpdate = TablesUpdate<'user_settings'>
export type NoteUpdate = TablesUpdate<'notes'>
export type StreakUpdate = TablesUpdate<'streaks'>