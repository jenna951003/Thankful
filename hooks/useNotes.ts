'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from '../contexts/AuthProvider'
import { useOfflineStorage } from './useOfflineStorage'
import type { Database } from '../utils/supabase'

type Note = Database['public']['Tables']['notes']['Row']
type NoteInsert = Database['public']['Tables']['notes']['Insert']
type NoteUpdate = Database['public']['Tables']['notes']['Update']

export function useNotes() {
  const { user } = useAuth()
  const { isOnline, getOfflineNotes, saveOfflineNote } = useOfflineStorage()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user's notes (with offline support)
  const fetchNotes = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      if (isOnline) {
        // Fetch from Supabase when online
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Combine online data with offline notes
        const offlineNotes = getOfflineNotes()
        const combinedNotes = [...(data || []), ...offlineNotes]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setNotes(combinedNotes)
      } else {
        // Use only offline notes when offline
        const offlineNotes = getOfflineNotes()
        setNotes(offlineNotes)
      }
    } catch (err: any) {
      setError(err.message)
      // Fallback to offline notes on error
      const offlineNotes = getOfflineNotes()
      setNotes(offlineNotes)
    } finally {
      setLoading(false)
    }
  }

  // Create new note (with offline support)
  const createNote = async (noteData: Omit<NoteInsert, 'user_id'>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const completeNoteData = {
        ...noteData,
        user_id: user.id
      }

      if (isOnline) {
        // Save to Supabase when online
        const { data, error } = await supabase
          .from('notes')
          .insert(completeNoteData)
          .select()
          .single()

        if (error) throw error

        setNotes([data, ...notes])
        return data
      } else {
        // Save offline when offline
        const offlineNote = saveOfflineNote(completeNoteData)
        setNotes([offlineNote, ...notes])
        return offlineNote
      }
    } catch (err: any) {
      setError(err.message)
      // Fallback to offline storage on error
      const offlineNote = saveOfflineNote({
        ...noteData,
        user_id: user.id
      })
      setNotes([offlineNote, ...notes])
      return offlineNote
    }
  }

  // Update note
  const updateNote = async (id: string, updates: NoteUpdate) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setNotes(notes.map(note => note.id === id ? data : note))
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  // Delete note
  const deleteNote = async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setNotes(notes.filter(note => note.id !== id))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  // Toggle favorite
  const toggleFavorite = async (id: string) => {
    const note = notes.find(n => n.id === id)
    if (!note) return

    await updateNote(id, { is_favorite: !note.is_favorite })
  }

  // Get notes by type
  const getNotesByType = (type: 'gratitude' | 'sermon' | 'prayer') => {
    return notes.filter(note => note.type === type)
  }

  // Get recent notes
  const getRecentNotes = (limit: number = 5) => {
    return notes.slice(0, limit)
  }

  // Get favorite notes
  const getFavoriteNotes = () => {
    return notes.filter(note => note.is_favorite)
  }

  useEffect(() => {
    if (user) {
      fetchNotes()
    } else {
      setNotes([])
      setLoading(false)
    }
  }, [user])

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    getNotesByType,
    getRecentNotes,
    getFavoriteNotes,
    refetch: fetchNotes
  }
}