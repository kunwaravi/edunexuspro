import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Master task §23 — vendor splitting.
        //
        // Route-level splitting was already in place (every page is a lazy
        // import), but the entry chunk still carried every third-party library:
        // ~503 kB raw / 150 kB gzip on the critical path, re-downloaded by every
        // user whenever a single line of app code changed. Splitting the three
        // big, slow-moving dependencies into their own chunks means a normal
        // deploy invalidates only the app chunk; framework code stays cached.
        //
        // Deliberately conservative — only libraries with a large size and a
        // near-zero change rate are grouped. Anything the app imports heavily
        // (axios, lucide-react) is left to the bundler, which already splits
        // lucide icons into one tiny chunk per icon.
        //
        // Function form, not the object map: Vite 8 bundles with Rolldown, which
        // rejects `manualChunks: { name: [...] }` outright.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return 'vendor-react';
          }
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) {
            return 'vendor-motion';
          }
        },
      },
    },
  },
})
