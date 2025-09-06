// 온보딩 플로우에서 실제로 사용되는 이미지들만
export const ONBOARDING_IMAGES = [
  // 체크 아이콘 (선택 표시용)
  '/Check3.png',
  
  // 웰컴 스크린
  '/Welcome3.png',
  
  // 경험 선택 페이지
  '/Forest.png', '/Tree.png', '/Gross.png',
  
  // 관심 영역 선택 아이콘들 (실제 사용되는 1-8번)
  '/1.png', '/2.png', '/3.png', '/4.png', 
  '/5.png', '/6.png', '/7.png', '/8.png',
  
  // 사용 목적 선택
  '/Church.png', '/Family.png', '/Note.png', '/Sermon.png',
  
  // 알림 설정
  '/Morning.png', '/Night.png',
  
  // 첫 감사 페이지
  '/Tip2.png',
  
  // 구독 페이지
  '/Premium3.png', '/PremiumBox3.png', '/Price2.png',
  
  // 완료 페이지
  '/Complete.png',
  
  // 로딩 및 로고
  '/Loading1.png', '/Logo2.png',
  
  // 성장 이미지 시리즈 (온보딩 하단에 사용되는 것들)
  '/Grow1.webp', '/Grow2.webp', '/Grow3.webp', '/Grow4.webp',
  '/Grow5.webp', '/Grow6.webp', '/Grow7.webp', '/Grow8.webp',
];

/**
 * 이미지들을 WebView 캐시로 미리 로드하는 함수
 * @param imageUrls 프리로드할 이미지 URL 배열
 * @returns Promise that resolves when all images are loaded or attempted
 */
export const preloadImages = async (imageUrls: string[]): Promise<void> => {
  console.log(`🖼️ Starting preload of ${imageUrls.length} images...`);
  
  const loadPromises = imageUrls.map((url, index) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        console.log(`✅ Preloaded [${index + 1}/${imageUrls.length}]: ${url}`);
        resolve();
      };
      
      img.onerror = () => {
        console.warn(`⚠️ Failed to preload [${index + 1}/${imageUrls.length}]: ${url}`);
        resolve(); // 실패해도 계속 진행
      };
      
      img.src = url; // WebView 캐시에 로드
    });
  });
  
  await Promise.allSettled(loadPromises);
  console.log('🎉 Image preloading completed!');
};

/**
 * 진행률과 함께 이미지를 프리로드하는 함수
 * @param imageUrls 프리로드할 이미지 URL 배열
 * @param onProgress 진행률 콜백 함수 (0-1 사이 값)
 * @returns Promise that resolves when all images are loaded or attempted
 */
export const preloadImagesWithProgress = async (
  imageUrls: string[], 
  onProgress?: (progress: number) => void
): Promise<void> => {
  console.log(`🖼️ Starting preload of ${imageUrls.length} images with progress tracking...`);
  
  let completedCount = 0;
  
  const loadPromises = imageUrls.map((url, index) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      
      const handleComplete = () => {
        completedCount++;
        const progress = completedCount / imageUrls.length;
        onProgress?.(progress);
        resolve();
      };
      
      img.onload = () => {
        console.log(`✅ Preloaded [${index + 1}/${imageUrls.length}]: ${url}`);
        handleComplete();
      };
      
      img.onerror = () => {
        console.warn(`⚠️ Failed to preload [${index + 1}/${imageUrls.length}]: ${url}`);
        handleComplete();
      };
      
      img.src = url;
    });
  });
  
  await Promise.allSettled(loadPromises);
  console.log('🎉 Image preloading with progress completed!');
};