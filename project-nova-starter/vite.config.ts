import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5174, // Let's stick to 5173 for consistency
    watch: {
      usePolling: true,
    },
    // --- ADD THIS PROXY CONFIGURATION ---
    proxy: {
      // any request to a path starting with /api will be forwarded
      '/api': {
        // forward it to our backend server
        target: 'http://localhost:8080',
        // this is crucial for the proxy to work correctly
        changeOrigin: true,
      }
    }
    // ------------------------------------
  },
})