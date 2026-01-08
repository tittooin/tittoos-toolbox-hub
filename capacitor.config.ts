import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.axevora.tools',
  appName: 'Axevora Tools',
  webDir: 'dist',
  server: {
    url: 'https://axevora.com/',
    androidScheme: 'https'
  }
};

export default config;
