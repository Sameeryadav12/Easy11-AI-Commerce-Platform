import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@vendor': resolve(__dirname, './src'),
      '@web': resolve(__dirname, '../web/frontend/src'),
      react: resolve(__dirname, './node_modules/react'),
      'react-dom': resolve(__dirname, './node_modules/react-dom'),
    },
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '..'), resolve(__dirname, '../web/frontend')],
    },
  },
})
