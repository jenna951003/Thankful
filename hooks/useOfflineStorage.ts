'use client'

import { useState, useEffect } from 'react'
import type { Database } from '../utils/supabase'

type Note = Database['public']['Tables']['notes']['Row']
type NoteInsert = Database['public']['Tables']['notes']['Insert']

const OFFLINE_NOTES_KEY = 'thankful_offline_notes'
const PENDING_SYNCS_KEY = 'thankful_pending_syncs'

interface PendingSync {
  id: string
  type: 'create' | 'update' | 'delete'
  data: Partial<Note>
  timestamp: number
}

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingSyncs, setPendingSyncs] = useState<PendingSync[]>([])

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load pending syncs from localStorage
    const stored = localStorage.getItem(PENDING_SYNCS_KEY)
    if (stored) {
      setPendingSyncs(JSON.parse(stored))
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Save note to offline storage
  const saveOfflineNote = (note: NoteInsert) => {
    const offlineNotes = getOfflineNotes()
    const newNote = {
      ...note,
      id: `offline_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    offlineNotes.push(newNote as Note)
    localStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(offlineNotes))

    // Add to pending syncs
    const newPendingSync: PendingSync = {
      id: newNote.id,
      type: 'create',
      data: newNote,
      timestamp: Date.now()
    }
    
    const updatedPendings = [...pendingSyncs, newPendingSync]
    setPendingSyncs(updatedPendings)
    localStorage.setItem(PENDING_SYNCS_KEY, JSON.stringify(updatedPendings))

    return newNote
  }

  // Get offline notes
  const getOfflineNotes = (): Note[] => {
    const stored = localStorage.getItem(OFFLINE_NOTES_KEY)
    return stored ? JSON.parse(stored) : []
  }

  // Clear offline notes (after successful sync)
  const clearOfflineNotes = () => {
    localStorage.removeItem(OFFLINE_NOTES_KEY)
    localStorage.removeItem(PENDING_SYNCS_KEY)
    setPendingSyncs([])
  }

  // Remove specific pending sync
  const removePendingSync = (id: string) => {
    const updated = pendingSyncs.filter(sync => sync.id !== id)
    setPendingSyncs(updated)
    localStorage.setItem(PENDING_SYNCS_KEY, JSON.stringify(updated))
  }

  return {
    isOnline,
    pendingSyncs,
    saveOfflineNote,
    getOfflineNotes,
    clearOfflineNotes,
    removePendingSync,
    hasPendingSyncs: pendingSyncs.length > 0
  }
}