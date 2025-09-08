import { Device } from '@capacitor/device'

/**
 * 디바이스 이름에서 사용자 이름을 추출합니다.
 * iOS: "철수의 iPhone" → "철수"
 * Android: 디바이스 이름에서 사용자 부분 추출
 * Web: 기본값 반환
 */
export const getUserDisplayName = async (): Promise<string> => {
  try {
    // Capacitor가 로드되지 않은 경우 체크
    if (typeof window === 'undefined' || !window.Capacitor) {
      console.log('🌐 Not in Capacitor environment, returning default name')
      return '게스트'
    }

    const deviceInfo = await Device.getInfo()
    console.log('📱 Device Info:', deviceInfo)
    
    // 디바이스 이름이 없으면 기본값 반환
    if (!deviceInfo.name) {
      console.log('❌ No device name available')
      return deviceInfo.platform === 'web' ? '게스트' : '익명 사용자'
    }
    
    const deviceName = deviceInfo.name
    console.log('📱 Device name:', deviceName)
    
    // iOS 패턴: "철수의 iPhone", "John's iPhone"
    // 한글 패턴
    const koreanMatch = deviceName.match(/^(.+)의\s+(iPhone|iPad|iPod|Mac)/)
    if (koreanMatch) {
      const userName = koreanMatch[1].trim()
      console.log('✅ Korean pattern matched:', userName)
      return userName
    }
    
    // 영어 패턴
    const englishMatch = deviceName.match(/^(.+)'s\s+(iPhone|iPad|iPod|Mac|Android|Phone|Device)/)
    if (englishMatch) {
      const userName = englishMatch[1].trim()
      console.log('✅ English pattern matched:', userName)
      return userName
    }
    
    // Android 패턴: 보통 모델명만 있거나 사용자가 설정한 이름
    if (deviceInfo.platform === 'android') {
      console.log('🤖 Android device detected')
      // Android에서는 보통 모델명이 오므로 기본값 사용
      // 또는 디바이스 이름 그대로 사용 (사용자가 커스텀한 경우)
      const lowerDeviceName = deviceName.toLowerCase()
      if (lowerDeviceName.includes('galaxy') || 
          lowerDeviceName.includes('pixel') || 
          lowerDeviceName.includes('xiaomi') ||
          lowerDeviceName.includes('oneplus') ||
          lowerDeviceName.includes('samsung') ||
          lowerDeviceName.includes('lg') ||
          lowerDeviceName.includes('huawei') ||
          lowerDeviceName.includes('oppo') ||
          lowerDeviceName.includes('vivo')) {
        console.log('📱 Android model name detected, using default')
        return '익명 사용자'
      }
      // 사용자가 설정한 커스텀 이름일 가능성
      const customName = deviceName.length <= 20 ? deviceName : '익명 사용자'
      console.log('✅ Android custom name:', customName)
      return customName
    }
    
    // Web 환경
    if (deviceInfo.platform === 'web') {
      console.log('🌐 Web platform detected')
      return '게스트'
    }
    
    // 패턴에 매치하지 않으면 기본값
    console.log('❓ No pattern matched, using default')
    return '익명 사용자'
    
  } catch (error) {
    console.error('❌ Error getting device user name:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // 오류 발생 시 환경에 따른 기본값 반환
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      return '게스트'
    }
    return '익명 사용자'
  }
}

/**
 * 사용자 디스플레이 네임을 localStorage에 저장
 */
export const saveUserDisplayName = (name: string) => {
  try {
    localStorage.setItem('userDisplayName', name)
    console.log('💾 Saved display name:', name)
  } catch (error) {
    console.error('❌ Error saving display name:', error)
  }
}

/**
 * localStorage에서 사용자 디스플레이 네임 가져오기
 */
export const getSavedDisplayName = (): string | null => {
  try {
    // SSR 안전 처리: 클라이언트 사이드에서만 localStorage 접근
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem('userDisplayName')
  } catch (error) {
    console.error('❌ Error getting saved display name:', error)
    return null
  }
}