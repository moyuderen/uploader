import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const alias = [
  {
    find: /^\@tinyuploader\/vuenext$/,
    replacement: path.resolve('../packages/vue-next/src/', 'index.js')
  }
]

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias
  }
})
