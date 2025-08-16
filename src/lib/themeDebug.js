// Utilidades para depurar problemas con el tema oscuro/claro
// Incluye este archivo y llama a checkThemeState() desde la consola del navegador
// para obtener un diagnóstico completo del estado actual del tema

/**
 * Comprueba y muestra el estado actual del tema en todos los lugares relevantes
 */
export function checkThemeState() {
    console.group('🔍 Diagnóstico del tema claro/oscuro');

    // 1. Estado actual del HTML
    const isDarkHtml = document.documentElement.classList.contains('dark');
    console.log(`🌐 HTML classList: ${isDarkHtml ? 'dark' : 'light'}`);

    // 2. Estado en localStorage
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
        console.log(`💾 localStorage: ${savedTheme || 'no definido'}`);
    } catch (e) {
        console.error('❌ Error al acceder a localStorage:', e);
    }

    // 3. Preferencia del sistema
    let systemPreference = null;
    try {
        systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        console.log(`🖥️ Preferencia del sistema: ${systemPreference}`);
    } catch (e) {
        console.error('❌ Error al detectar preferencia del sistema:', e);
    }

    // 4. Estado global (si existe)
    let storeState = null;
    try {
        if (window.isDarkMode && typeof window.isDarkMode.get === 'function') {
            storeState = window.isDarkMode.get() ? 'dark' : 'light';
            console.log(`🗃️ Estado global (store): ${storeState}`);
        } else {
            console.log('ℹ️ Estado global (store): no disponible en window');
        }
    } catch (e) {
        console.error('❌ Error al acceder al estado global:', e);
    }

    // 5. Comprobación de CSS variables específicas de Tailwind
    const bodyBgColor = getComputedStyle(document.body).backgroundColor;
    console.log(`🎨 Color de fondo del body: ${bodyBgColor}`);

    // 6. Inicialización del tema
    console.log(`🚀 Tema inicializado: ${window.themeInitialized ? 'Sí' : 'No'}`);

    // 7. Diagnóstico de consistencia
    console.log('\n📊 Análisis de consistencia:');

    // Comparar HTML con localStorage
    if (savedTheme) {
        const htmlMatchesStorage = (savedTheme === 'dark') === isDarkHtml;
        console.log(`- HTML y localStorage coinciden: ${htmlMatchesStorage ? '✅ Sí' : '❌ No'}`);
    } else {
        console.log(`- HTML y preferencia del sistema coinciden: ${(systemPreference === 'dark') === isDarkHtml ? '✅ Sí' : '❌ No'}`);
    }

    // Comparar con estado global
    if (storeState) {
        console.log(`- HTML y estado global coinciden: ${(storeState === 'dark') === isDarkHtml ? '✅ Sí' : '❌ No'}`);
    }

    console.groupEnd();

    // Devolver recomendaciones
    if (savedTheme && (savedTheme === 'dark') !== isDarkHtml) {
        return '⚠️ Inconsistencia detectada: el tema en localStorage no coincide con el HTML. Intenta recargar la página o llamar a toggleDarkMode().';
    } else if (!savedTheme && (systemPreference === 'dark') !== isDarkHtml) {
        return '⚠️ Inconsistencia detectada: el tema del sistema no coincide con el HTML. Intenta recargar la página.';
    } else if (storeState && (storeState === 'dark') !== isDarkHtml) {
        return '⚠️ Inconsistencia detectada: el estado global no coincide con el HTML. Intenta llamar a toggleDarkMode().';
    } else {
        return '✅ Todo parece estar funcionando correctamente.';
    }
}

/**
 * Intenta corregir cualquier inconsistencia en el estado del tema
 */
export function fixThemeState() {
    console.group('🔧 Intentando corregir el estado del tema');

    try {
        // Detectar qué tema debería estar activado
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        // Estado actual
        const isDark = document.documentElement.classList.contains('dark');

        console.log(`Estado actual: ${isDark ? 'oscuro' : 'claro'}`);
        console.log(`Estado deseado: ${shouldBeDark ? 'oscuro' : 'claro'}`);

        // Corregir si hay inconsistencia
        if (isDark !== shouldBeDark) {
            console.log('Corrigiendo inconsistencia...');

            // Actualizar clases
            if (shouldBeDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            // Actualizar estado global si está disponible
            if (window.isDarkMode && typeof window.isDarkMode.set === 'function') {
                window.isDarkMode.set(shouldBeDark);
                console.log('Estado global actualizado');
            }

            // Disparar eventos para notificar el cambio
            try {
                const theme = shouldBeDark ? 'dark' : 'light';

                document.dispatchEvent(new CustomEvent('themeChanged', {
                    detail: { theme }
                }));

                window.dispatchEvent(new CustomEvent('theme-changed', {
                    detail: { theme }
                }));

                console.log('Eventos de cambio de tema disparados');
            } catch (e) {
                console.error('Error al disparar eventos:', e);
            }

            console.log('Corrección completada');
        } else {
            console.log('No se detectaron inconsistencias');
        }
    } catch (e) {
        console.error('Error al intentar corregir el estado del tema:', e);
    }

    console.groupEnd();
}

// Exponer funciones globalmente para acceso desde la consola
if (typeof window !== 'undefined') {
    window.checkThemeState = checkThemeState;
    window.fixThemeState = fixThemeState;
}

/**
 * Función para inicializar las herramientas de depuración del tema
 * Llama a esta función desde cualquier componente para tener acceso a las herramientas de depuración
 */
export function initThemeDebugTools() {
    if (typeof window !== 'undefined') {
        window.checkThemeState = checkThemeState;
        window.fixThemeState = fixThemeState;
        console.log('🛠️ Herramientas de depuración de tema inicializadas. Usa checkThemeState() y fixThemeState() en la consola.');
    }
}
