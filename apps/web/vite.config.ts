import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Respeta PORT (lo asigna el preview); por defecto 5173.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    proxy: {
      // En dev, /api/* se reenvía al servidor Hono, que expone las rutas en la raíz.
      // En prod, VITE_API_URL apunta al origen del proyecto API en Vercel.
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
