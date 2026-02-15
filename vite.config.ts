// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/', // <--- ADD THIS LINE. It's the key to fixing 404s.
  server: {
    proxy: {
      // Proxy /api requests to the remote backend during development to avoid CORS.
      '/api': {
        target: 'https://college-cohatmi-college-1.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})