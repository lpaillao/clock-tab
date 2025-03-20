import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Cambiar a 'esbuild' que viene incluido en Vite por defecto
    minify: 'esbuild',
    // O desactivar completamente la minificación: minify: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'chart': ['chart.js'],
          'vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['chart.js']
  },
  server: {
    host: '0.0.0.0',
    open: true
  }
})
