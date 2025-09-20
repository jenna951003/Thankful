'use client';

import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useSpring, animated } from '@react-spring/web';
import { useState, useRef, useEffect } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface CustomNavBarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showWithAnimation?: boolean;
}

export default function CustomNavBar({
  activeTab = 'home',
  onTabChange,
  showWithAnimation = true
}: CustomNavBarProps) {
  const { isTabletSize, isSmallSize } = useDeviceDetection();
  const [isWriteMode, setIsWriteMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 탭별 이미지 경로 생성 함수
  const getImagePath = (tabName: string, isActive: boolean): string => {
    const suffix = isActive ? '' : '2';
    return `/B${tabName}${suffix}.png`;
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, []);

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handlePlusClick = () => {
    // 애니메이션 진행 중이면 클릭 무시
    if (isAnimating) return;

    // 기존 타이머가 있으면 정리
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    // 애니메이션 시작
    setIsAnimating(true);

    if (isWriteMode) {
      // X 버튼 클릭 시 부드러운 사라짐 애니메이션
      setIsClosing(true);
      animationTimeoutRef.current = setTimeout(() => {
        setShowCreateModal(false);
        setIsWriteMode(false);
        setIsClosing(false);
        setIsAnimating(false); // 애니메이션 완료
        animationTimeoutRef.current = null;
      }, 800); // 애니메이션 완전 종료까지 대기
    } else {
      setShowCreateModal(true);
      setIsWriteMode(true);
      // + 버튼은 즉시 완료
      setIsAnimating(false);
    }
  };

  const handleCreateOption = (type: string) => {
    // 애니메이션 진행 중이면 클릭 무시
    if (isAnimating) return;

    // 기존 타이머가 있으면 정리
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    // 애니메이션 시작
    setIsAnimating(true);

    // 옵션 선택 시에도 부드러운 사라짐 애니메이션
    setIsClosing(true);
    animationTimeoutRef.current = setTimeout(() => {
      setShowCreateModal(false);
      setIsWriteMode(false);
      setIsClosing(false);
      setIsAnimating(false); // 애니메이션 완료
      animationTimeoutRef.current = null;
      if (onTabChange) {
        onTabChange('write');
        console.log('Creating:', type);
      }
    }, 800);
  };

  const navBarSpring = useSpring({
    opacity: showWithAnimation ? 1 : 0,
    transform: showWithAnimation ? 'translateY(0px)' : 'translateY(20px)',
    config: {
      tension: 200,
      friction: 20
    }
  });

  const modalSpring = useSpring({
    opacity: showCreateModal && !isClosing ? 1 : 0,
    transform: showCreateModal && !isClosing
      ? 'scaleY(1)'
      : isClosing
        ? 'scaleY(1)' // 닫힐 때는 스케일 유지하고 페이드아웃만
        : 'scaleY(0)',
    maxHeight: showCreateModal && !isClosing
      ? '300px'
      : isClosing
        ? '300px' // 닫힐 때는 높이 유지하고 페이드아웃만
        : '0px',
    config: {
      tension: 220,
      friction: 28
    }
  });

  const plusIconSpring = useSpring({
    opacity: isWriteMode && !isClosing ? 0 : 1,
    transform: isWriteMode && !isClosing ? 'rotate(90deg)' : 'rotate(0deg)',
    config: {
      tension: 400,
      friction: 25
    }
  });

  const xIconSpring = useSpring({
    opacity: isWriteMode && !isClosing ? 1 : 0,
    transform: isWriteMode && !isClosing ? 'rotate(0deg)' : 'rotate(-90deg)',
    config: {
      tension: 400,
      friction: 25
    }
  });

  const buttonColorSpring = useSpring({
    backgroundColor: isWriteMode && !isClosing ? '#c67171' : '#5e8d61',
    config: {
      tension: 300,
      friction: 25
    }
  });

  const backdropSpring = useSpring({
    opacity: showCreateModal && !isClosing ? 1 : 0,
    config: {
      tension: 300,
      friction: 25
    }
  });

  return (
    <>
      {/* 모달 - 캡슐 메뉴바와 정확히 동일한 구조 */}
      {(showCreateModal || isClosing) && (
        <div className="fixed left-0 right-0 z-50 px-6" style={{ bottom: '112px' }}>
          <animated.div
            className="flex justify-center"
            style={{
              ...modalSpring,
              transformOrigin: 'center bottom',
              overflow: 'hidden'
            }}
          >
            <div className="bg-[#fafffa] rounded-2xl px-4 py-4 w-[320px]">
            <div className="space-y-3">
              <div className="bg-[#64975e] rounded-xl p-1">
                <button
                  onClick={() => handleCreateOption('gratitude')}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full px-4 py-3 text-left rounded-xl transition-colors duration-300 select-none"
                  style={{
                    touchAction: 'pan-y',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <div className="text-white font-medium font-jua text-lg select-none" style={{
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none'
                  }}>🙏 감사노트</div>
                  <div className="text-gray-100 text-sm font-noto-serif-kr">감사한 일들을 기록해요</div>
                </button>
              </div>
              <div className="bg-[#75975e] rounded-xl p-1">
                <button
                  onClick={() => handleCreateOption('sermon')}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full px-4 py-3 text-left rounded-xl transition-colors duration-300 select-none"
                  style={{
                    touchAction: 'pan-y',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <div className="text-white font-medium font-jua text-lg">📖 설교노트</div>
                  <div className="text-gray-100 text-sm font-noto-serif-kr">말씀과 은혜를 기록해요</div>
                </button>
              </div>
              <div className="bg-[#9cb179] rounded-xl p-1">
                <button
                  onClick={() => handleCreateOption('prayer')}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full px-4 py-3 text-left rounded-xl transition-colors duration-300 select-none"
                  style={{
                    touchAction: 'pan-y',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <div className="text-white font-medium font-jua text-lg">🤲 기도노트</div>
                  <div className="text-gray-100 text-sm font-noto-serif-kr">기도제목을 적어요</div>
                </button>
              </div>
            </div>
            </div>
          </animated.div>
        </div>
      )}

      {/* 백드롭 */}
      {(showCreateModal || isClosing) && (
        <animated.div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
          style={backdropSpring}
          onClick={() => {
            // 애니메이션 진행 중이면 클릭 무시
            if (isAnimating) return;

            // 기존 타이머가 있으면 정리
            if (animationTimeoutRef.current) {
              clearTimeout(animationTimeoutRef.current);
              animationTimeoutRef.current = null;
            }

            // 애니메이션 시작
            setIsAnimating(true);

            // 백드롭 클릭 시에도 부드러운 사라짐 애니메이션
            setIsClosing(true);
            animationTimeoutRef.current = setTimeout(() => {
              setShowCreateModal(false);
              setIsWriteMode(false);
              setIsClosing(false);
              setIsAnimating(false); // 애니메이션 완료
              animationTimeoutRef.current = null;
            }, 800);
          }}
        />
      )}

      {/* 네비게이션 바 - 448px 너비로 고정 */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 px-2 select-none ${
        isTabletSize ? 'pb-4' : isSmallSize ? 'pb-2' : 'pb-0 -mb-2'
      }`}>
        <animated.div
          className="flex justify-center"
          style={navBarSpring}
        >
          <div className={`bg-[#68865f] select-none backdrop-blur-xl  shadow-lg w-[320px] ${isTabletSize ? 'px-12 py-3 rounded-4xl' : 'px-2 py-0 rounded-4xl'}`}>
            <div className="flex items-center w-full">
              <div className={`flex items-center flex-1 justify-end ${isTabletSize ? 'space-x-6' : 'space-x-2'}`}>
                <button
                  onClick={() => handleTabClick('home')}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`p-3 transition-all duration-500 ease-out rounded-full outline-none active:scale-95 select-none ${
                    activeTab === 'home'
                      ? 'bg-gray-200'
                      : ''
                  }`}
                  style={{
                    touchAction: 'pan-y',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <Image
                    src={getImagePath('Home', activeTab === 'home')}
                    alt="Home"
                    width={isTabletSize ? 28 : 24}
                    height={isTabletSize ? 28 : 24}
                    className={`select-none ${activeTab === 'home' ? 'opacity-100' : 'opacity-70'}`}
                    priority={activeTab === 'home'}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </button>
                <button
                  onClick={() => handleTabClick('community')}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`p-3 transition-all duration-500 ease-out rounded-full outline-none active:scale-95 select-none ${
                    activeTab === 'community'
                      ? 'bg-gray-200'
                      : ''
                  }`}
                  style={{
                    touchAction: 'pan-y',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <Image
                    src={getImagePath('Community', activeTab === 'community')}
                    alt="Community"
                    width={isTabletSize ? 28 : 24}
                    height={isTabletSize ? 28 : 24}
                    className={`select-none ${activeTab === 'community' ? 'opacity-100' : 'opacity-70'}`}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </button>
              </div>

              <div className={`flex justify-center ${isTabletSize ? 'px-8' : 'px-6'}`}>
                <animated.button
                  onClick={handlePlusClick}
                  onContextMenu={(e) => e.preventDefault()}
                  className="p-3.5 my-1 rounded-full text-white outline-none active:scale-95 transition-all duration-300 select-none"
                  style={{
                    ...buttonColorSpring,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    width: '52px',
                    height: '52px',
                    touchAction: 'pan-y',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <div className="flex items-center justify-center">
                    <animated.div
                      className="absolute flex items-center justify-center"
                      style={plusIconSpring}
                    >
                      <Plus size={22} strokeWidth={3.5} />
                    </animated.div>
                    <animated.div
                      className="absolute flex items-center justify-center"
                      style={xIconSpring}
                    >
                      <X size={22} strokeWidth={3.5} />
                    </animated.div>
                  </div>
                </animated.button>
              </div>

              <div className={`flex items-center flex-1 ${isTabletSize ? 'space-x-6' : 'space-x-4'}`}>
                <button
                  onClick={() => handleTabClick('saved')}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`p-3 transition-all duration-500 ease-out rounded-full outline-none active:scale-95 select-none ${
                    activeTab === 'saved'
                      ? 'bg-gray-200'
                      : ''
                  }`}
                  style={{
                    touchAction: 'pan-y',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <Image
                    src={getImagePath('Save', activeTab === 'saved')}
                    alt="Saved"
                    width={isTabletSize ? 28 : 24}
                    height={isTabletSize ? 28 : 24}
                    className={`select-none ${activeTab === 'saved' ? 'opacity-100' : 'opacity-70'}`}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </button>
                <button
                  onClick={() => handleTabClick('settings')}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`p-3 transition-all duration-500 ease-out rounded-full outline-none active:scale-95 select-none ${
                    activeTab === 'settings'
                      ? 'bg-gray-200'
                      : ''
                  }`}
                  style={{
                    touchAction: 'pan-y',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <Image
                    src={getImagePath('Setting', activeTab === 'settings')}
                    alt="Settings"
                    width={isTabletSize ? 28 : 24}
                    height={isTabletSize ? 28 : 24}
                    className={`select-none ${activeTab === 'settings' ? 'opacity-100' : 'opacity-70'}`}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </button>
              </div>
            </div>
          </div>
        </animated.div>

        {/* Safe area bottom padding */}
        <div
          style={{
            height: 'var(--actual-safe-bottom, env(safe-area-inset-bottom, 0px))',
          }}
        />
      </div>
    </>
  );
}