import { atom } from 'nanostores';

export const isDarkMode = atom(false);

export function toggleDarkMode() {
    try {
        // Solo ejecutar en el cliente
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        // Cambiar el estado en el store
        isDarkMode.set(!isDarkMode.get());

        const newTheme = isDarkMode.get() ? 'dark' : 'light';

        // Actualiza la clase en el elemento html
        if (isDarkMode.get()) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Intentar guardar en localStorage
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.error('Error al guardar tema en localStorage:', e);
        }

        // Disparar un evento personalizado que Layout.astro pueda escuchar
        try {
            document.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme: newTheme }
            }));
        } catch (e) {
            console.error('Error al disparar evento themeChanged:', e);

            // Plan B: Actualizar directamente las clases CSS
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    } catch (error) {
        console.error('Error al cambiar el tema:', error);
    }
}

// Función para inicializar el tema según la preferencia guardada o el sistema
export function initTheme() {
    try {
        // Solo ejecutar en el cliente
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        let savedTheme = null;
        let prefersDark = false;

        // Intentar obtener tema guardado
        try {
            savedTheme = localStorage.getItem('theme');
        } catch (e) {
            console.error('Error al acceder a localStorage:', e);
        }

        // Intentar detectar preferencia del sistema
        try {
            prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch (e) {
            console.error('Error al detectar preferencia de color del sistema:', e);
        }

        // Aplicar el tema
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            isDarkMode.set(true);
            document.documentElement.classList.add('dark');
        } else {
            isDarkMode.set(false);
            document.documentElement.classList.remove('dark');
        }
    } catch (error) {
        console.error('Error al inicializar el tema:', error);
    }
}
