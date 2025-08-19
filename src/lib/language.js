import { atom } from "nanostores";
import { languages, defaultLanguage } from "../i18n/languages";

export const currentLanguage = atom("es"); // Idioma predeterminado: Español

export function getLanguageFromUrl(url) {
  // Si estamos en el servidor, verificar la cookie
  if (typeof document === "undefined") {
    const cookieLang = url.headers?.get("cookie")?.match(/LANG=([^;]+)/)?.[1];
    if (cookieLang && languages.includes(cookieLang)) {
      return cookieLang;
    }
  }

  // Verificar localStorage
  if (typeof localStorage !== "undefined") {
    const localLang = localStorage.getItem("language");
    if (localLang && languages.includes(localLang)) {
      return localLang;
    }
  }

  // Si no hay un idioma establecido, usar el predeterminado
  return defaultLanguage;
}

export function changeLanguage(lang) {
  // Establecer el nuevo idioma en el store
  currentLanguage.set(lang);

  try {
    // Guardar en localStorage si está disponible
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("language", lang);
    }

    // Aplicar el cambio de idioma inmediatamente para componentes del lado del cliente
    document.documentElement.setAttribute("lang", lang);

    // En lugar de hacer un reload completo, que puede causar problemas,
    // vamos a establecer una cookie para que el servidor recoja el idioma
    document.cookie = `LANG=${lang};path=/;max-age=31536000`;

    // Recargar después de un pequeño retraso para asegurar que todos los cambios
    // se apliquen correctamente
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    console.error("Error al cambiar el idioma:", error);
    try {
      // Último recurso: recarga simple
      window.location.reload();
    } catch (e) {
      console.error("Error crítico al cambiar el idioma:", e);
    }
  }
}

// Inicializar el idioma según la preferencia guardada
export function initLanguage() {
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) {
    currentLanguage.set(savedLanguage);
  }
}
