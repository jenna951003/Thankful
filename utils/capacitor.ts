// Capacitor 모듈들을 웹 환경에서 안전하게 사용하기 위한 유틸리티

export const safeHaptics = {
  async impact(style: 'LIGHT' | 'MEDIUM' | 'HEAVY' = 'LIGHT') {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
        await Haptics.impact({ style: ImpactStyle[style] })
      } else {
        console.log('🌐 웹 환경에서는 햅틱 피드백을 사용할 수 없습니다')
      }
    } catch (error) {
      console.log('⚠️ 햅틱 피드백 실행 중 오류:', error)
    }
  },

  async notification(type: 'SUCCESS' | 'WARNING' | 'ERROR' = 'SUCCESS') {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Haptics, NotificationType } = await import('@capacitor/haptics')
        await Haptics.notification({ type: NotificationType[type] })
      } else {
        console.log('🌐 웹 환경에서는 햅틱 피드백을 사용할 수 없습니다')
      }
    } catch (error) {
      console.log('⚠️ 햅틱 피드백 실행 중 오류:', error)
    }
  }
}

export const safeDevice = {
  async getInfo() {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Device } = await import('@capacitor/device')
        return await Device.getInfo()
      } else {
        console.log('🌐 웹 환경에서는 기기 정보를 가져올 수 없습니다')
        return {
          platform: 'web',
          name: 'Web Browser',
          model: 'Unknown',
          manufacturer: 'Unknown'
        }
      }
    } catch (error) {
      console.log('⚠️ 기기 정보 가져오기 실행 중 오류:', error)
      return {
        platform: 'web',
        name: 'Web Browser',
        model: 'Unknown',
        manufacturer: 'Unknown'
      }
    }
  },

  async getLanguageCode() {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const { Device } = await import('@capacitor/device')
        return await Device.getLanguageCode()
      } else {
        console.log('🌐 웹 환경에서는 기기 언어를 가져올 수 없습니다')
        return { value: 'ko' }
      }
    } catch (error) {
      console.log('⚠️ 기기 언어 가져오기 실행 중 오류:', error)
      return { value: 'ko' }
    }
  }
}