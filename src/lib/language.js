import { atom } from 'nanostores';

export const currentLanguage = atom('es'); // Idioma predeterminado: Español

export function changeLanguage(lang) {
    currentLanguage.set(lang);
    localStorage.setItem('language', lang);

    // Guarda la URL actual
    const currentPath = window.location.pathname;

    // Actualizar la página sin cambiar la ruta
    // Solo recarga la página con el mismo path
    try {
        window.location.reload();
    } catch (error) {
        console.error("Error al recargar la página:", error);
        // Como plan B, redirigir a la misma URL
        window.location.href = currentPath;
    }
}

// Inicializar el idioma según la preferencia guardada
export function initLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage.set(savedLanguage);
    }
}
