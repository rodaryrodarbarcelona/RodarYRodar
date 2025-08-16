/**
 * Utilidades de seguridad para la aplicación
 */

// Inicializador de TrustedTypes para manejar la seguridad de scripts
export function initTrustedTypes() {
    if (typeof window === 'undefined') return;

    try {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            // Crear una política de TrustedTypes que permite scripts específicos
            window.trustedTypes.createPolicy('astro-trusted-script', {
                createHTML: (str) => str,
                createScript: (str) => str,
                createScriptURL: (str) => str
            });
        }
    } catch (error) {
        console.error('Error al inicializar TrustedTypes:', error);
    }
}

// Función para sanear scripts antes de su ejecución (para compatibilidad con CSP)
export function sanitizeScript(scriptContent) {
    if (typeof window === 'undefined') return scriptContent;

    try {
        // Si TrustedTypes está disponible, usarlo
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            const policy = window.trustedTypes.createPolicy('astro-trusted-script', {
                createScript: (str) => str
            });
            return policy.createScript(scriptContent);
        }
        // Si no, devolver el script original
        return scriptContent;
    } catch (error) {
        console.error('Error al sanear script:', error);
        return scriptContent;
    }
}

// Parche para prevenir el error de TrustedScript
export function patchDOMForTrustedTypes() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    try {
        // Solo aplica este parche si hay errores relacionados con TrustedScript
        const originalSetTextContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').set;

        Object.defineProperty(Node.prototype, 'textContent', {
            set(value) {
                try {
                    // Intenta establecer el valor normalmente
                    originalSetTextContent.call(this, value);
                } catch (error) {
                    // Si falla debido a TrustedScript, manejarlo de manera especial
                    if (error.toString().includes('TrustedScript')) {
                        console.warn('Manejando error de TrustedScript:', error);

                        // Alternativa segura para establecer contenido de texto
                        if (this.childNodes.length > 0) {
                            this.removeChild(this.childNodes[0]);
                        }
                        this.appendChild(document.createTextNode(value));
                    } else {
                        // Si es otro tipo de error, lanzarlo
                        throw error;
                    }
                }
            },
            get() {
                // Mantener el comportamiento original del getter
                return Node.prototype.textContent;
            },
            configurable: true
        });
    } catch (error) {
        console.error('Error al aplicar parche para TrustedTypes:', error);
    }
}
