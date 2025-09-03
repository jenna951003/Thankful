// 재시도 유틸리티 함수
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`)
      return await fn()
    } catch (error) {
      lastError = error
      console.warn(`❌ Attempt ${attempt} failed:`, error)
      
      if (attempt === maxRetries) {
        console.error('💥 All retry attempts failed')
        throw lastError
      }
      
      // 지수 백오프: 1초, 2초, 4초...
      const waitTime = delay * Math.pow(2, attempt - 1)
      console.log(`⏳ Waiting ${waitTime}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw lastError
}

// 네트워크 오류인지 확인하는 함수
export function isNetworkError(error: any): boolean {
  if (!error) return false
  
  // 일반적인 네트워크 오류들
  const networkErrorMessages = [
    'network',
    'timeout',
    'connection',
    'fetch',
    'cors',
    'unreachable'
  ]
  
  const errorMessage = (error.message || error.toString()).toLowerCase()
  return networkErrorMessages.some(msg => errorMessage.includes(msg))
}

// Supabase 특정 재시도 가능한 오류인지 확인
export function isRetryableSupabaseError(error: any): boolean {
  if (!error) return false
  
  // 재시도 가능한 Supabase 오류 코드들
  const retryableCodes = [
    'PGRST301', // 네트워크 오류
    'PGRST302', // 타임아웃
    '503',      // 서비스 일시 불가
    '502',      // 게이트웨이 오류
    '504'       // 게이트웨이 타임아웃
  ]
  
  return retryableCodes.some(code => 
    error.code === code || 
    (error.message && error.message.includes(code))
  )
}