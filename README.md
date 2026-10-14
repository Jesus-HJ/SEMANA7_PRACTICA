# CineVerse — Explorador de Películas

Aplicación responsive con React 19, Vite 7 y Tailwind CSS 4. Las 15 películas aparecen desde la primera visita, sin formularios de conexión ni credenciales para visitantes.

## Iniciar

Requiere Node.js 20.19+ o 22.12+. Ejecuta npm install y npm run dev.

## Datos incluidos

[movies.json](./src/movies.json) contiene 15 fichas verificadas en las páginas públicas de TMDB el **14 de octubre de 2026**: títulos, géneros, fechas, duración, calificación, cantidad de votos y rutas reales de pósteres y fondos. Cada registro conserva su enlace de origen y fecha de verificación. Las sinopsis son resúmenes en español redactados a partir de esas fichas.

Este catálogo es una copia local verificada; **no es una consulta en tiempo real a la API**. La ventana de detalles indica la fecha de verificación. Las imágenes se sirven desde el CDN de TMDB y necesitan conexión a Internet.

## Actualización opcional mediante API

La integración con la API sigue disponible para quien administra el proyecto: copiar [.env.example](./.env.example) a .env.local, completar VITE_TMDB_TOKEN y reiniciar Vite. Acepta token Bearer o clave API v3 de [TMDB](https://www.themoviedb.org/settings/api). No existe una pantalla de configuración para visitantes.

Con una credencial configurada, el catálogo aparece inmediatamente y se actualiza en segundo plano. Si falla la API o alguna ficha, se conserva la información local correspondiente. Las solicitudes tienen un límite de 12 segundos.

Las variables VITE_* son visibles en el cliente. Para un despliegue público con credenciales privadas, se deben realizar las consultas desde un backend propio.

## Funcionalidades

- Inicio con Interstellar destacada, catálogo, géneros y favoritos.
- Búsqueda por título original y título en español, insensible a tildes.
- Filtros por género y orden por calificación o fecha de estreno.
- Detalles con sinopsis, duración, votos, géneros, póster y fondo.
- Favoritos y tema persistidos en localStorage.
- Estados de actualización, errores recuperables y búsquedas sin resultados.
- Ventanas modales con foco contenido, cierre con Escape y restauración del foco.

## Verificar y compilar

Ejecuta npm test, npm run build y npm run preview.
