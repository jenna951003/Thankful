const ONBOARDING_STORAGE_KEY = 'thankful_onboarding_completed'
const ONBOARDING_DATA_KEY = 'thankful_onboarding_data'

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

export function isOnboardingCompleted(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    return completed === 'true'
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return false
  }
}

export function completeOnboarding(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
  } catch (error) {
    console.error('Error saving onboarding completion:', error)
  }
}

export function resetOnboarding(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    localStorage.removeItem(ONBOARDING_DATA_KEY)
  } catch (error) {
    console.error('Error resetting onboarding:', error)
  }
}

// 온보딩 데이터 저장 (로컬스토리지)
export function saveOnboardingData(data: OnboardingData): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data))
    console.log('📝 Onboarding data saved to localStorage')
  } catch (error) {
    console.error('Error saving onboarding data:', error)
  }
}

// 온보딩 데이터 불러오기 (로컬스토리지)
export function getOnboardingData(): OnboardingData | null {
  if (typeof window === 'undefined') return null
  
  try {
    const data = localStorage.getItem(ONBOARDING_DATA_KEY)
    if (data) {
      console.log('📖 Onboarding data loaded from localStorage')
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.error('Error getting onboarding data:', error)
    return null
  }
}

// 온보딩 데이터 삭제 (로컬스토리지)
export function clearOnboardingData(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(ONBOARDING_DATA_KEY)
    console.log('🗑️ Onboarding data cleared from localStorage')
  } catch (error) {
    console.error('Error clearing onboarding data:', error)
  }
}

export const TOTAL_ONBOARDING_STEPS = 8

export function getStepProgress(currentStep: number): number {
  return (currentStep / TOTAL_ONBOARDING_STEPS) * 100
}

// 온보딩 데이터가 있는지 확인
export function hasOnboardingData(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const data = localStorage.getItem(ONBOARDING_DATA_KEY)
    return data !== null
  } catch (error) {
    console.error('Error checking onboarding data:', error)
    return false
  }
}