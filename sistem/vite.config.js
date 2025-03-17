import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist'  // This is where Vercel expects the build output
  },
  plugins: [react()]
})
