export const MOVIE_IDS = [19995, 76600, 299534, 299536, 597, 157336, 27205, 155, 634649, 1726, 414906, 475557, 872585, 693134, 1022789];
export function selectMovies(movies, { query = '', genre = '', sort = 'featured' }) {
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const result = movies.filter(movie => (!query || normalize(`${movie.title} ${movie.original_title} ${movie.localized_title || ''}`).includes(normalize(query))) && (!genre || movie.genres.some(item => String(item.id) === genre)));
  if (sort === 'rating') result.sort((a,b) => b.vote_average - a.vote_average);
  if (sort === 'newest') result.sort((a,b) => b.release_date.localeCompare(a.release_date));
  if (sort === 'oldest') result.sort((a,b) => a.release_date.localeCompare(b.release_date));
  return result;
}
