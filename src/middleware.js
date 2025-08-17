// Para usar la API de Middleware en Astro, utilizamos casting a 'any' cuando accedemos a locals.lang
// en lugar de definir tipos adicionales

import { defineMiddleware } from 'astro:middleware';
import { languages, defaultLanguage } from './i18n/languages';

// Función vacía para depuración (desactivada en producción)
function logDebug() { }

// Definimos nuestra función middleware
export const onRequest = defineMiddleware(async (context, next) => {
    try {
        // Extendemos el objeto locals con nuestra propiedad lang
        if (!context.locals) {
            context.locals = {};
        }

        // Accedemos a locals como un objeto genérico para evitar errores de tipado
        const customLocals = context.locals;

        // Determinar idioma: cookie > localStorage > URL > navegador > default
        let detectedLang = defaultLanguage;

        // 1. Intentar obtener el idioma de las cookies primero (tiene prioridad)
        try {
            if (context.cookies && context.cookies.get) {
                const langCookie = context.cookies.get('LANG');
                if (langCookie && languages.includes(langCookie.value)) {
                    detectedLang = langCookie.value;
                    logDebug('Idioma detectado desde cookie:', detectedLang);
                }
            }
        } catch (cookieError) {
            console.error('Error al leer cookie de idioma:', cookieError);
        }

        // 2. Si no hay cookie, intentar detectar de la URL
        if (detectedLang === defaultLanguage) {
            try {
                const pathname = context.url.pathname;

                // Buscar idioma en URL (ej: /en/about)
                const urlLang = languages.find((lang) => {
                    return lang !== defaultLanguage && new RegExp(`^/${lang}(/|$)`).test(pathname);
                });

                if (urlLang) {
                    detectedLang = urlLang;
                    logDebug('Idioma detectado desde URL:', detectedLang);
                }
            } catch (urlError) {
                console.error('Error al detectar idioma de URL:', urlError);
            }
        }

        // 3. Detectar idioma del navegador como último recurso
        if (detectedLang === defaultLanguage && context.request && context.request.headers) {
            try {
                const acceptLang = context.request.headers.get('accept-language');
                if (acceptLang) {
                    // Extraer los códigos de idioma preferidos
                    const browserLangs = acceptLang.split(',')
                        .map(lang => lang.split(';')[0].trim().substring(0, 2));

                    // Encontrar el primer idioma soportado
                    const matchedLang = languages.find(lang => browserLangs.includes(lang));
                    if (matchedLang) {
                        detectedLang = matchedLang;
                        logDebug('Idioma detectado desde navegador:', detectedLang);
                    }
                }
            } catch (browserLangError) {
                console.error('Error al detectar idioma del navegador:', browserLangError);
            }
        }

        // Guardar el idioma detectado en locals
        customLocals.lang = detectedLang;
        logDebug('Idioma final asignado:', detectedLang);

        // Establecer o actualizar la cookie de idioma
        try {
            if (context.cookies && context.cookies.set) {
                context.cookies.set('LANG', detectedLang, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365, // 1 año
                    httpOnly: false, // Permitir acceso desde JavaScript
                    secure: context.url.protocol === 'https:', // Solo HTTPS en producción
                    sameSite: 'lax'
                });
                logDebug('Cookie de idioma establecida:', detectedLang);
            }
        } catch (cookieSetError) {
            console.error('Error al establecer cookie de idioma:', cookieSetError);
        }
    } catch (error) {
        console.error("Error en middleware de idioma:", error);
        // En caso de error, establecer el idioma predeterminado
        if (context.locals) {
            context.locals.lang = defaultLanguage;
        }
    }

    // Continuar con la solicitud
    return next();
});
