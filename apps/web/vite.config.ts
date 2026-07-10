import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Respeta PORT (lo asigna el preview); por defecto 5173.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    proxy: {
      // En dev, el frontend reenvía /api al servidor Hono.
      '/api': 'http://localhost:8787',
    },
  },
});
