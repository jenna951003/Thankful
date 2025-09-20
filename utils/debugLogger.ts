// 디버그 로그 throttling 및 중복 방지 유틸리티

interface LogEntry {
  message: string
  timestamp: number
  count: number
}

class DebugLogger {
  private logCache = new Map<string, LogEntry>()
  private readonly THROTTLE_TIME = 3000 // 3초로 더 증가 (로그 스팸 방지)
  private readonly MAX_COUNT = 1 // 최대 1회만 표시 (매우 엄격하게)
  private lastMessage = '' // 마지막 메시지 추적용
  private consecutiveCount = 0 // 연속 같은 메시지 카운트
  private lastLogTime = 0 // 마지막 로그 시간

  private getLogKey(message: string, type: string = 'log'): string {
    // 메시지에서 동적 값들을 제거하여 더 정확한 중복 감지
    const normalizedMessage = message.replace(/\d+/g, '[NUMBER]').replace(/\{[^}]*\}/g, '[OBJECT]')
    return `${type}:${normalizedMessage}`
  }

  private shouldLog(key: string, message: string): boolean {
    const now = Date.now()

    // 전체적인 로그 간격 제한 (너무 빠른 연속 로그 방지)
    if (now - this.lastLogTime < 100) {
      return false
    }

    // 연속된 같은 메시지 체크 (더 엄격하게)
    if (this.lastMessage === message) {
      this.consecutiveCount++
      // 연속된 같은 메시지가 2번 이상이면 스킵
      if (this.consecutiveCount >= 2) {
        return false
      }
    } else {
      this.lastMessage = message
      this.consecutiveCount = 1
    }

    const existing = this.logCache.get(key)

    if (!existing) {
      this.logCache.set(key, { message, timestamp: now, count: 1 })
      this.lastLogTime = now
      return true
    }

    // 시간이 충분히 지났으면 카운트 리셋
    if (now - existing.timestamp > this.THROTTLE_TIME) {
      existing.timestamp = now
      existing.count = 1
      this.lastLogTime = now
      return true
    }

    // 최대 횟수에 도달했으면 스킵
    if (existing.count >= this.MAX_COUNT) {
      return false
    }

    existing.count++
    this.lastLogTime = now
    return true
  }

  log(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'development') return

    const key = this.getLogKey(message)
    if (this.shouldLog(key, message)) {
      console.log(message, ...args)
    }
  }

  warn(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'development') return

    const key = this.getLogKey(message, 'warn')
    if (this.shouldLog(key, message)) {
      console.warn(message, ...args)
    }
  }

  error(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'development') return

    const key = this.getLogKey(message, 'error')
    if (this.shouldLog(key, message)) {
      console.error(message, ...args)
    }
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'development') return

    const key = this.getLogKey(message, 'debug')
    if (this.shouldLog(key, message)) {
      console.debug(message, ...args)
    }
  }

  // 캐시 정리 (메모리 누수 방지)
  clearCache(): void {
    this.logCache.clear()
  }
}

// 싱글톤 인스턴스
export const debugLogger = new DebugLogger()

// 주기적 캐시 정리 (5분마다)
if (typeof window !== 'undefined') {
  setInterval(() => {
    debugLogger.clearCache()
  }, 5 * 60 * 1000)
}