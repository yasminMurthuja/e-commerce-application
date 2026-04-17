import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'], // ← add this
  },

  server: {
    port: 3000,
    proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '') // strips /api before forwarding
  }
}
  }
})
