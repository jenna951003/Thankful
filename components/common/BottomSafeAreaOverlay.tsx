'use client'

import { useDeviceDetection } from '../../hooks/useDeviceDetection'

interface BottomSafeAreaOverlayProps {
  className?: string
}

export default function BottomSafeAreaOverlay({ className = '' }: BottomSafeAreaOverlayProps) {
  const { safeArea } = useDeviceDetection()

  // 세이프존이 없으면 렌더링하지 않음
  if (safeArea.bottom <= 0) return null

  // 그라데이션 영역 높이 (세이프존 + 추가 페이드 영역)
  const gradientHeight = safeArea.bottom + 20

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 pointer-events-none ${className}`}
      style={{
        height: `${gradientHeight}px`,
        background: `linear-gradient(to top, var(--bg-base) 0%, var(--bg-base) ${Math.max(0, (safeArea.bottom / gradientHeight) * 70)}%, transparent 100%)`
      }}
    />
  )
}