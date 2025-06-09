import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/var.scss";`
      }
    }
  },
  build: {
    lib: {
      entry: './src/index.js',
      name: 'Uploader',
      fileName: 'tinyuploader-vue'
    },
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', 'spark-md5'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
