import test from 'node:test';
import assert from 'node:assert/strict';
import { selectMovies, selectFeaturedMovies, MOVIE_IDS } from './catalog.js';
import initialMovies from './movies.json' with { type: 'json' };
const movies = [
 { id:1,title:'Película espacial',original_title:'Space Film',genres:[{id:8}],vote_average:8,release_date:'2024-06-01' },
 { id:2,title:'Otra historia',original_title:'Another Story',genres:[{id:9}],vote_average:9,release_date:'2009-12-01' }
];
test('catálogo de 15 películas distintas',()=>assert.equal(new Set(MOVIE_IDS).size,15));
test('selecciona tres películas destacadas en el orden previsto y completa si falta alguna',()=>{
 assert.deepEqual(selectFeaturedMovies(initialMovies).map(movie=>movie.id),[157336,19995,693134]);
 assert.deepEqual(selectFeaturedMovies(movies).map(movie=>movie.id),[1,2]);
});
test('busca títulos originales y normaliza tildes',()=>{assert.equal(selectMovies(movies,{query:'PELICULA'})[0].id,1);assert.equal(selectMovies(movies,{query:'space'})[0].id,1);});
test('combina búsqueda con género',()=>{assert.equal(selectMovies(movies,{query:'space',genre:'9'}).length,0);assert.equal(selectMovies(movies,{genre:'9'})[0].id,2);});
test('ordena por calificación y fecha sin mutar el catálogo',()=>{assert.equal(selectMovies(movies,{sort:'rating'})[0].id,2);assert.equal(selectMovies(movies,{sort:'newest'})[0].id,1);assert.equal(selectMovies(movies,{sort:'oldest'})[0].id,2);assert.equal(movies[0].id,1);});
test('catálogo incluido completo, con fuentes y puntuaciones verificadas',()=>{
 assert.deepEqual(initialMovies.map(movie=>movie.id),MOVIE_IDS);
 for(const movie of initialMovies){
  assert.ok(movie.title && movie.localized_title && movie.overview && movie.genres.length);
  assert.ok(movie.runtime>0 && movie.vote_count>0 && movie.vote_average>0 && movie.vote_average<=10);
  assert.match(movie.poster_path,/^\/[a-zA-Z0-9]+\.jpg$/);
  assert.match(movie.backdrop_path,/^\/[a-zA-Z0-9]+\.jpg$/);
  assert.ok(movie.source_url.includes(`/movie/${movie.id}-`));
  assert.equal(movie.data_source,'tmdb-snapshot');
 }
});
test('encuentra películas por título original o traducido',()=>{
 assert.equal(selectMovies(initialMovies,{query:'Origen'})[0].title,'Inception');
 assert.equal(selectMovies(initialMovies,{query:'Inside Out 2'})[0].id,1022789);
});
