import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // App Router에서는 i18n 설정을 middleware에서 처리

  // Next.js Image 최적화 설정
  images: {
    qualities: [75, 100], // quality 100 지원 추가
  },

  // Capacitor 관련 모듈은 클라이언트에서만 실행되도록 설정 (Next.js 15+ 방식)
  serverExternalPackages: ['@capacitor/core', '@capacitor/haptics'],
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트에서만 Capacitor 모듈 해결
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Capacitor 모듈을 서버 사이드에서 제외
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('@capacitor/core', '@capacitor/haptics')
    }

    return config
  }
}

export default nextConfig