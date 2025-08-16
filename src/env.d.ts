/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_MONGO_URI: string;
  // Define aquí otras variables de entorno
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    lang?: string;
    // Otras propiedades que quieras añadir a locals
  }
}
