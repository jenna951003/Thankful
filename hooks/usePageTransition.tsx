'use client';

import { useState, useEffect, useRef } from 'react';
import { useSpring } from '@react-spring/web';

interface PageTransitionState {
  showTopSection: boolean;
  showMiddleSection: boolean;
  showBottomSection: boolean;
  showNavigation: boolean;
}

interface PageTransitionReturn {
  pageOpacity: any;
  topSectionProps: any;
  middleSectionProps: any;
  bottomSectionProps: any;
  navigationProps: any;
  isAnimationComplete: boolean;
}

export function usePageTransition(isEnabled: boolean = true): PageTransitionReturn {
  const animationExecutedRef = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // 애니메이션 상태
  const [animationState, setAnimationState] = useState<PageTransitionState>({
    showTopSection: !isEnabled,
    showMiddleSection: !isEnabled,
    showBottomSection: !isEnabled,
    showNavigation: !isEnabled,
  });

  const [isAnimationComplete, setIsAnimationComplete] = useState(!isEnabled);

  // 전체 페이지 투명도
  const pageOpacity = useSpring({
    opacity: isEnabled ? 1 : 1,
    config: { tension: 300, friction: 30 }
  });

  // 상단 섹션 애니메이션
  const topSectionProps = useSpring({
    opacity: animationState.showTopSection ? 1 : 0,
    transform: animationState.showTopSection ? 'translateY(0px)' : 'translateY(-20px)',
    config: { tension: 280, friction: 22 }
  });

  // 중간 섹션 애니메이션
  const middleSectionProps = useSpring({
    opacity: animationState.showMiddleSection ? 1 : 0,
    transform: animationState.showMiddleSection ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 260, friction: 24 }
  });

  // 하단 섹션 애니메이션
  const bottomSectionProps = useSpring({
    opacity: animationState.showBottomSection ? 1 : 0,
    transform: animationState.showBottomSection ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 240, friction: 26 }
  });

  // 네비게이션 애니메이션
  const navigationProps = useSpring({
    opacity: animationState.showNavigation ? 1 : 0,
    transform: animationState.showNavigation ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 220, friction: 28 }
  });

  // 스테거드 애니메이션 실행
  useEffect(() => {
    if (!isEnabled || animationExecutedRef.current) {
      return;
    }

    console.log('🎭 Starting staggered page transition animation');
    animationExecutedRef.current = true;

    // 기존 타이머 정리
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];

    // 스테거드 애니메이션 실행
    const timer1 = setTimeout(() => {
      console.log('🎭 Showing top section');
      setAnimationState(prev => ({ ...prev, showTopSection: true }));
    }, 100);

    const timer2 = setTimeout(() => {
      console.log('🎭 Showing middle section');
      setAnimationState(prev => ({ ...prev, showMiddleSection: true }));
    }, 250);

    const timer3 = setTimeout(() => {
      console.log('🎭 Showing bottom section');
      setAnimationState(prev => ({ ...prev, showBottomSection: true }));
    }, 400);

    const timer4 = setTimeout(() => {
      console.log('🎭 Showing navigation');
      setAnimationState(prev => ({ ...prev, showNavigation: true }));
    }, 550);

    const timer5 = setTimeout(() => {
      console.log('🎭 Page transition animation completed');
      setIsAnimationComplete(true);
    }, 800);

    timersRef.current = [timer1, timer2, timer3, timer4, timer5];

    // Cleanup
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
    };
  }, [isEnabled]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  return {
    pageOpacity,
    topSectionProps,
    middleSectionProps,
    bottomSectionProps,
    navigationProps,
    isAnimationComplete
  };
}