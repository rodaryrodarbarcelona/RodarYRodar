import React from 'react';
import { ui, defaultLanguage } from '../i18n/languages';

export function useI18n(lang = defaultLanguage) {
    function t(key) {
        // Verificar si el idioma existe, si no usar el idioma predeterminado
        const selectedLang = ui[lang] ? lang : defaultLanguage;
        // Verificar si la clave existe en el idioma seleccionado
        return ui[selectedLang] && ui[selectedLang][key] !== undefined
            ? ui[selectedLang][key]
            : key;
    }

    return { t, lang: ui[lang] ? lang : defaultLanguage };
}
