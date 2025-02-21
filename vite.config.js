import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["xlsx"],
  },
  build: {
    rollupOptions: {
      external: ["fs"], // If using `xlsx` in the backend, exclude `fs`
    },
  },
})
