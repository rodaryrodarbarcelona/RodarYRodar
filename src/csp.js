// Políticas de Seguridad de Contenido (CSP)
// Esto ayudará a prevenir ataques XSS y otros problemas de seguridad

export const cspDirectives = {
    'default-src': ["'self'"],
    // Permitir más fuentes de scripts y eliminar require-trusted-types-for para evitar errores
    'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://www.youtube.com",
        "https://s.ytimg.com",
        "https://i.ytimg.com",
        "https://*.mongodb.net",
        "https://cdn.jsdelivr.net"
    ],
    'style-src': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    'img-src': [
        "'self'",
        "data:",
        "blob:",
        "https://res.cloudinary.com",
        "https://www.youtube.com",
        "https://img.youtube.com",
        "https://i.ytimg.com"
    ],
    'font-src': ["'self'", "data:", "https://cdn.jsdelivr.net"],
    'connect-src': ["'self'", "https://*.mongodb.net", "wss://*.mongodb.net"],
    'media-src': ["'self'", "blob:", "https://www.youtube.com"],
    'frame-src': ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    // Comentamos estas directivas que pueden estar causando el error
    // 'trusted-types': ["'default'", "dompurify"],
    // 'require-trusted-types-for': ["'script'"],
    'upgrade-insecure-requests': []
};

// Función para generar el header CSP
export function generateCSP() {
    return Object.entries(cspDirectives)
        .map(([key, values]) => {
            if (values.length === 0) {
                return key;
            }
            return `${key} ${values.join(' ')}`;
        })
        .join('; ');
}
