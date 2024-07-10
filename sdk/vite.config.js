import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.js',
      formats: ['es', 'umd'],
      name: 'TinyUploaderSdk',
      fileName: '@tinyuploader/sdk'
    },
    minify: true
  }
})
