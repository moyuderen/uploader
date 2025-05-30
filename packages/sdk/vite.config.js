import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  server: {
    open: '/examples/quick-start/index.html'
  },
  build: {
    lib: {
      entry: './src/index.js',
      name: 'UploaderSdk',
      fileName: 'sdk'
    },
    minify: true
  }
})
