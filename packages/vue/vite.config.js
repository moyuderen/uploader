import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue2()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: './src/index.js',
      name: 'Uploader',
      fileName: 'tinyUploader-vue'
    },
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: 'Vue'
      }
    }
  }
})
