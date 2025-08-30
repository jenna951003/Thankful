'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface OnboardingData {
  faithBackground: string | null
  gratitudeExperience: string | null
  interests: string[]
  notifications: {
    dailyTime: string | null
    weeklyReview: boolean
  }
  firstGratitude: {
    items: string[]
    photo?: string
    mood?: string
  }
}

interface OnboardingState {
  currentStep: number
  data: OnboardingData
}

type OnboardingAction = 
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_FAITH_BACKGROUND'; payload: string }
  | { type: 'SET_GRATITUDE_EXPERIENCE'; payload: string }
  | { type: 'SET_INTERESTS'; payload: string[] }
  | { type: 'SET_NOTIFICATIONS'; payload: { dailyTime: string | null; weeklyReview: boolean } }
  | { type: 'SET_FIRST_GRATITUDE'; payload: { items: string[]; photo?: string; mood?: string } }
  | { type: 'RESET' }

const initialState: OnboardingState = {
  currentStep: 1,
  data: {
    faithBackground: null,
    gratitudeExperience: null,
    interests: [],
    notifications: {
      dailyTime: null,
      weeklyReview: true
    },
    firstGratitude: {
      items: []
    }
  }
}

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    
    case 'SET_FAITH_BACKGROUND':
      return {
        ...state,
        data: { ...state.data, faithBackground: action.payload }
      }
    
    case 'SET_GRATITUDE_EXPERIENCE':
      return {
        ...state,
        data: { ...state.data, gratitudeExperience: action.payload }
      }
    
    case 'SET_INTERESTS':
      return {
        ...state,
        data: { ...state.data, interests: action.payload }
      }
    
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        data: { ...state.data, notifications: action.payload }
      }
    
    case 'SET_FIRST_GRATITUDE':
      return {
        ...state,
        data: { ...state.data, firstGratitude: action.payload }
      }
    
    case 'RESET':
      return initialState
    
    default:
      return state
  }
}

interface OnboardingContextType {
  state: OnboardingState
  setStep: (step: number) => void
  setFaithBackground: (faith: string) => void
  setGratitudeExperience: (experience: string) => void
  setInterests: (interests: string[]) => void
  setNotifications: (notifications: { dailyTime: string | null; weeklyReview: boolean }) => void
  setFirstGratitude: (gratitude: { items: string[]; photo?: string; mood?: string }) => void
  reset: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  const contextValue: OnboardingContextType = {
    state,
    setStep: (step: number) => dispatch({ type: 'SET_STEP', payload: step }),
    setFaithBackground: (faith: string) => dispatch({ type: 'SET_FAITH_BACKGROUND', payload: faith }),
    setGratitudeExperience: (experience: string) => dispatch({ type: 'SET_GRATITUDE_EXPERIENCE', payload: experience }),
    setInterests: (interests: string[]) => dispatch({ type: 'SET_INTERESTS', payload: interests }),
    setNotifications: (notifications: { dailyTime: string | null; weeklyReview: boolean }) => 
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications }),
    setFirstGratitude: (gratitude: { items: string[]; photo?: string; mood?: string }) => 
      dispatch({ type: 'SET_FIRST_GRATITUDE', payload: gratitude }),
    reset: () => dispatch({ type: 'RESET' })
  }

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}