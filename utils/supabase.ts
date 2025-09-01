import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          favorite_note_type: 'gratitude' | 'sermon' | 'prayer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          favorite_note_type?: 'gratitude' | 'sermon' | 'prayer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          favorite_note_type?: 'gratitude' | 'sermon' | 'prayer'
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
          canvas_data: string | null
          image_url: string | null
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
          canvas_data?: string | null
          image_url?: string | null
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
          canvas_data?: string | null
          image_url?: string | null
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
          last_recorded_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          note_type: 'gratitude' | 'sermon' | 'prayer'
          current_streak?: number
          longest_streak?: number
          last_recorded_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          note_type?: 'gratitude' | 'sermon' | 'prayer'
          current_streak?: number
          longest_streak?: number
          last_recorded_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      prayer_requests: {
        Row: {
          id: string
          user_id: string | null
          content: string
          category: 'healing' | 'family' | 'work' | 'spiritual' | 'world'
          is_urgent: boolean
          is_anonymous: boolean
          prayer_count: number
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          content: string
          category: 'healing' | 'family' | 'work' | 'spiritual' | 'world'
          is_urgent?: boolean
          is_anonymous?: boolean
          prayer_count?: number
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          content?: string
          category?: 'healing' | 'family' | 'work' | 'spiritual' | 'world'
          is_urgent?: boolean
          is_anonymous?: boolean
          prayer_count?: number
          country?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      community_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          type: 'gratitude' | 'sermon' | 'prayer'
          canvas_data: string
          preview_image: string | null
          download_count: number
          rating: number
          tags: string[]
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          type: 'gratitude' | 'sermon' | 'prayer'
          canvas_data: string
          preview_image?: string | null
          download_count?: number
          rating?: number
          tags?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          type?: 'gratitude' | 'sermon' | 'prayer'
          canvas_data?: string
          preview_image?: string | null
          download_count?: number
          rating?: number
          tags?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          daily_reminder_enabled: boolean
          daily_reminder_time: string
          prayer_times: string[]
          weekly_goals: {
            gratitude: number
            sermon: number
            prayer: number
          }
          theme: 'light' | 'dark' | 'auto'
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_reminder_enabled?: boolean
          daily_reminder_time?: string
          prayer_times?: string[]
          weekly_goals?: {
            gratitude: number
            sermon: number
            prayer: number
          }
          theme?: 'light' | 'dark' | 'auto'
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daily_reminder_enabled?: boolean
          daily_reminder_time?: string
          prayer_times?: string[]
          weekly_goals?: {
            gratitude: number
            sermon: number
            prayer: number
          }
          theme?: 'light' | 'dark' | 'auto'
          language?: string
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
    }
  }
}