import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/var.scss";`
      }
    }
  },
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
