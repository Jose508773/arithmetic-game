import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// import path from 'path'; // Remove this import if no longer needed

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      // Alias problematic react-native/Libraries imports to shims
      'react-native/Libraries/Image/resolveAssetSource': path.resolve(__dirname, 'src/shims/resolveAssetSource.ts'),
      'react-native/Libraries/Utilities/codegenNativeComponent': path.resolve(__dirname, 'src/shims/codegenNativeComponent.ts'),
      // Ensure react-native-safe-area-context uses its web entry
      'react-native-safe-area-context': path.resolve(__dirname, 'node_modules/react-native-safe-area-context/lib/module/index.js'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'react-native-sound', // Exclude react-native-sound from web bundle
      ],
    },
  },
});
