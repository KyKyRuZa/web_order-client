import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Установим постоянный порт 3000
    host: true,  // Позволяем доступ с других устройств в сети
    strictPort: false, // Не выдавать ошибку, если порт занят
  },
})
