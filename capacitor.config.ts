import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'thankful',
  webDir: 'public',
  backgroundColor: '#eeead9', // 베이지색 배경 (rgb(238, 234, 217))
  server: {
    androidScheme: 'https',
    url: 'http://localhost:3000'
  },
  ios: {
    backgroundColor: '#eeead9'
  },
  android: {
    backgroundColor: '#eeead9'
  }
};

export default config;
