// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node'; // 👈 Importado para desarrollo

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  // Usa Vercel en producción, Node.js en desarrollo
  adapter: import.meta.env.PROD ? vercel() : node({ mode: 'standalone' }),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  // Opcional: Define el puerto para desarrollo
  server: {
    port: 4321,
    host: true
  }
});