import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'Uploader',
      fileName: 'tinyuploader-vuenext'
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
