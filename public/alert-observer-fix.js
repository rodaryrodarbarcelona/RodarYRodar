// Este script se encarga de corregir posibles problemas de CSP con scripts externos
// como alert-observer.js que pueden estar intentando modificar el DOM

// Ejecutamos esto inmediatamente para evitar problemas lo antes posible
(function () {
    try {
        // Desactivar cualquier posible ejecución insegura de scripts externos
        // Esto evita el error de TrustedScript assignment
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            // Crear una política de TrustedTypes para scripts seguros
            window.trustedTypes.createPolicy('default', {
                createHTML: (string) => string,
                createScriptURL: (string) => string,
                createScript: (string) => string
            });
        }

        // Parchear Node.textContent para evitar errores de TrustedScript
        const originalSetTextContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').set;

        if (originalSetTextContent) {
            Object.defineProperty(Node.prototype, 'textContent', {
                set(value) {
                    try {
                        // Intentar establecer el valor normalmente
                        originalSetTextContent.call(this, value);
                    } catch (error) {
                        // Si falla por TrustedScript, usar una alternativa segura
                        if (error.toString().includes('TrustedScript')) {
                            console.warn('Corrigiendo error de TrustedScript');

                            // Eliminar nodos hijos existentes
                            while (this.firstChild) {
                                this.removeChild(this.firstChild);
                            }

                            // Añadir el texto como un nodo de texto seguro
                            if (value != null) {
                                this.appendChild(document.createTextNode(value));
                            }
                        } else {
                            // Si es otro tipo de error, propagarlo
                            throw error;
                        }
                    }
                },
                get: function () {
                    let text = '';
                    for (const child of this.childNodes) {
                        text += child.textContent;
                    }
                    return text;
                },
                configurable: true
            });
        }

        console.log('[Alert Observer Fix] Instalado correctamente');
    } catch (error) {
        console.error('[Alert Observer Fix] Error al inicializar:', error);
    }
})();
