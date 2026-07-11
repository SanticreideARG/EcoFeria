import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// Origen absoluto de la API en build time (mismo criterio que apps/web/src/lib/api.ts).
// Solo se usa para el runtime caching de workbox; en dev (relativo) se omite.
const apiOrigin = process.env.VITE_API_URL?.trim();
const isAbsoluteApi = Boolean(apiOrigin?.startsWith('http'));
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png'],
      manifest: {
        name: 'La Ecoferia',
        short_name: 'Ecoferia',
        description: 'Marketplace de productos sustentables del Alto Valle, Patagonia.',
        lang: 'es',
        theme_color: '#506049',
        background_color: '#fbf9f4',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Catálogo offline-friendly (RF-09): solo se agrega la regla si la API
        // tiene un origen absoluto (prod) — en dev, con Vite proxy, no aplica.
        runtimeCaching: isAbsoluteApi
          ? [
              {
                urlPattern: new RegExp(
                  `^${escapeRegExp(apiOrigin!)}/(brands|products|categories|blog|events)(/|\\?|$)`,
                ),
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'ecoferia-catalog',
                  expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
            ]
          : [],
      },
    }),
  ],
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
