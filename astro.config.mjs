// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // Añadir configuración para manejar errores
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Suprimir advertencias específicas si es necesario
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          warn(warning);
        }
      }
    },
    // Mejorar el reporte de errores
    logLevel: 'info'
  },

  integrations: [react()],

  // Configuración para el manejo de 404 y errores
  output: 'server',

  // Configurar la gestión de páginas no encontradas
  server: {
    host: true
  }
});