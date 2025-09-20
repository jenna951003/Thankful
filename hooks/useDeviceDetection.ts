import { useState, useEffect } from 'react'
import { Device } from '@capacitor/device'
import { debugLogger } from '../utils/debugLogger'

export interface SafeArea {
  top: number
  bottom: number
  left: number
  right: number
}

export interface DeviceInfo {
  brand: string
  model: string
  safeArea: SafeArea
}

// iPhone 모델별 세이프존 데이터베이스
const IPHONE_SAFE_AREAS: { [key: string]: SafeArea } = {
  // 홈버튼 있는 기종 (노치 없음)
  'iPhone SE': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone SE (2nd generation)': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone SE (3rd generation)': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 5': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 5s': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 6': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 6s': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 6 Plus': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 6s Plus': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 7': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 7 Plus': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 8': { top: 20, bottom: 0, left: 0, right: 0 },
  'iPhone 8 Plus': { top: 20, bottom: 0, left: 0, right: 0 },
  
  // 노치 있는 기종
  'iPhone X': { top: 44, bottom: 34, left: 0, right: 0 },
  'iPhone XS': { top: 44, bottom: 34, left: 0, right: 0 },
  'iPhone XS Max': { top: 44, bottom: 34, left: 0, right: 0 },
  'iPhone XR': { top: 48, bottom: 34, left: 0, right: 0 },
  'iPhone 11': { top: 48, bottom: 34, left: 0, right: 0 },
  'iPhone 11 Pro': { top: 44, bottom: 34, left: 0, right: 0 },
  'iPhone 11 Pro Max': { top: 48, bottom: 34, left: 0, right: 0 },
  'iPhone 12 mini': { top: 50, bottom: 34, left: 0, right: 0 },
  'iPhone 12': { top: 47, bottom: 34, left: 0, right: 0 },
  'iPhone 12 Pro': { top: 47, bottom: 34, left: 0, right: 0 },
  'iPhone 12 Pro Max': { top: 47, bottom: 34, left: 0, right: 0 },
  'iPhone 13 mini': { top: 50, bottom: 34, left: 0, right: 0 },
  'iPhone 13': { top: 47, bottom: 34, left: 0, right: 0 },
  'iPhone 13 Pro': { top: 47, bottom: 34, left: 0, right: 0 },
  'iPhone 13 Pro Max': { top: 47, bottom: 34, left: 0, right: 0 },
  'iPhone 14': { top: 47, bottom: 34, left: 0, right: 0 },
  'iPhone 14 Plus': { top: 47, bottom: 34, left: 0, right: 0 },
  'iPhone 15': { top: 47, bottom: 34, left: 0, right: 0 },
  'iPhone 15 Plus': { top: 47, bottom: 34, left: 0, right: 0 },
  
  // 다이나믹 아일랜드 있는 기종
  'iPhone 14 Pro': { top: 59, bottom: 34, left: 0, right: 0 },
  'iPhone 14 Pro Max': { top: 59, bottom: 34, left: 0, right: 0 },
  'iPhone 15 Pro': { top: 59, bottom: 34, left: 0, right: 0 },
  'iPhone 15 Pro Max': { top: 59, bottom: 34, left: 0, right: 0 },
  'iPhone 16': { top: 59, bottom: 34, left: 0, right: 0 },
  'iPhone 16 Plus': { top: 59, bottom: 34, left: 0, right: 0 },
  'iPhone 16 Pro': { top: 59, bottom: 34, left: 0, right: 0 },
  'iPhone 16 Pro Max': { top: 59, bottom: 34, left: 0, right: 0 },
}

// Capacitor Device 플러그인으로 실제 기기 정보 감지
async function detectDeviceInfo(): Promise<DeviceInfo> {
  try {
    // ?app=true 쿼리 파라미터가 있거나 실제 네이티브 환경인 경우
    const urlParams = new URLSearchParams(window.location.search)
    const isAppMode = urlParams.get('app') === 'true'
    
    if (isAppMode || typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        // 실제 기기 정보 가져오기
        const deviceInfo = await Device.getInfo()
        const languageInfo = await Device.getLanguageCode()
        
        // 🔧 중복 로그 최소화 - 첫 실행시에만 출력
        if (!(window as any).__deviceDetectionLogged) {
          debugLogger.log('🔍 Capacitor 기기 정보:', deviceInfo)
          debugLogger.log('🌍 언어:', languageInfo);
          (window as any).__deviceDetectionLogged = true
        }
        
        // iOS 기기인 경우
        if (deviceInfo.platform === 'ios') {
          // name 필드를 우선 사용 (더 정확함)
          const model = deviceInfo.name || deviceInfo.model || 'iPhone'
          const safeArea = IPHONE_SAFE_AREAS[model] || { top: 47, bottom: 34, left: 0, right: 0 }
          
          debugLogger.debug('📱 감지된 모델:', model)
          debugLogger.debug('🔍 찾은 세이프존:', safeArea)
          
          return {
            brand: 'iPhone',
            model,
            safeArea
          }
        }
        
        // Android 기기인 경우
        if (deviceInfo.platform === 'android') {
          return {
            brand: deviceInfo.manufacturer || 'Android',
            model: deviceInfo.model || 'Android Device',
            safeArea: { top: 24, bottom: 0, left: 0, right: 0 } // Android 기본값
          }
        }

        // 웹 환경인 경우 - 개발자 도구로 간주
        if (deviceInfo.platform === 'web') {
          // 🔧 중복 로그 최소화
          if (!(window as any).__webDetectionLogged) {
            debugLogger.log('🌐 웹 환경 감지됨 - 개발자 도구로 설정')
            debugLogger.log('🖥️ 개발자 도구 화면 크기:', window.innerWidth, 'x', window.innerHeight);
            (window as any).__webDetectionLogged = true
          }
          
          // 개발자 도구에서 화면 크기로 기기 감지하여 세이프존 설정
          const screenWidth = window.innerWidth
          const screenHeight = window.innerHeight
          
          // iPhone 14 Pro Max (430x932)
          if (screenWidth === 430 && screenHeight === 932) return { brand: 'Web Browser', model: 'iPhone 14 Pro Max (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 14 Pro Max'] }
          
          // iPhone 14 Pro (393x852)
          if (screenWidth === 393 && screenHeight === 852) return { brand: 'Web Browser', model: 'iPhone 14 Pro (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 14 Pro'] }
          
          // iPhone 14 Plus (428x926)
          if (screenWidth === 428 && screenHeight === 926) return { brand: 'Web Browser', model: 'iPhone 14 Plus (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 14 Plus'] }
          
          // iPhone 14 (390x844)
          if (screenWidth === 390 && screenHeight === 844) return { brand: 'Web Browser', model: 'iPhone 14 (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 14'] }
          
          // iPhone SE (375x667, 375x812, 390x844)
          if ((screenWidth === 375 && screenHeight === 667) || (screenWidth === 375 && screenHeight === 812) || (screenWidth === 390 && screenHeight === 844)) {
            return { brand: 'Web Browser', model: 'iPhone SE (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone SE'] }
          }
          
          // iPhone 13 Pro Max (428x926)
          if (screenWidth === 428 && screenHeight === 926) return { brand: 'Web Browser', model: 'iPhone 13 Pro Max (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 13 Pro Max'] }
          
          // iPhone 13 Pro (390x844)
          if (screenWidth === 390 && screenHeight === 844) return { brand: 'Web Browser', model: 'iPhone 13 Pro (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 13 Pro'] }
          
          // iPhone 13 (390x844)
          if (screenWidth === 390 && screenHeight === 844) return { brand: 'Web Browser', model: 'iPhone 13 (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 13'] }
          
          // iPhone 12 Pro Max (428x926)
          if (screenWidth === 428 && screenHeight === 926) return { brand: 'Web Browser', model: 'iPhone 12 Pro Max (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 12 Pro Max'] }
          
          // iPhone 12 Pro (390x844)
          if (screenWidth === 390 && screenHeight === 844) return { brand: 'Web Browser', model: 'iPhone 12 Pro (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 12 Pro'] }
          
          // iPhone 12 (390x844)
          if (screenWidth === 390 && screenHeight === 844) return { brand: 'Web Browser', model: 'iPhone 12 (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 12'] }
          
          // iPhone 12 mini (375x812)
          if (screenWidth === 375 && screenHeight === 812) return { brand: 'Web Browser', model: 'iPhone 12 mini (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 12 mini'] }
          
          // iPhone 11 Pro Max (414x896)
          if (screenWidth === 414 && screenHeight === 896) return { brand: 'Web Browser', model: 'iPhone 11 Pro Max (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 11 Pro Max'] }
          
          // iPhone 11 Pro (375x812)
          if (screenWidth === 375 && screenHeight === 812) return { brand: 'Web Browser', model: 'iPhone 11 Pro (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 11 Pro'] }
          
          // iPhone 11 (414x896)
          if (screenWidth === 414 && screenHeight === 896) return { brand: 'Web Browser', model: 'iPhone 11 (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 11'] }
          
          // iPhone XS Max (414x896)
          if (screenWidth === 414 && screenHeight === 896) return { brand: 'Web Browser', model: 'iPhone XS Max (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone XS Max'] }
          
          // iPhone XS (375x812)
          if (screenWidth === 375 && screenHeight === 812) return { brand: 'Web Browser', model: 'iPhone XS (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone XS'] }
          
          // iPhone XR (414x896)
          if (screenWidth === 414 && screenHeight === 896) return { brand: 'Web Browser', model: 'iPhone XR (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone XR'] }
          
          // iPhone X (375x812)
          if (screenWidth === 375 && screenHeight === 812) return { brand: 'Web Browser', model: 'iPhone X (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone X'] }
          
          // iPhone 8 Plus (414x736)
          if (screenWidth === 414 && screenHeight === 736) return { brand: 'Web Browser', model: 'iPhone 8 Plus (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 8 Plus'] }
          
          // iPhone 8 (375x667)
          if (screenWidth === 375 && screenHeight === 667) return { brand: 'Web Browser', model: 'iPhone 8 (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 8'] }
          
          // iPhone 7 Plus (414x736)
          if (screenWidth === 414 && screenHeight === 736) return { brand: 'Web Browser', model: 'iPhone 7 Plus (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 7 Plus'] }
          
          // iPhone 7 (375x667)
          if (screenWidth === 375 && screenHeight === 667) return { brand: 'Web Browser', model: 'iPhone 7 (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 7'] }
          
          // iPhone 6s Plus (414x736)
          if (screenWidth === 414 && screenHeight === 736) return { brand: 'Web Browser', model: 'iPhone 6s Plus (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 6s Plus'] }
          
          // iPhone 6s (375x667)
          if (screenWidth === 375 && screenHeight === 667) return { brand: 'Web Browser', model: 'iPhone 6s (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 6s'] }
          
          // iPhone 6 Plus (414x736)
          if (screenWidth === 414 && screenHeight === 736) return { brand: 'Web Browser', model: 'iPhone 6 Plus (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 6 Plus'] }
          
          // iPhone 6 (375x667)
          if (screenWidth === 375 && screenHeight === 667) return { brand: 'Web Browser', model: 'iPhone 6 (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 6'] }
          
          // iPhone 5s (320x568)
          if (screenWidth === 320 && screenHeight === 568) return { brand: 'Web Browser', model: 'iPhone 5s (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 5s'] }
          
          // iPhone 5 (320x568)
          if (screenWidth === 320 && screenHeight === 568) return { brand: 'Web Browser', model: 'iPhone 5 (Dev)', safeArea: IPHONE_SAFE_AREAS['iPhone 5'] }
          
          // 기본적으로 iPhone SE 세이프존 사용
          return {
            brand: 'Web Browser',
            model: 'Developer Tools',
            safeArea: IPHONE_SAFE_AREAS['iPhone SE']
          }
        }
        
      } catch (capError) {
        debugLogger.debug('⚠️ Capacitor 에러, User-Agent 기반 감지로 전환:', capError)
        // User-Agent 기반 감지로 넘어감
      }
    }
    
    // 웹 브라우저인 경우 (개발자 도구 포함)
    const userAgent = navigator.userAgent
    
    // iPhone 감지 - User-Agent 기반 (우선순위 높음)
    if (userAgent.includes('iPhone')) {
      // User-Agent에서 더 구체적인 정보 추출 시도
      if (userAgent.includes('iPhone16,1') || userAgent.includes('iPhone16,2')) return { brand: 'iPhone', model: 'iPhone 16 Pro', safeArea: IPHONE_SAFE_AREAS['iPhone 16 Pro'] }
      if (userAgent.includes('iPhone16,3') || userAgent.includes('iPhone16,4')) return { brand: 'iPhone', model: 'iPhone 16 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 16 Pro Max'] }
      if (userAgent.includes('iPhone15,1') || userAgent.includes('iPhone15,2')) return { brand: 'iPhone', model: 'iPhone 15 Pro', safeArea: IPHONE_SAFE_AREAS['iPhone 15 Pro'] }
      if (userAgent.includes('iPhone15,3') || userAgent.includes('iPhone15,4')) return { brand: 'iPhone', model: 'iPhone 15 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 15 Pro Max'] }
      if (userAgent.includes('iPhone14,1') || userAgent.includes('iPhone14,2')) return { brand: 'iPhone', model: 'iPhone 14 Pro', safeArea: IPHONE_SAFE_AREAS['iPhone 14 Pro'] }
      if (userAgent.includes('iPhone14,3') || userAgent.includes('iPhone14,4')) return { brand: 'iPhone', model: 'iPhone 14 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 14 Pro Max'] }
      if (userAgent.includes('iPhone13,1') || userAgent.includes('iPhone13,2')) return { brand: 'iPhone', model: 'iPhone 13 Pro', safeArea: IPHONE_SAFE_AREAS['iPhone 13 Pro'] }
      if (userAgent.includes('iPhone13,3') || userAgent.includes('iPhone13,4')) return { brand: 'iPhone', model: 'iPhone 13 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 13 Pro Max'] }
      if (userAgent.includes('iPhone12,1') || userAgent.includes('iPhone12,2')) return { brand: 'iPhone', model: 'iPhone 12 Pro', safeArea: IPHONE_SAFE_AREAS['iPhone 12 Pro'] }
      if (userAgent.includes('iPhone12,3') || userAgent.includes('iPhone12,4')) return { brand: 'iPhone', model: 'iPhone 12 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 12 Pro Max'] }
      if (userAgent.includes('iPhone11,1') || userAgent.includes('iPhone11,2')) return { brand: 'iPhone', model: 'iPhone 11 Pro', safeArea: IPHONE_SAFE_AREAS['iPhone 11 Pro'] }
      if (userAgent.includes('iPhone11,3') || userAgent.includes('iPhone11,4')) return { brand: 'iPhone', model: 'iPhone 11 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 11 Pro Max'] }
      if (userAgent.includes('iPhone10,1') || userAgent.includes('iPhone10,2')) return { brand: 'iPhone', model: 'iPhone 8', safeArea: IPHONE_SAFE_AREAS['iPhone 8'] }
      if (userAgent.includes('iPhone10,3') || userAgent.includes('iPhone10,4')) return { brand: 'iPhone', model: 'iPhone X', safeArea: IPHONE_SAFE_AREAS['iPhone X'] }
      if (userAgent.includes('iPhone9,1') || userAgent.includes('iPhone9,2')) return { brand: 'iPhone', model: 'iPhone 7', safeArea: IPHONE_SAFE_AREAS['iPhone 7'] }
      if (userAgent.includes('iPhone8,1') || userAgent.includes('iPhone8,2')) return { brand: 'iPhone', model: 'iPhone 6s', safeArea: IPHONE_SAFE_AREAS['iPhone 6s'] }
      if (userAgent.includes('iPhone7,1') || userAgent.includes('iPhone7,2')) return { brand: 'iPhone', model: 'iPhone 6', safeArea: IPHONE_SAFE_AREAS['iPhone 6'] }
      if (userAgent.includes('iPhone6,1') || userAgent.includes('iPhone6,2')) return { brand: 'iPhone', model: 'iPhone 5s', safeArea: IPHONE_SAFE_AREAS['iPhone 5s'] }
      if (userAgent.includes('iPhone5,1') || userAgent.includes('iPhone5,2')) return { brand: 'iPhone', model: 'iPhone 5', safeArea: IPHONE_SAFE_AREAS['iPhone 5'] }
      if (userAgent.includes('iPhone4,1')) return { brand: 'iPhone', model: 'iPhone 4s', safeArea: IPHONE_SAFE_AREAS['iPhone 4s'] }
      if (userAgent.includes('iPhone3,1')) return { brand: 'iPhone', model: 'iPhone 4', safeArea: IPHONE_SAFE_AREAS['iPhone 4'] }
      if (userAgent.includes('iPhone2,1')) return { brand: 'iPhone', model: 'iPhone 3GS', safeArea: IPHONE_SAFE_AREAS['iPhone 3GS'] }
      if (userAgent.includes('iPhone1,1')) return { brand: 'iPhone', model: 'iPhone 1', safeArea: IPHONE_SAFE_AREAS['iPhone 1'] }
      
      // User-Agent에서 iOS 버전으로 모델 추정
      const iOSVersion = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/i)
      if (iOSVersion) {
        const majorVersion = parseInt(iOSVersion[1])
        debugLogger.debug('📱 iOS 버전:', majorVersion)
        
        if (majorVersion >= 18) return { brand: 'iPhone', model: 'iPhone 16 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 16 Pro Max'] }
        if (majorVersion >= 17) return { brand: 'iPhone', model: 'iPhone 15 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 15 Pro Max'] }
        if (majorVersion >= 16) return { brand: 'iPhone', model: 'iPhone 14 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 14 Pro Max'] }
        if (majorVersion >= 15) return { brand: 'iPhone', model: 'iPhone 13 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 13 Pro Max'] }
        if (majorVersion >= 14) return { brand: 'iPhone', model: 'iPhone 12 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 12 Pro Max'] }
        if (majorVersion >= 13) return { brand: 'iPhone', model: 'iPhone 11 Pro Max', safeArea: IPHONE_SAFE_AREAS['iPhone 11 Pro Max'] }
        if (majorVersion >= 12) return { brand: 'iPhone', model: 'iPhone XS Max', safeArea: IPHONE_SAFE_AREAS['iPhone XS Max'] }
        if (majorVersion >= 11) return { brand: 'iPhone', model: 'iPhone X', safeArea: IPHONE_SAFE_AREAS['iPhone X'] }
        if (majorVersion >= 10) return { brand: 'iPhone', model: 'iPhone 7', safeArea: IPHONE_SAFE_AREAS['iPhone 7'] }
        if (majorVersion >= 9) return { brand: 'iPhone', model: 'iPhone 6', safeArea: IPHONE_SAFE_AREAS['iPhone 6'] }
        if (majorVersion >= 8) return { brand: 'iPhone', model: 'iPhone 5', safeArea: IPHONE_SAFE_AREAS['iPhone 5'] }
      }
      
      // 마지막 fallback: 화면 크기로 감지
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      debugLogger.debug('🖥️ 화면 크기 fallback:', screenWidth, 'x', screenHeight)
      
      // iPhone SE 시리즈 (가장 우선순위 높게)
      if (screenWidth === 375 && screenHeight === 667) return { brand: 'iPhone', model: 'iPhone SE', safeArea: IPHONE_SAFE_AREAS['iPhone SE'] }
      if (screenWidth === 375 && screenHeight === 812) return { brand: 'iPhone', model: 'iPhone SE', safeArea: IPHONE_SAFE_AREAS['iPhone SE'] }
      if (screenWidth === 390 && screenHeight === 844) return { brand: 'iPhone', model: 'iPhone SE', safeArea: IPHONE_SAFE_AREAS['iPhone SE'] }
      
      // 기본 iPhone
      return {
        brand: 'iPhone',
        model: 'iPhone SE',
        safeArea: IPHONE_SAFE_AREAS['iPhone SE']
      }
    }
    
    // Android 감지
    if (userAgent.includes('Android')) {
      return {
        brand: 'Android',
        model: 'Android Device',
        safeArea: { top: 24, bottom: 0, left: 0, right: 0 }
      }
    }
    
    // 데스크톱 브라우저
    return {
      brand: 'Web Browser',
      model: 'Desktop',
      safeArea: { top: 0, bottom: 0, left: 0, right: 0 }
    }
    
  } catch (error) {
    debugLogger.error('Capacitor 기기 감지 에러:', error)
    
    // fallback: 웹 기반 감지
    const userAgent = navigator.userAgent
    if (userAgent.includes('iPhone')) {
      return {
        brand: 'iPhone',
        model: 'iPhone SE',
        safeArea: { top: 47, bottom: 34, left: 0, right: 0 }
      }
    }
    
    return {
      brand: 'Unknown',
      model: 'Unknown Device',
      safeArea: { top: 0, bottom: 0, left: 0, right: 0 }
    }
  }
}

// 홈버튼이 있는 기종(노치 없음)인지 확인하는 함수
export function isHomeButtonDevice(model: string): boolean {
  const homeButtonModels = [
    'iPhone SE',
    'iPhone SE (2nd generation)',
    'iPhone SE (3rd generation)',
    'iPhone 5',
    'iPhone 5s',
    'iPhone 6',
    'iPhone 6s',
    'iPhone 6 Plus',
    'iPhone 6s Plus',
    'iPhone 7',
    'iPhone 7 Plus',
    'iPhone 8',
    'iPhone 8 Plus'
  ]

  return homeButtonModels.some(homeModel => model.includes(homeModel))
}

// 테블릿 크기인지 확인하는 함수 (화면 폭 기반)
export function isTabletSize(): boolean {
  if (typeof window === 'undefined') return false

  const screenWidth = window.innerWidth
  const userAgent = navigator.userAgent

  // iPad는 무조건 테블릿
  if (userAgent.includes('iPad')) return true

  // Android 테블릿 감지
  if (userAgent.includes('Android') && !userAgent.includes('Mobile')) return true

  // 화면 폭 기반 테블릿 감지 (768px 이상)
  return screenWidth >= 768
}

// 소형 기기인지 확인하는 함수 (아이폰 SE급 크기)
export function isSmallSize(): boolean {
  if (typeof window === 'undefined') return false

  const screenWidth = window.innerWidth

  // 화면 폭 기반 소형 기기 감지 (375px 이하)
  return screenWidth <= 375
}

// 아이폰 SE 라인인지 확인하는 함수 (호환성 유지용)
export function isIPhoneSEDevice(): boolean {
  return isSmallSize()
}

// CSS 변수 캐시 (중복 설정 방지)
let currentSafeAreaValues: { top: number; bottom: number } | null = null

export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    brand: 'Unknown',
    model: 'Loading...',
    safeArea: { top: 0, bottom: 0, left: 0, right: 0 }
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeDeviceInfo = async () => {
      try {
        const info = await detectDeviceInfo()
        setDeviceInfo(info)

        // CSS 변수 중복 설정 방지
        if (typeof window !== 'undefined' && document.documentElement) {
          const { top, bottom } = info.safeArea

          // 값이 변경된 경우에만 CSS 변수 업데이트
          if (!currentSafeAreaValues ||
              currentSafeAreaValues.top !== top ||
              currentSafeAreaValues.bottom !== bottom) {

            document.documentElement.style.setProperty('--actual-safe-top', `${top}px`)
            document.documentElement.style.setProperty('--actual-safe-bottom', `${bottom}px`)

            currentSafeAreaValues = { top, bottom }
            debugLogger.debug('🎨 CSS 변수 설정:', `top: ${top}px, bottom: ${bottom}px`)
          }
        }
      } catch (error) {
        debugLogger.error('기기 감지 에러:', error)
        setDeviceInfo({
          brand: 'Unknown',
          model: 'Error',
          safeArea: { top: 0, bottom: 0, left: 0, right: 0 }
        })
      } finally {
        setIsLoading(false)
      }
    }

    // 리사이즈 이벤트 리스너 추가 (throttling 적용)
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          debugLogger.debug('🔄 화면 크기 변경 감지, 기기 정보 재감지')
          initializeDeviceInfo()
        }, 300) // 300ms throttling
      }
    }

    initializeDeviceInfo()

    // 웹 환경에서만 리사이즈 이벤트 리스너 추가
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
        clearTimeout(resizeTimeout)
      }
    }
  }, [])

  return {
    deviceInfo,
    isLoading,
    safeArea: deviceInfo.safeArea,
    deviceName: `${deviceInfo.brand} ${deviceInfo.model}`,
    isIPhone: deviceInfo.brand === 'iPhone',
    isWebEnvironment: deviceInfo.brand === 'Web Browser',
    isHomeButtonDevice: isHomeButtonDevice(deviceInfo.model),
    isTablet: isTabletSize(),
    isIPhoneSE: isSmallSize(),
    isTabletSize: isTabletSize(),
    isSmallSize: isSmallSize()
  }
}