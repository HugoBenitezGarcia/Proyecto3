// Llamadas a la API

var BASE_URL    = 'https://zelda.fanapis.com/api';
var PREFIJO_CACHE = 'zelda_cache_';

// Busca personajes o monstruos
export async function searchEntities(tipo, busqueda) {
    var termino = busqueda.trim().toLowerCase();

    if (termino.length < 2) {
        return [];
    }


    // petición a la API
    var url = BASE_URL + '/' + tipo + '?name=' + encodeURIComponent(termino) + '&limit=12';
    var respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error('Error HTTP ' + respuesta.status);
    }

    var datos = await respuesta.json();

    if (!datos.success) {
        throw new Error('La API devolvio una respuesta inesperada.');
    }

    var resultados = datos.data;
    if (resultados === undefined) {
        resultados = [];
    }

    return resultados;
}

// Borra la caché de búsquedas Zelda
export function clearCache() {
    var claves = Object.keys(localStorage);
    var i;
    for (i = 0; i < claves.length; i++) {
        if (claves[i].indexOf(PREFIJO_CACHE) === 0) {
            localStorage.removeItem(claves[i]);
        }
    }
}
