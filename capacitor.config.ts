import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pokemongalaxy.app',
  appName: 'Pokemon Galaxy',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
