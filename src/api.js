export async function fetchMovie(id, credential, signal) {
  const url = new URL(`https://api.themoviedb.org/3/movie/${id}`);
  url.searchParams.set('language', 'es-ES');
  const headers = { accept: 'application/json' };
  if (/^[a-f0-9]{32}$/i.test(credential)) url.searchParams.set('api_key', credential);
  else headers.Authorization = `Bearer ${credential}`;
  const response = await fetch(url, { headers, signal });
  if (!response.ok) throw new Error(response.status === 401 ? 'La credencial de TMDB no es válida. Revisa tu clave o token.' : response.status === 429 ? 'TMDB ha recibido demasiadas solicitudes. Inténtalo en unos momentos.' : `No se pudo consultar TMDB (HTTP ${response.status}).`);
  return response.json();
}
export const imageUrl = (path, size = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
