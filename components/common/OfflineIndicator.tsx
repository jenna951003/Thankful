'use client'

import { useOfflineStorage } from '../../hooks/useOfflineStorage'

export default function OfflineIndicator() {
  const { isOnline, hasPendingSyncs, pendingSyncs } = useOfflineStorage()

  if (isOnline && !hasPendingSyncs) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div style={{ paddingTop: 'var(--actual-safe-top)' }}>
        {!isOnline && (
          <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-medium">
            🔴 오프라인 모드 - 데이터는 온라인 상태가 되면 동기화됩니다
          </div>
        )}
        
        {hasPendingSyncs && (
          <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
            ⏳ {pendingSyncs.length}개의 노트가 동기화 대기 중
          </div>
        )}
      </div>
    </div>
  )
}