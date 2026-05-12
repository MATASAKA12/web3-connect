import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../wallet-modal-build', // Build to parent directory
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'wallet-modal.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  base: './' // Important for relative paths
})