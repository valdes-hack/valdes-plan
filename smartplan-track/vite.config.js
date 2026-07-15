// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Service Worker custom — gère le push background
      strategies: 'injectManifest',
      srcDir:     'public',
      filename:   'sw.js',
      registerType: 'autoUpdate',
      manifest: false, // manifest.json géré manuellement
      injectManifest: {
        // Ne pas injecter __WB_MANIFEST dans le SW custom (il n'utilise pas Workbox)
        injectionPoint: undefined,
      },
      devOptions: {
        enabled:  true,
        type:     'module',
      },
    }),
  ],

  resolve: {
    alias: {
      '@':           path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages':      path.resolve(__dirname, './src/pages'),
      '@store':      path.resolve(__dirname, './src/store'),
      '@services':   path.resolve(__dirname, './src/services'),
      '@utils':      path.resolve(__dirname, './src/utils'),
      '@hooks':      path.resolve(__dirname, './src/hooks'),
      '@types':      path.resolve(__dirname, './src/types'),
      '@styles':     path.resolve(__dirname, './src/styles'),
      '@assets':     path.resolve(__dirname, './src/assets'),
    },
  },

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir:    'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          state:  ['zustand'],
          db:     ['dexie'],
        },
      },
    },
  },
})
