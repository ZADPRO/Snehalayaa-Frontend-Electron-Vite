import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src') // ✅ fix alias path
    }
  },
  build: {
    outDir: 'dist-web',
    emptyOutDir: true
  }
})
