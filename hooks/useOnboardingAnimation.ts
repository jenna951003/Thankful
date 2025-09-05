'use client'

import { useState, useEffect, useCallback } from 'react'

export type AnimationState = 'entering' | 'visible' | 'exiting' | 'transitioning'

export interface OnboardingAnimationReturn {
  animationState: AnimationState
  exitAndNavigate: (callback: () => void, onImageTransitionStart?: () => void) => void
  isAnimating: boolean
}

export const useOnboardingAnimation = (enterDelay: number = 50): OnboardingAnimationReturn => {
  const [animationState, setAnimationState] = useState<AnimationState>('entering')
  const [isAnimating, setIsAnimating] = useState(false)

  // 페이지 진입 시 자동으로 visible 상태로 전환
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('visible')
    }, enterDelay)

    return () => clearTimeout(timer)
  }, [enterDelay])

  // 안전한 순차 처리 방식의 퇴장 후 네비게이션
  const exitAndNavigate = useCallback((callback: () => void, onImageTransitionStart?: () => void) => {
    if (isAnimating) return // 이미 애니메이션 중이면 무시
    
    setIsAnimating(true)
    
    // Step 1: 페이드아웃 시작
    setAnimationState('exiting')
    
    // Step 2: 페이드아웃 완료 대기 (CSS transition 0.3s + 안전 마진)
    setTimeout(() => {
      // Step 3: 페이드아웃 완료 확인 후 네비게이션
      callback() // 라우터 전환
      
      // 새 페이지가 자동으로 entering 상태로 시작됨
      // useEffect에서 visible로 자동 전환
      setIsAnimating(false)
    }, 350) // CSS transition 300ms + 50ms 안전 마진
  }, [isAnimating])

  return {
    animationState,
    exitAndNavigate,
    isAnimating
  }
}