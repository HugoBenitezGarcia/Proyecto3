// Llamadas a la API

const BASE_URL = 'https://zelda.fanapis.com/api';
const PREFIJO_CACHE = 'zelda_cache_';

// Busca personajes o monstruos
export async function searchEntities(tipo, busqueda) {
    const termino = busqueda.trim().toLowerCase();

    if (termino.length < 2) {
        return [];
    }

    const claveCache = `${PREFIJO_CACHE}${tipo}_${termino}`;

    const datosGuardados = localStorage.getItem(claveCache);

    if (datosGuardados) {
        return JSON.parse(datosGuardados);
    }

    const url = `${BASE_URL}/${tipo}?name=${encodeURIComponent(termino)}&limit=12`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    if (!datos.success) {
        throw new Error('La API devolvio una respuesta inesperada.');
    }

    let resultados = datos.data;
    if (resultados === undefined) {
        resultados = [];
    }

    localStorage.setItem(claveCache, JSON.stringify(resultados));

    return resultados;
}

export function clearCache() {
    const claves = Object.keys(localStorage);

    for (const clave of claves) {
        if (clave.startsWith(PREFIJO_CACHE)) {
            localStorage.removeItem(clave);
        }
    }
}