/**
 * Convierte un título en un slug adecuado para URL
 * @param {string} text - El texto a convertir en slug
 * @returns {string} El slug generado
 */
export function generateSlug(text) {
    if (!text) return '';

    return text
        .toLowerCase()
        .trim()
        .replace(/[\u00C0-\u017F]/g, a => {
            // Reemplazar caracteres acentuados con sus equivalentes sin acento
            const characterMap = {
                'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a',
                'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
                'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
                'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o',
                'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
                'ñ': 'n', 'ç': 'c'
            };
            return characterMap[a] || a;
        })
        .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales que no sean guiones o espacios
        .replace(/\s+/g, '-')     // Reemplazar espacios con guiones
        .replace(/--+/g, '-')     // Evitar guiones dobles
        .replace(/^-+/, '')       // Eliminar guiones al principio
        .replace(/-+$/, '');      // Eliminar guiones al final
}

/**
 * Almacena una relación entre slugs y IDs para poder buscar eficientemente
 * @type {Map<string, string>}
 */
export const slugToIdMap = new Map();

/**
 * Almacena una relación entre IDs y slugs para poder redireccionar adecuadamente
 * @type {Map<string, string>}
 */
export const idToSlugMap = new Map();
