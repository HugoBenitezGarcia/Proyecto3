const XML_RESPALDO = `<?xml version="1.0" encoding="UTF-8"?>
<saga nombre="The Legend of Zelda">
    <juego id="001"><titulo>The Legend of Zelda: Ocarina of Time</titulo><desarrolladora>Nintendo EAD</desarrolladora><publicadora>Nintendo</publicadora><plataforma>Nintendo 64</plataforma><anio>1998</anio><puntuacion>99</puntuacion></juego>
    <juego id="002"><titulo>The Legend of Zelda: Breath of the Wild</titulo><desarrolladora>Nintendo EPD</desarrolladora><publicadora>Nintendo</publicadora><plataforma>Nintendo Switch</plataforma><anio>2017</anio><puntuacion>97</puntuacion></juego>
    <juego id="003"><titulo>The Legend of Zelda: Majoras Mask</titulo><desarrolladora>Nintendo EAD</desarrolladora><publicadora>Nintendo</publicadora><plataforma>Nintendo 64</plataforma><anio>2000</anio><puntuacion>95</puntuacion></juego>
    <juego id="004"><titulo>The Legend of Zelda: A Link to the Past</titulo><desarrolladora>Nintendo EAD</desarrolladora><publicadora>Nintendo</publicadora><plataforma>Super Nintendo</plataforma><anio>1991</anio><puntuacion>95</puntuacion></juego>
    <juego id="005"><titulo>The Legend of Zelda: Tears of the Kingdom</titulo><desarrolladora>Nintendo EPD</desarrolladora><publicadora>Nintendo</publicadora><plataforma>Nintendo Switch</plataforma><anio>2023</anio><puntuacion>96</puntuacion></juego>
</saga>`;

export function xmlToJson(textoXml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(textoXml, 'application/xml');

    const errorXml = xmlDoc.querySelector('parsererror');
    if (errorXml !== null) throw new Error('El XML no es válido.');

    const nodos = xmlDoc.querySelectorAll('juego');
    const lista = [];

    // Parsea nodos a JSON
    for (const nodo of nodos) {
        lista.push({
            id: nodo.getAttribute('id'),
            titulo: nodo.querySelector('titulo').textContent,
            desarrolladora: nodo.querySelector('desarrolladora').textContent,
            publicadora: nodo.querySelector('publicadora').textContent,
            plataforma: nodo.querySelector('plataforma').textContent,
            anio: Number(nodo.querySelector('anio').textContent),
            puntuacion: Number(nodo.querySelector('puntuacion').textContent)
        });
    }

    return lista;
}

export async function loadXmlData() {
    try {
        const respuesta = await fetch('./data/juegos.xml');
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const texto = await respuesta.text();
        return xmlToJson(texto);
    } catch (error) {
        // Usa datos de respaldo
        return xmlToJson(XML_RESPALDO);
    }
}

export function exportToCsv(juegos) {
    const cabecera = 'id,titulo,desarrolladora,publicadora,plataforma,anio,puntuacion';
    let filas = `${cabecera}\r\n`;

    // Genera filas del CSV
    for (const g of juegos) {
        filas += `${g.id},"${g.titulo}",${g.desarrolladora},${g.publicadora},${g.plataforma},${g.anio},${g.puntuacion}\r\n`;
    }

    const blob = new Blob([`\uFEFF${filas}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'catalogo_zelda.csv';

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
}