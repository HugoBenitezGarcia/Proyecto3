import { loadXmlData, exportToCsv } from './transform.js';
import { setStatus, hideStatus } from './ui.js';

const mensajeEstado = document.getElementById('status');
const cuerpoTabla = document.getElementById('table-body');
const botonCsv = document.getElementById('btn-csv');

let juegos = [];

function colorPuntuacion(puntuacion) {
    if (puntuacion >= 97) return '#276749';
    if (puntuacion >= 95) return '#4d7c5a';
    return '#6b7280';
}

// Cargamos datos iniciales
async function iniciar() {
    try {
        juegos = await loadXmlData();
        hideStatus(mensajeEstado);

        for (const juego of juegos) {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td><code>${juego.id}</code></td>
                <td><strong>${juego.titulo}</strong></td>
                <td>${juego.desarrolladora}</td>
                <td>${juego.publicadora}</td>
                <td>${juego.plataforma}</td>
                <td>${juego.anio}</td>
                <td class="score" style="color:${colorPuntuacion(juego.puntuacion)}">
                    ${juego.puntuacion}<small>/100</small>
                </td>
            `;

            cuerpoTabla.appendChild(fila);
        }
    } catch (error) {
        setStatus(mensajeEstado, 'Error al cargar: ' + error.message, 'error');
    }
}

iniciar();

botonCsv.addEventListener('click', function() {
    if (juegos.length === 0) {
        setStatus(mensajeEstado, 'No hay datos exportables.', 'error');
        return;
    }

    try {
        exportToCsv(juegos);
        setStatus(mensajeEstado, 'CSV descargado correctamente.', 'success');

        setTimeout(function() {
            hideStatus(mensajeEstado);
        }, 4000);
    } catch (error) {
        setStatus(mensajeEstado, 'Error al exportar: ' + error.message, 'error');
    }
});