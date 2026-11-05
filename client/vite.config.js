import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Explicitly separate core framework libraries into their own chunk
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Safely adjust the warning limit for modern web applications
    chunkSizeWarningLimit: 1000,
  },
});