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
    minify: true,
    rollupOptions: {
      external: ['spark-md5'],
      output: {
        // exports: 'named', // 保留默认行为
        globals: {
          'spark-md5': 'SparkMD5'
        }
      }
    }
  }
})
