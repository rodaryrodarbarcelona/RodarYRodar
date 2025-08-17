/**
 * Gestiona los slugs únicos para las películas
 */
class SlugManager {
    constructor() {
        // Mapa para contar ocurrencias de cada slug base
        this.slugCounts = {};
        // Mapa para almacenar la relación slug -> id
        this.slugToId = {};
        // Mapa para almacenar la relación id -> slug
        this.idToSlug = {};
        // Todas las películas registradas
        this.allFilms = [];
        // Flag para saber si ya inicializamos
        this.initialized = false;
    }

    /**
     * Inicializa el SlugManager con todas las películas para asegurar que los slugs
     * sean únicos incluso entre múltiples cargas de página
     * @param {Array} films - Array de películas con ID y título
     * @param {Function} titleGetter - Función para obtener el título según el idioma
     */
    initializeWithFilms(films, titleGetter) {
        if (this.initialized) return;

        this.allFilms = [...films];
        this.initialized = true;

        // Registrar todos los slugs de una vez para asegurar unicidad
        films.forEach(film => {
            const title = titleGetter ? titleGetter(film) : film.titulo;
            const baseSlug = generateSlug(title);
            this.registerSlug(baseSlug, film._id.toString());
        });


    }    /**
     * Registra una película y devuelve un slug único
     * @param {string} baseSlug - El slug base generado del título
     * @param {string} id - El ID de la película
     * @returns {string} - El slug único para esta película
     */
    registerSlug(baseSlug, id) {
        // Si este ID ya tiene un slug asignado, devolverlo
        if (this.idToSlug[id]) {
            return this.idToSlug[id];
        }

        // Inicializar contador si no existe
        if (!this.slugCounts[baseSlug]) {
            this.slugCounts[baseSlug] = 0;
        }

        // Incrementar contador
        this.slugCounts[baseSlug]++;

        // Generar slug único sin ID
        let uniqueSlug = baseSlug;
        if (this.slugCounts[baseSlug] > 1) {
            uniqueSlug = `${baseSlug}-${this.slugCounts[baseSlug]}`;
        }

        // Almacenar las relaciones
        this.slugToId[uniqueSlug] = id;
        this.idToSlug[id] = uniqueSlug;


        return uniqueSlug;
    }

    /**
     * Retorna el estado actual del SlugManager (útil para depuración)
     */
    debug() {
        return {
            initialized: this.initialized,
            slugCounts: this.slugCounts,
            slugToId: this.slugToId,
            idToSlug: this.idToSlug
        };
    }

    /**
     * Busca un ID a partir de un slug
     * @param {string} slug - El slug a buscar
     * @returns {string|null} - El ID asociado al slug o null si no existe
     */
    getIdFromSlug(slug) {
        return this.slugToId[slug] || null;
    }

    /**
     * Busca un slug a partir de un ID
     * @param {string} id - El ID a buscar
     * @returns {string|null} - El slug asociado al ID o null si no existe
     */
    getSlugFromId(id) {
        return this.idToSlug[id] || null;
    }
}

// Instancia global del gestor de slugs
export const slugManager = new SlugManager();

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
