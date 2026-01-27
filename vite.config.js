import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],

  server: {
    port: 3000,           // Установим постоянный порт 3000
    host: false,          // Ограничить доступ только локально (безопаснее)
    strictPort: false,    // Не выдавать ошибку, если порт занят
    open: false,          // Не открывать браузер автоматически
    hmr: {
      overlay: true       // Показывать ошибки поверх приложения
    }
  },

  build: {
    target: 'esnext',     // Использовать самые современные возможности JS
    minify: 'terser',     // Использовать terser для минификации
    cssMinify: true,      // Минифицировать CSS
    sourcemap: false,     // Отключить sourcemaps в продакшене для уменьшения размера

    rollupOptions: {
      output: {
        manualChunks: {
          // Разделение кода для оптимизации загрузки
          'react-core': ['react', 'react-dom'],
          'ui-lib': ['@fortawesome/fontawesome-free'],
          'network': ['axios'],
        },
        chunkFileNames: 'assets/chunk-[hash].js', // Уникальные имена для чанков
        entryFileNames: 'assets/[name]-[hash].js', // Уникальные имена для точек входа
        assetFileNames: (assetInfo) => {
          // Организация файлов по типам
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name]-[hash].css'
          }
          if (assetInfo.name.match(/\.(png|jpe?g|gif|svg|webp)$/)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (assetInfo.name.match(/\.(woff2?|eot|ttf|otf)$/)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },

    // Оптимизация сборки
    cssCodeSplit: true,   // Разделение CSS для лучшей загрузки
    modulePreload: {
      polyfill: false     // Отключить полифил для module preload
    },
    reportCompressedSize: true, // Показывать сжатый размер файлов
    assetsInlineLimit: 4096,    // Размер в байтах, до которого ресурсы будут встроены в код
  },

  // Оптимизация для разработки
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    // Оптимизация для продакшена
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },

  // Кэширование и оптимизация
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'axios',
      '@fortawesome/fontawesome-free'
    ],
    // Экспериментальные оптимизации
    force: false,
  },

  // Пути к ресурсам
  resolve: {
    alias: {
      // Алиасы для удобства импорта
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@api': resolve(__dirname, 'src/api'),
      '@context': resolve(__dirname, 'src/context'),
      '@utils': resolve(__dirname, 'src/utils'),
    }
  },

  // Оптимизация для продакшена
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },

  // Настройки для улучшения производительности
  preview: {
    port: 3000,
    host: false // Ограничить доступ только локально
  },

  // Настройки для улучшения безопасности и SEO
  ssr: {
    noExternal: ['@fortawesome/fontawesome-free'] // Не исключать из SSR определенные зависимости
  }
})
