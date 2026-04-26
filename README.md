# Proyecto3

# Enciclopedia Hyrule

## Descripción del Proyecto
Aplicación web orientada a explorar el universo de The Legend of Zelda. Permite buscar entidades (personajes y monstruos) consumiendo una API externa, guardar favoritos en una base de datos en la nube (Firebase Firestore) y procesar un catálogo local de juegos transformando datos entre formatos XML, JSON y CSV.

## Instrucciones de Uso
1. Clonar el repositorio en local.
2. Abrir el archivo `index.html` directamente en un navegador moderno. No requiere servidor local para las funciones básicas.
3. Para la base de datos: Crear un proyecto en Firebase, habilitar Firestore en "modo test" y pegar las credenciales en el archivo `js/firebase.js`.

## Tecnologías y Herramientas
* **HTML/CSS/JS Puro:** Siguiendo los estándares de los apuntes de la asignatura (Section 1).
* **Firebase Firestore:** Base de datos NoSQL basada en la nube.
* Alternativas consideradas: Para el desarrollo del Front-end se evaluó usar frameworks como React o Vue, pero se optó por Vanilla JS y manipulación directa del DOM (DOMParser, Element API) para afianzar los conceptos base de la asignatura.

## Consumo de API REST
Una API REST permite conectar sistemas usando el protocolo HTTP. En este proyecto utilizamos la función nativa `fetch` del navegador. Una alternativa popular a `fetch` sería usar la librería `Axios`, que simplifica la sintaxis, pero `fetch` no requiere dependencias externas.

**Endpoints utilizados:**
* `/api/characters?name={termino}`: Para buscar personajes.
* `/api/monsters?name={termino}`: Para buscar monstruos.

**Códigos HTTP gestionados:**
El código verifica si la respuesta es exitosa (ej. 200 OK). Si hay fallos de servidor (ej. 500) o no se encuentra la ruta (404), se lanza un error que la interfaz captura.

**Ejemplo de respuesta (JSON):**
```json
{
  "success": true,
  "data": [
    {
      "id": "5f6ce9d805615a85623ec2b7",
      "name": "Link",
      "description": "Hero of Hyrule...",
      "race": "Hylian"
    }
  ]
}
