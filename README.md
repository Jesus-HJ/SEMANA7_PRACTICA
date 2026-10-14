# CineVerse

Explorador de películas creado con React 19 y Vite 7.

## Requisitos

- Node.js LTS 20.19.0 o posterior y npm (también se puede usar pnpm).
- Visual Studio Code. El proyecto recomienda ES7+ React/Redux/React-Native snippets, ESLint y Error Lens.
- Un navegador moderno.
- Conexión a internet para cargar imágenes y actualizar los datos desde TMDB.

El catálogo guardado permite explorar la aplicación sin una clave TMDB; sin internet, las imágenes y la actualización remota no estarán disponibles.

## Instalación y ejecución

```sh
npm ci
npm run dev
```

Abre la URL local que muestra Vite. Para comprobar la versión de Node:

```sh
node --version
```

Si usas pnpm, ejecuta `pnpm install` y luego `pnpm dev`.

## Comprobaciones

```sh
npm test
npm run lint
npm run build
```

## React DevTools

Instala React Developer Tools para tu navegador desde [react.dev/learn/react-developer-tools](https://react.dev/learn/react-developer-tools). Con la aplicación abierta, usa las pestañas **Components** para inspeccionar el árbol de componentes y **Profiler** para medir renderizados.

Consulta la referencia oficial de React en [react.dev/reference/react](https://react.dev/reference/react).

## TMDB (opcional)

Para actualizar el catálogo desde TMDB, copia `.env.example` a `.env.local` y configura `VITE_TMDB_TOKEN` con una credencial válida. No compartas ni publiques esa credencial. Sin ella se utiliza el catálogo local incluido en el proyecto.
