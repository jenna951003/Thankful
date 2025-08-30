const ONBOARDING_STORAGE_KEY = 'thankful_onboarding_completed'

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
  } catch (error) {
    console.error('Error resetting onboarding:', error)
  }
}

export const TOTAL_ONBOARDING_STEPS = 7

export function getStepProgress(currentStep: number): number {
  return (currentStep / TOTAL_ONBOARDING_STEPS) * 100
}