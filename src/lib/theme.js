import { atom } from 'nanostores';

export const isDarkMode = atom(false);

export function toggleDarkMode() {
    isDarkMode.set(!isDarkMode.get());

    const newTheme = isDarkMode.get() ? 'dark' : 'light';

    // Actualiza la clase en el elemento html
    if (isDarkMode.get()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }

    // Disparar un evento personalizado que Layout.astro pueda escuchar
    document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: newTheme }
    }));
}

// Función para inicializar el tema según la preferencia guardada o el sistema
export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        isDarkMode.set(true);
        document.documentElement.classList.add('dark');
    } else {
        isDarkMode.set(false);
        document.documentElement.classList.remove('dark');
    }
}
