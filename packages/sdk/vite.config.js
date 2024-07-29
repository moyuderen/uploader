import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  server: {
    open: '/example/index.html'
  },
  build: {
    lib: {
      entry: './src/index.js',
      // formats: ['es', 'umd'],
      name: 'UploaderSdk',
      fileName: 'sdk'
    },
    minify: true
  }
})
