import { atom } from 'nanostores';

// Inicializamos con modo oscuro por defecto
export const isDarkMode = atom(true);

// Función para comprobar si el tema debe ser oscuro (para uso interno)
function shouldBeDarkTheme() {
    if (typeof window === 'undefined') return true; // Por defecto oscuro incluso en SSR

    // Comprobar preferencia guardada (pero solo permitir cambio si el usuario explícitamente eligió tema claro)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') return false;

    // En todos los demás casos, usar tema oscuro
    return true;
}

export function toggleDarkMode() {
    try {
        // Solo ejecutar en el cliente
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        console.log('toggleDarkMode: Alternando tema');

        // Obtener el estado actual y calcular el nuevo estado
        const currentDarkMode = isDarkMode.get();
        const newDarkMode = !currentDarkMode;

        console.log(`toggleDarkMode: Cambiando de ${currentDarkMode ? 'oscuro' : 'claro'} a ${newDarkMode ? 'oscuro' : 'claro'}`);

        // Cambiar el estado en el store
        isDarkMode.set(newDarkMode);

        const newTheme = newDarkMode ? 'dark' : 'light';

        // Actualizar el atributo data-theme en el body para CSS
        document.body.setAttribute('data-theme', newTheme);

        // Actualiza la clase en el elemento html de forma forzada
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            // Forzar actualización de elementos específicos
            document.querySelectorAll('.bg-white, .bg-gray-100, .bg-gray-200, .text-gray-800, .text-gray-600').forEach(el => {
                el.classList.add('theme-updated');
                setTimeout(() => el.classList.remove('theme-updated'), 50);
            });
        } else {
            document.documentElement.classList.remove('dark');
            // Forzar actualización de elementos específicos
            document.querySelectorAll('[class*="dark:"]').forEach(el => {
                el.classList.add('theme-updated');
                setTimeout(() => el.classList.remove('theme-updated'), 50);
            });
        }

        console.log(`toggleDarkMode: Clase 'dark' ${document.documentElement.classList.contains('dark') ? 'aplicada' : 'eliminada'} del HTML`);

        // Intentar guardar en localStorage
        try {
            localStorage.setItem('theme', newTheme);
            console.log(`toggleDarkMode: Tema '${newTheme}' guardado en localStorage`);

            // También guardar en una cookie para SSR
            document.cookie = `theme=${newTheme};path=/;max-age=31536000`;
        } catch (e) {
            console.error('Error al guardar tema en localStorage:', e);
        }

        // Mostrar indicador visual del cambio de tema
        try {
            const indicator = document.getElementById('theme-status-indicator');
            if (indicator) {
                indicator.classList.remove('hidden');
                indicator.style.backgroundColor = newDarkMode ? '#ffffff' : '#000000';
                indicator.title = newDarkMode ? 'Tema Oscuro Activo' : 'Tema Claro Activo';

                setTimeout(() => {
                    indicator.classList.add('hidden');
                }, 5000);
            }
        } catch (e) {
            console.error('Error al actualizar el indicador de tema:', e);
        }

        // Disparar eventos personalizados para diferentes consumidores
        try {
            // 1. Evento para Layout.astro
            document.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme: newTheme }
            }));

            // 2. Evento para componentes React
            window.dispatchEvent(new CustomEvent('theme-changed', {
                detail: { theme: newTheme }
            }));

            console.log(`toggleDarkMode: Eventos de cambio de tema disparados`);
        } catch (e) {
            console.error('Error al disparar eventos de cambio de tema:', e);

            // Plan B: Asegurarse de actualizar directamente las clases CSS
            if (newDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        // Forzar un repintado del DOM
        setTimeout(() => {
            const temp = document.body.style.display;
            document.body.style.display = 'none';
            document.body.offsetHeight; // Truco para forzar repintado
            document.body.style.display = temp;
            console.log('toggleDarkMode: Forzado repintado del DOM');
        }, 50);

        return newDarkMode; // Devolver el nuevo estado
    } catch (error) {
        console.error('Error al cambiar el tema:', error);
        return isDarkMode.get(); // Devolver el estado actual en caso de error
    }
}

// Función para inicializar el tema según la preferencia guardada o el sistema
export function initTheme() {
    try {
        // Solo ejecutar en el cliente
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        console.log('Inicializando tema...');

        // Determinar si debe usar tema oscuro
        const shouldUseDarkTheme = shouldBeDarkTheme();

        console.log('Tema detectado:', shouldUseDarkTheme ? 'oscuro' : 'claro');

        // Actualizar el estado global
        isDarkMode.set(shouldUseDarkTheme);

        // Aplicar el tema a la interfaz
        if (shouldUseDarkTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Registrar un observador para los cambios en la preferencia del sistema
        try {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // Definir una función para manejar los cambios en la preferencia del sistema
            const handleSystemThemeChange = (e) => {
                // Solo actualizar si no hay tema guardado explícitamente
                if (!localStorage.getItem('theme')) {
                    const newDarkMode = e.matches;
                    isDarkMode.set(newDarkMode);

                    if (newDarkMode) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }

                    console.log('Tema del sistema cambiado a:', newDarkMode ? 'oscuro' : 'claro');
                }
            };

            // Verificar si el navegador soporta addEventListener para mediaQuery
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleSystemThemeChange);
            } else if (mediaQuery.addListener) {
                // Fallback para navegadores más antiguos
                mediaQuery.addListener(handleSystemThemeChange);
            }
        } catch (e) {
            console.error('Error al configurar detector de cambio de tema del sistema:', e);
        }

        console.log('Tema inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar el tema:', error);
    }
}
