import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'TinyUploaderVueNext',
      fileName: 'tiny-uploader-vuenext'
    },
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: 'vue'
      }
    }
  }
})
