import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { currentLanguage } from "../lib/language";
import { ui, defaultLanguage } from "../i18n/languages";

export function useI18n(forcedLang) {
  const [mounted, setMounted] = useState(false);

  // Si estamos renderizando en el servidor o no montado aún, usar el idioma por defecto
  // para evitar errores de hidratación
  const langFromStore = useStore(currentLanguage);

  // Usar el idioma forzado si se proporciona, de lo contrario usar el store
  // pero solo después de que el componente se haya montado
  const lang = forcedLang || (mounted ? langFromStore : defaultLanguage);

  useEffect(() => {
    // Marcar como montado después del primer renderizado
    setMounted(true);
  }, []);

  // Función de traducción
  const t = (key) => {
    // Verificar si el idioma existe, si no usar el idioma predeterminado
    const selectedLang = ui[lang] ? lang : defaultLanguage;
    // Verificar si la clave existe en el idioma seleccionado
    return ui[selectedLang] && ui[selectedLang][key] !== undefined
      ? ui[selectedLang][key]
      : key;
  };

  return { lang, t };
}
