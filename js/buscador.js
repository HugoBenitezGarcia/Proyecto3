import { searchEntities } from './api.js';
import { getFavorites, addFavorite, removeFavorite } from './firebase.js';
import { debounce, setStatus, hideStatus, buildEntityCard } from './ui.js';

// Usamos const para los elementos del HTML porque no van a reasignarse 
const input = document.getElementById('search-input');
const selectorTipo = document.getElementById('type-select');
const cuadricula = document.getElementById('results-grid');
const mensajeEstado = document.getElementById('status');

// Usamos let para las listas porque su contenido se va a sobreescribir 
let favoritos = [];
let resultadosActuales = [];

// Envolvemos la carga inicial en una funcion para manejar el await de forma limpia
async function iniciar() {
    try {
        favoritos = await getFavorites();
    } catch (error) {
        console.warn('Firebase no disponible: ' + error.message);
    }
}
iniciar();

// Comprueba si un elemento esta en favoritos usando el metodo find 
function esFavorito(id) {
    const encontrado = favoritos.find(fav => fav.entityId === id);
    return encontrado !== undefined;
}

// Busca en la API y muestra los resultados
async function buscar() {
    const texto = input.value.trim();
    const tipo = selectorTipo.value;

    cuadricula.innerHTML = '';

    if (texto.length < 2) {
        setStatus(mensajeEstado, 'Escribe al menos 2 caracteres para buscar.', 'info');
        return;
    }

    setStatus(mensajeEstado, 'Buscando...', 'loading');

    try {
        resultadosActuales = await searchEntities(tipo, texto);

        if (resultadosActuales.length === 0) {
            setStatus(mensajeEstado, 'No se encontraron resultados.', 'empty');
            return;
        }

        hideStatus(mensajeEstado);

        // Bucle moderno para recorrer los resultados 
        let indice = 0;
        for (const elemento of resultadosActuales) {
            const tarjeta = buildEntityCard(elemento, tipo, esFavorito(elemento.id));
            tarjeta.dataset.index = indice;
            cuadricula.appendChild(tarjeta);
            indice++;
        }

    } catch (error) {
        setStatus(mensajeEstado, 'Error de red: ' + error.message, 'error');
    }
}

// El debounce evita buscar con cada tecla pulsada
const buscarConPausa = debounce(buscar, 400);
input.addEventListener('input', buscarConPausa);

selectorTipo.addEventListener('change', function() {
    if (input.value.trim().length >= 2) {
        buscar();
    }
});

// Gestion del boton de favorito usando delegacion de eventos
cuadricula.addEventListener('click', async function(evento) {
    const boton = evento.target.closest('.btn-fav');
    if (!boton) return;

    const tarjeta = boton.closest('.card');
    const indice = parseInt(tarjeta.dataset.index);
    const elemento = resultadosActuales[indice];
    elemento.type = selectorTipo.value;

    boton.disabled = true;

    try {
        if (esFavorito(elemento.id)) {
            // Buscamos el favorito exacto para obtener su ID de Firebase 
            const favExistente = favoritos.find(fav => fav.entityId === elemento.id);
            await removeFavorite(favExistente.docId);

            // Actualizamos la lista local quedandonos con todos menos este 
            favoritos = favoritos.filter(fav => fav.entityId !== elemento.id);

            boton.textContent = 'Guardar';
            boton.classList.remove('saved');

        } else {
            const nuevoFav = await addFavorite(elemento);
            favoritos.push(nuevoFav);

            boton.textContent = 'Guardado';
            boton.classList.add('saved');
        }

    } catch (error) {
        setStatus(mensajeEstado, 'Error al actualizar favorito: ' + error.message, 'error');
    }

    boton.disabled = false;
});