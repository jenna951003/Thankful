'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  // 이미 클라이언트가 생성되어 있으면 재사용
  if (supabaseClient) {
    return supabaseClient
  }

  // 새로운 클라이언트 생성
  supabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabaseClient
}