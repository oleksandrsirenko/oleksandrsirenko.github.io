// File: vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Base public path when served in production
  base: '/',
  // Configure project aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './src/assets'),
      '@styles': resolve(__dirname, './src/styles'),
      '@js': resolve(__dirname, './src/js')
    }
  },
  // Build options
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  // Dev server options
  server: {
    port: 3000,
    open: true,
    cors: true
  }
});