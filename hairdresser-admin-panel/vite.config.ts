/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../hairdresser-backend/public"
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // browser: {
    //   enabled: true,
    //   name: "chrome"
    // },
    setupFiles: './src/tests/setup.ts',
    // css: true
  }
})
