// Capacitor Haptics를 동적으로 로드하는 유틸리티
export const triggerHaptic = async (intensity: 'light' | 'medium' | 'heavy') => {
  if (typeof window === 'undefined') return // 서버사이드에서는 실행하지 않음
  
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
    
    let style = ImpactStyle.Light
    if (intensity === 'medium') style = ImpactStyle.Medium
    if (intensity === 'heavy') style = ImpactStyle.Heavy
    
    await Haptics.impact({ style })
  } catch (error) {
    // Capacitor가 없는 환경에서는 무시
    console.debug('Haptics not available:', error)
  }
}