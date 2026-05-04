import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  base: '/quoa/', // 👈 أضف هذا السطر تحديداً (اسم المستودع بين slash)
  plugins: [react()],
  optimizeDeps: {
    include: ['@react-pdf/renderer', 'pako'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})
