import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // Proxy all /api requests to backend
    },
  },
  build: {
    sourcemap: false, //  Prevents source maps from being generated
  },
})
