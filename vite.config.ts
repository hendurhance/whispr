import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
      // interval: 100,
    },
  },
  plugins: [react()],
})
