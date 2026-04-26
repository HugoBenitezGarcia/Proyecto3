import { getFavorites, removeFavorite, clearAllFavorites } from './firebase.js';
import { setStatus, hideStatus, buildFavCard } from './ui.js';

const mensajeEstado = document.getElementById('status');
const listaFavs = document.getElementById('fav-list');
const selectOrden = document.getElementById('sort-select');
const selectFiltro = document.getElementById('filter-select');
const botonVaciar = document.getElementById('btn-clear');

let favoritos = [];

// Filtra y ordena lista
function mostrarFavoritos() {
    const orden = selectOrden.value;
    const filtro = selectFiltro.value;

    let items = favoritos.filter(fav => filtro === 'all' || fav.type === filtro);

    if (orden === 'date-desc') items.sort((a, b) => b.addedAt - a.addedAt);
    if (orden === 'date-asc') items.sort((a, b) => a.addedAt - b.addedAt);
    if (orden === 'name-asc') items.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    if (orden === 'name-desc') items.sort((a, b) => b.name.localeCompare(a.name, 'es'));

    listaFavs.innerHTML = '';

    if (items.length === 0) {
        const mensaje = filtro !== 'all' ? 'No hay favoritos.' : 'Aun no tienes favoritos.';
        setStatus(mensajeEstado, mensaje, 'empty');
        return;
    }

    hideStatus(mensajeEstado);

    for (const item of items) {
        listaFavs.appendChild(buildFavCard(item));
    }
}

// Elimina un favorito
listaFavs.addEventListener('click', async function(evento) {
    const boton = evento.target.closest('.btn-remove');
    if (!boton) return;

    boton.disabled = true;

    try {
        await removeFavorite(boton.dataset.docId);
        favoritos = favoritos.filter(fav => fav.docId !== boton.dataset.docId);
        mostrarFavoritos();
    } catch (error) {
        setStatus(mensajeEstado, 'Error al eliminar: ' + error.message, 'error');
        boton.disabled = false;
    }
});

botonVaciar.addEventListener('click', async function() {
    if (favoritos.length === 0) return;

    botonVaciar.disabled = true;
    setStatus(mensajeEstado, 'Eliminando todos los favoritos...', 'loading');

    try {
        await clearAllFavorites(favoritos);
        favoritos = [];
        mostrarFavoritos();
    } catch (error) {
        setStatus(mensajeEstado, 'Error al vaciar: ' + error.message, 'error');
    }

    botonVaciar.disabled = false;
});

selectOrden.addEventListener('change', mostrarFavoritos);
selectFiltro.addEventListener('change', mostrarFavoritos);

// Carga datos iniciales
async function iniciar() {
    try {
        favoritos = await getFavorites();
        mostrarFavoritos();
    } catch (error) {
        setStatus(mensajeEstado, 'Error de conexion: ' + error.message, 'error');
    }
}

iniciar();