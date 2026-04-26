import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';

// Configura base de datos
const firebaseConfig = {
    apiKey: 'AIzaSyA4T3PhfgN8WhBRQTlkECPhp8MrzqehiRo',
    authDomain: 'proyecto3-zelda.firebaseapp.com',
    projectId: 'proyecto3-zelda',
    storageBucket: 'proyecto3-zelda.firebasestorage.app',
    messagingSenderId: '43710691298',
    appId: '1:43710691298:web:6650a5875034ff9409abbb'
};

let db = null;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.error('Error inicializando: ' + error.message);
}

function comprobarConexion() {
    if (db === null) throw new Error('Firebase sin configurar.');
}

const COLECCION = 'favoritos';

export async function getFavorites() {
    comprobarConexion();
    const snapshot = await getDocs(collection(db, COLECCION));
    const lista = [];

    // Extrae datos del snapshot
    for (const documento of snapshot.docs) {
        const datos = documento.data();
        datos.docId = documento.id;
        lista.push(datos);
    }

    return lista;
}

export async function addFavorite(entidad) {
    comprobarConexion();

    const favorito = {
        entityId: entidad.id,
        name: entidad.name,
        description: entidad.description || '',
        type: entidad.type,
        addedAt: Date.now() // Timestamp actual
    };

    const referencia = await addDoc(collection(db, COLECCION), favorito);
    favorito.docId = referencia.id;

    return favorito;
}

export async function removeFavorite(idDocumento) {
    comprobarConexion();
    await deleteDoc(doc(db, COLECCION, idDocumento));
}

export async function clearAllFavorites(lista) {
    comprobarConexion();

    // Borra uno a uno
    for (const item of lista) {
        await removeFavorite(item.docId);
    }
}