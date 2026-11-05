import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Splits vendor libraries into separate chunks by folder name
            const packageName = id.toString().split('node_modules/')[1].split('/')[0];
            return `vendor-${packageName}`;
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});