import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/estudiantes/',
  // Sin manualChunks para evitar duplicación de React
})