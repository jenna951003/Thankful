import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'thankful',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    url: 'http://localhost:3000'
  }
};

export default config;
