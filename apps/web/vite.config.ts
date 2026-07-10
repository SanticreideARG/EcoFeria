import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // En dev, el frontend reenvía /api al servidor Hono.
      '/api': 'http://localhost:8787',
    },
  },
});
