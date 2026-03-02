/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          // Merge first-screen UI into one chunk (Button, ErrorState, SearchBar, etc.)
          if (
            id.includes('/shared/ui/') ||
            id.includes('/shared/lib/errorMessages') ||
            (id.includes('/design-system/') && !id.includes('ThemeToggle'))
          ) {
            return 'ui-core'
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
