import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  esbuild: {
    // ✅ Ignore warning in production build
    logLevel: 'silent'
  }
})
