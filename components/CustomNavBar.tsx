'use client';

import { Home, Plus, Bookmark, Settings, X, Users } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import { useState } from 'react';

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
  const [isWriteMode, setIsWriteMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handlePlusClick = () => {
    if (isWriteMode) {
      // X 버튼 클릭 시 부드러운 사라짐 애니메이션
      setIsClosing(true);
      setTimeout(() => {
        setShowCreateModal(false);
        setIsWriteMode(false);
        setIsClosing(false);
      }, 600); // 애니메이션 완전 종료까지 대기
    } else {
      setShowCreateModal(true);
      setIsWriteMode(true);
    }
  };

  const handleCreateOption = (type: string) => {
    // 옵션 선택 시에도 부드러운 사라짐 애니메이션
    setIsClosing(true);
    setTimeout(() => {
      setShowCreateModal(false);
      setIsWriteMode(false);
      setIsClosing(false);
      if (onTabChange) {
        onTabChange('write');
        console.log('Creating:', type);
      }
    }, 600);
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
    backgroundColor: isWriteMode && !isClosing ? '#d76060' : '#6f906f',
    config: {
      tension: 300,
      friction: 25
    }
  });

  const backdropSpring = useSpring({
    opacity: showCreateModal && !isClosing ? 1 : 0,
    config: {
      tension: 150,
      friction: 35
    }
  });

  return (
    <>
      {/* 모달 - 캡슐 메뉴바와 정확히 동일한 구조 */}
      {(showCreateModal || isClosing) && (
        <div className="fixed left-0 right-0 z-50 px-6" style={{ bottom: '130px' }}>
          <animated.div
            className="flex justify-center"
            style={{
              ...modalSpring,
              transformOrigin: 'center bottom',
              overflow: 'hidden'
            }}
          >
            <div className="bg-slate-700 rounded-2xl px-4 py-4 border border-slate-600 w-[448px]">
            <div className="space-y-3">
              <button
                onClick={() => handleCreateOption('gratitude')}
                className="w-full px-4 py-3 text-left rounded-xl hover:bg-white/10 transition-colors duration-300"
              >
                <div className="text-white font-medium font-jua text-lg">🙏 감사노트</div>
                <div className="text-gray-300 text-sm font-noto-serif-kr">감사한 일들을 기록해요</div>
              </button>
              <button
                onClick={() => handleCreateOption('sermon')}
                className="w-full px-4 py-3 text-left rounded-xl hover:bg-white/10 transition-colors duration-300"
              >
                <div className="text-white font-medium font-jua text-lg">📖 설교노트</div>
                <div className="text-gray-300 text-sm font-noto-serif-kr">말씀과 은혜를 기록해요</div>
              </button>
              <button
                onClick={() => handleCreateOption('prayer')}
                className="w-full px-4 py-3 text-left rounded-xl hover:bg-white/10 transition-colors duration-300"
              >
                <div className="text-white font-medium font-jua text-lg">🤲 기도노트</div>
                <div className="text-gray-300 text-sm font-noto-serif-kr">기도제목을 적어요</div>
              </button>
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
            // 백드롭 클릭 시에도 부드러운 사라짐 애니메이션
            setIsClosing(true);
            setTimeout(() => {
              setShowCreateModal(false);
              setIsWriteMode(false);
              setIsClosing(false);
            }, 600);
          }}
        />
      )}

      {/* 네비게이션 바 - 448px 너비로 고정 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <animated.div
          className="flex justify-center"
          style={navBarSpring}
        >
          <div className="bg-slate-700 backdrop-blur-xl rounded-full px-8 py-2 shadow-2xl w-[448px]">
            <div className="flex items-center w-full">
              <div className="flex items-center space-x-4 flex-1 justify-end">
                <button
                  onClick={() => handleTabClick('home')}
                  className={`p-2.5 transition-all duration-300 ease-out rounded-full outline-none ${
                    activeTab === 'home'
                      ? 'text-white bg-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Home size={20} strokeWidth={2} />
                </button>
                <button
                  onClick={() => handleTabClick('community')}
                  className={`p-2.5 transition-all duration-300 ease-out rounded-full outline-none ${
                    activeTab === 'community'
                      ? 'text-white bg-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Users size={20} strokeWidth={2} />
                </button>
              </div>

              <div className="flex justify-center px-6">
                <animated.button
                  onClick={handlePlusClick}
                  className="p-3.5 my-1 rounded-full text-white outline-none"
                  style={{
                    ...buttonColorSpring,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    width: '46px',
                    height: '46px'
                  }}
                >
                  <div className="flex items-center justify-center">
                    <animated.div
                      className="absolute flex items-center justify-center"
                      style={plusIconSpring}
                    >
                      <Plus size={22} strokeWidth={3} />
                    </animated.div>
                    <animated.div
                      className="absolute flex items-center justify-center"
                      style={xIconSpring}
                    >
                      <X size={22} strokeWidth={3} />
                    </animated.div>
                  </div>
                </animated.button>
              </div>

              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={() => handleTabClick('saved')}
                  className={`p-2.5 transition-all duration-300 ease-out rounded-full outline-none ${
                    activeTab === 'saved'
                      ? 'text-white bg-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Bookmark size={20} strokeWidth={2} />
                </button>
                <button
                  onClick={() => handleTabClick('settings')}
                  className={`p-2.5 transition-all duration-300 ease-out rounded-full outline-none ${
                    activeTab === 'settings'
                      ? 'text-white bg-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Settings size={20} strokeWidth={2} />
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