import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
  server: {
    port: 8080,
    host: true, // or [IP_ADDRESS]
    strictPort: false,
    hmr: {
      host: "localhost",
    },
  },
})
