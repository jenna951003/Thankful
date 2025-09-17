'use client';

import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface SafeAreaVisualizerProps {
  showInProduction?: boolean; // 프로덕션에서도 표시할지 여부 (기본 false)
}

export default function SafeAreaVisualizer({ showInProduction = false }: SafeAreaVisualizerProps) {
  const { isWebEnvironment } = useDeviceDetection();

  // 개발 환경이거나 showInProduction이 true일 때만 표시
  const shouldShow = (process.env.NODE_ENV === 'development' || showInProduction) && isWebEnvironment;

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {/* 상단 세이프존 시각화 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--actual-safe-top)',
          backgroundColor: 'blue',
          opacity: '0.8',
          zIndex: 1000,
          pointerEvents: 'none' // 클릭 이벤트 차단
        }}
      />

      {/* 하단 세이프존 시각화 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--actual-safe-bottom)',
          backgroundColor: 'blue',
          opacity: '0.8',
          zIndex: 1000,
          pointerEvents: 'none' // 클릭 이벤트 차단
        }}
      />

      {/* 세이프존 정보 표시 (우측 상단) - 디버그 텍스트 제거 */}
      {/* 디버그 텍스트는 제거하고 파란색 세이프존만 유지 */}
    </>
  );
}