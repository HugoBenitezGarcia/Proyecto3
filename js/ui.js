// Retrasa la ejecucion
export function debounce(funcion, espera) {
    let temporizador;
    return function(...argumentos) {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
            funcion.apply(null, argumentos);
        }, espera);
    };
}

// Muestra un estado
export function setStatus(elemento, texto, tipo = 'info') {
    if (tipo === 'loading') {
        elemento.innerHTML = `<span class="spinner"></span> ${texto}`;
    } else {
        elemento.innerHTML = texto;
    }
    elemento.className = `status status-${tipo}`;
    elemento.hidden = false;
}

export function hideStatus(elemento) {
    elemento.hidden = true;
}

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = String(texto);
    return div.innerHTML;
}

// Construye el HTML
export function buildEntityCard(elemento, tipo, esFav) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'card';

    const etiqueta = tipo === 'characters' ? 'Personaje' : 'Monstruo';
    const descripcion = elemento.description ? `${elemento.description.slice(0, 150)}...` : 'Sin descripcion disponible.';

    const extraGenero = elemento.gender ? `<small>Genero: ${escaparHtml(elemento.gender)}</small>` : '';
    const extraRaza = elemento.race ? `<small>Raza: ${escaparHtml(elemento.race)}</small>` : '';
    const extraApariciones = elemento.appearances && elemento.appearances.length > 0
        ? `<small>Aparece en ${elemento.appearances.length} juego(s)</small>`
        : '';

    const textoBtnFav = esFav ? 'Guardado' : 'Guardar';
    const claseBtnFav = esFav ? 'btn-fav saved' : 'btn-fav';

    tarjeta.innerHTML = `
        <section class="card-content">
            <span class="badge">${etiqueta}</span>
            <h3>${escaparHtml(elemento.name)}</h3>
            <p class="desc">${escaparHtml(descripcion)}</p>
            ${extraGenero}
            ${extraRaza}
            ${extraApariciones}
        </section>
        <button class="${claseBtnFav}" data-entity-id="${escaparHtml(elemento.id)}" data-type="${tipo}">
            ${textoBtnFav}
        </button>
    `;

    return tarjeta;
}

export function buildFavCard(favorito) {
    const elemento = document.createElement('li');
    elemento.className = 'fav-card';
    elemento.dataset.docId = favorito.docId;

    const etiqueta = favorito.type === 'characters' ? 'Personaje' : 'Monstruo';
    const fecha = new Date(favorito.addedAt).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const descripcion = favorito.description ? `${favorito.description.slice(0, 110)}...` : '';

    elemento.innerHTML = `
        <section class="fav-info">
            <span class="badge">${etiqueta}</span>
            <strong>${escaparHtml(favorito.name)}</strong>
            <p class="desc">${escaparHtml(descripcion)}</p>
            <small>Anadido: ${fecha}</small>
        </section>
        <button class="btn-remove" data-doc-id="${favorito.docId}" title="Eliminar favorito">Borrar</button>
    `;

    return elemento;
}