// Para usar la API de Middleware en Astro, necesitamos configurar correctamente el tipo para locals
// Crear archivo src/env.d.ts para definir los tipos

import { defineMiddleware } from 'astro:middleware';
import { languages } from './i18n/languages';

// Definimos nuestra función middleware
export const onRequest = defineMiddleware(async (context, next) => {
    // Extendemos el objeto locals con nuestra propiedad lang
    if (!context.locals) {
        context.locals = {};
    }

    // Accedemos a locals como un objeto genérico para evitar errores de tipado
    const customLocals = context.locals;

    // Obtener idioma de la URL
    const pathname = context.url.pathname;

    // Detectar idioma de la URL
    const detectedLang = languages.find((lang) => {
        // Comprobar si la URL comienza con el prefijo del idioma
        return lang !== 'es' && new RegExp(`^/${lang}(/|$)`).test(pathname);
    }) || 'es';

    // Guardar el idioma detectado en locals
    customLocals.lang = detectedLang;

    // Continuar con la solicitud
    return next();
});
