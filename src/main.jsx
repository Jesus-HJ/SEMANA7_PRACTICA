import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Film, Search, Heart, Sun, Moon, ArrowRight, Play, Star, X, SlidersHorizontal, AlertCircle, Clapperboard, Check, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOVIE_IDS, selectFeaturedMovies, selectMovies } from './catalog';
import { fetchMovie, imageUrl } from './api';
import initialMovies from './movies.json';
import './styles.css';
import './hero.css';

function readStored(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function Poster({path, title, className=''}) { const [failed,setFailed] = useState(false); return path && !failed ? <img className={className} src={imageUrl(path)} alt={`Póster de ${title}`} loading="lazy" onError={()=>setFailed(true)}/> : <div className={`poster-placeholder ${className}`}><Film size={38}/><span>Póster no disponible</span></div>; }
function Dialog({title,onClose,children,wide=false}) { const ref=useRef(null); useEffect(()=>{const dialog=ref.current; const previous=document.activeElement; dialog.showModal(); const overflow=document.body.style.overflow; document.body.style.overflow='hidden'; return ()=>{document.body.style.overflow=overflow; previous?.focus();};},[]); return <dialog ref={ref} className={wide?'dialog wide':'dialog'} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="dialog-inner"><button className="icon close" aria-label="Cerrar ventana" onClick={onClose}><X/></button><h2 className="sr-only">{title}</h2>{children}</div></dialog>; }
function App(){
 const [movies,setMovies]=useState(initialMovies), [loading,setLoading]=useState(false), [error,setError]=useState(''), [retry,setRetry]=useState(0);
 const token = import.meta.env.VITE_TMDB_TOKEN?.trim() || '';
 const [page,setPage]=useState('Inicio'), [query,setQuery]=useState(''), [genre,setGenre]=useState(''), [sort,setSort]=useState('featured'), [selected,setSelected]=useState(null), [activeHeroIndex,setActiveHeroIndex]=useState(0);
 const [favorites,setFavorites]=useState(()=>{const value=readStored('cineverse-favorites',[]);return Array.isArray(value)?value.filter(Number.isInteger):[];}), [theme,setTheme]=useState(()=>readStored('cineverse-theme','dark')), [notice,setNotice]=useState('');
 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('cineverse-theme',JSON.stringify(theme));}catch{setNotice('No se pudo guardar el tema en este navegador.');}},[theme]);
 useEffect(()=>{try{localStorage.setItem('cineverse-favorites',JSON.stringify(favorites));}catch{setNotice('El navegador no permite guardar tus favoritos.');}},[favorites]);
 useEffect(()=>{if(!notice)return;const timeout=setTimeout(()=>setNotice(''),3500);return ()=>clearTimeout(timeout);},[notice]);
 useEffect(() => {
   if (!token) return;
   const controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), 12000);
   let active = true;
   setLoading(true);
   setError('');
   (async () => {
     try {
       const results = await Promise.allSettled(MOVIE_IDS.map(id => fetchMovie(id, token, controller.signal)));
       if (!active) return;
       setMovies(initialMovies.map((saved, index) => {
         const result = results[index];
         if (result.status !== 'fulfilled') return saved;
         return { ...saved, ...result.value, title: saved.title, localized_title: result.value.title, data_source: 'tmdb-api' };
       }));
       if (results.some(result => result.status === 'rejected')) setError('No se pudieron actualizar algunas películas. Puedes seguir explorando el catálogo guardado.');
     } finally {
       clearTimeout(timeout);
       if (active) setLoading(false);
     }
   })();
   return () => { active = false; clearTimeout(timeout); controller.abort(); };
 }, [token, retry]);
 const genres=useMemo(()=>Array.from(new Map(movies.flatMap(m=>m.genres).map(g=>[g.id,g])).values()).sort((a,b)=>a.name.localeCompare(b.name)),[movies]);
 const visible=useMemo(()=>selectMovies(page==='Favoritos'?movies.filter(m=>favorites.includes(m.id)):movies,{query,genre,sort}),[movies,page,favorites,query,genre,sort]);
 const featuredMovies=useMemo(()=>selectFeaturedMovies(movies),[movies]);
 useEffect(()=>{
   if(page!=='Inicio'||featuredMovies.length<2)return;
   const timeout=setTimeout(()=>setActiveHeroIndex(index=>(index+1)%featuredMovies.length),30000);
   return ()=>clearTimeout(timeout);
 },[page,activeHeroIndex,featuredMovies.length]);
 function toggleFavorite(id){const exists=favorites.includes(id);setFavorites(current=>exists?current.filter(item=>item!==id):[...current,id]);setNotice(exists?'Película eliminada de favoritos':'Película añadida a favoritos');}
 function moveFeatured(direction){setActiveHeroIndex(index=>(index+direction+featuredMovies.length)%featuredMovies.length);}
 function navigate(next){setPage(next);setQuery('');setGenre('');window.scrollTo({top:0,behavior:'smooth'});}
 return <><header className="header"><a href="#" className="brand" onClick={e=>{e.preventDefault();navigate('Inicio');}}><span className="brand-icon"><Clapperboard size={23}/></span>Cine<span>Verse</span><span className="brand-dot">.</span></a><nav aria-label="Navegación principal">{['Inicio','Películas','Géneros','Favoritos'].map(item=><button key={item} className={page===item?'nav-link active':'nav-link'} onClick={()=>navigate(item)}>{item}{item==='Favoritos'&&favorites.length>0&&<span className="count">{favorites.length}</span>}</button>)}</nav><div className="header-actions"><button className="icon" aria-label={theme==='dark'?'Activar tema claro':'Activar tema oscuro'} onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?<Sun size={20}/>:<Moon size={20}/>}</button><span className="avatar">CV</span></div></header>
 <main>{page==='Inicio'&&<section className="hero" aria-label="Películas destacadas">
   <div className="hero-track" style={{transform:`translateX(-${activeHeroIndex*100}%)`}}>
    {featuredMovies.map((movie,index)=><article className="hero-slide" key={movie.id} aria-hidden={index!==activeHeroIndex} inert={index!==activeHeroIndex} style={movie.backdrop_path?{backgroundImage:`linear-gradient(90deg,rgba(7,10,20,.96),rgba(7,10,20,.30)),linear-gradient(0deg,#090b13,transparent 65%),url(${imageUrl(movie.backdrop_path,'original')})`}:undefined}>
     <div className="hero-orbit"/>
     <div className="hero-content"><span className="eyebrow"><span/> PELÍCULA DESTACADA</span><p className="hero-kicker">EL CINE NOS LLEVA MÁS LEJOS</p><h1>{movie.title}</h1><div className="hero-meta"><span className="rating"><Star size={16} fill="currentColor"/> {movie.vote_average.toFixed(1)}</span><span>{movie.release_date?.slice(0,4)}</span><span>{movie.runtime} min</span><span className="quality">TMDB</span></div><p className="hero-description">{movie.overview}</p><div className="hero-buttons"><button className="primary" onClick={()=>setSelected(movie)}><Play size={18} fill="currentColor"/> Ver detalles<ArrowRight size={18}/></button><button className="secondary" onClick={()=>toggleFavorite(movie.id)}><Heart size={18} fill={favorites.includes(movie.id)?'currentColor':'none'}/>{favorites.includes(movie.id)?'En favoritos':'Mi lista'}</button></div></div>
    </article>)}
   </div>
   <div className="hero-bottom"><span><span className="purple-line"/> HISTORIAS QUE DEJAN HUELLA</span><div className="hero-controls" aria-label="Controles de películas destacadas"><span className="hero-count"><b>{String(activeHeroIndex+1).padStart(2,'0')}</b> / {String(featuredMovies.length).padStart(2,'0')}</span><div className="hero-pagination">{featuredMovies.map((movie,index)=><button key={movie.id} className={`hero-indicator ${index===activeHeroIndex?'active':''}`} aria-label={`Ver ${movie.title}`} aria-current={index===activeHeroIndex?'true':undefined} onClick={()=>setActiveHeroIndex(index)}><span key={activeHeroIndex===index?activeHeroIndex:undefined}/></button>)}</div><button className="hero-arrow" aria-label="Película anterior" onClick={()=>moveFeatured(-1)}><ChevronLeft size={18}/></button><button className="hero-arrow" aria-label="Siguiente película" onClick={()=>moveFeatured(1)}><ChevronRight size={18}/></button></div></div>
  </section>}
 {page!=='Inicio'&&<section className="catalog" id="catalog"><div className="section-top"><div><p className="eyebrow small">TU UNIVERSO CINEMATOGRÁFICO</p><h2>{page==='Favoritos'?'Tus favoritos':page==='Géneros'?'Encuentra tu género':'Explora el catálogo'}<span className="purple-dot">.</span></h2><p className="muted">{page==='Favoritos'?'Las historias a las que siempre quieres volver.':'Grandes películas. Emociones infinitas. ¿Cuál verás hoy?'}</p></div><span className="catalog-count"><Film size={16}/>{movies.length} películas seleccionadas</span></div>
 <div className="filters"><label className="search"><Search size={20}/><input aria-label="Buscar películas por nombre" placeholder="Buscar una película..." value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button className="icon" aria-label="Limpiar búsqueda" onClick={()=>setQuery('')}><X size={16}/></button>}</label><div className="select-wrap"><SlidersHorizontal size={17}/><select aria-label="Filtrar por género" value={genre} onChange={e=>setGenre(e.target.value)}><option value="">Todos los géneros</option>{genres.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></div><div className="select-wrap"><select aria-label="Ordenar películas" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Selección CineVerse</option><option value="rating">Mejor calificación</option><option value="newest">Más recientes</option><option value="oldest">Más antiguas</option></select></div></div>
 <div className="genre-chips" aria-label="Géneros rápidos"><button className={!genre?'chip active':'chip'} onClick={()=>setGenre('')}>Todas</button>{genres.map(g=><button key={g.id} className={genre===String(g.id)?'chip active':'chip'} onClick={()=>setGenre(String(g.id))}>{g.name}</button>)}</div>
 {error&&<div className="error" role="alert"><AlertCircle/><span>{error}</span><button onClick={()=>setRetry(r=>r+1)}><RefreshCw size={16}/>Reintentar</button></div>}
 {loading && movies.length === 0?<div className="movie-grid" aria-label="Cargando películas" aria-busy="true">{Array.from({length:10},(_,i)=><div className="skeleton" key={i}><div/><span/><span/></div>)}</div>:<><div className="results-meta" aria-live="polite">{loading && <span>Actualizando películas… </span>}{movies.length>0&&<span>{visible.length} {visible.length===1?'película':'películas'}{query&&` para “${query}”`}</span>}</div><div className="movie-grid">{visible.map(movie=><article className="movie-card" key={movie.id}><div className="poster-wrap"><Poster path={movie.poster_path} title={movie.title}/><span className="card-rating"><Star size={12} fill="currentColor"/>{movie.vote_average.toFixed(1)}</span><button className={`favorite ${favorites.includes(movie.id)?'saved':''}`} aria-label={`${favorites.includes(movie.id)?'Eliminar de':'Agregar a'} favoritos: ${movie.title}`} aria-pressed={favorites.includes(movie.id)} onClick={()=>toggleFavorite(movie.id)}><Heart size={18} fill={favorites.includes(movie.id)?'currentColor':'none'}/></button><button className="details-button" onClick={()=>setSelected(movie)}>Ver detalles <ArrowRight size={16}/></button></div><h3>{movie.title}</h3><p>{movie.release_date?.slice(0,4)}<span>•</span>{movie.genres.slice(0,2).map(g=>g.name).join(' / ')}</p></article>)}</div>{movies.length>0&&visible.length===0&&<div className="empty"><Heart size={32}/><h3>{page==='Favoritos'&&!favorites.length?'Tu lista empieza con una gran película':'No encontramos películas'}</h3><p>{page==='Favoritos'&&!favorites.length?'Pulsa el corazón de una película para guardarla aquí.':'Prueba otro título o cambia los filtros.'}</p><button className="secondary" onClick={()=>{setQuery('');setGenre('');if(page==='Favoritos')navigate('Películas');}}>Explorar catálogo</button></div>}</>}
 </section>}</main>
 <footer><a href="#" className="brand" onClick={e=>{e.preventDefault();navigate('Inicio');}}>Cine<span>Verse</span>.</a></footer>
 {notice&&<div className="toast" role="status"><Check size={17}/>{notice}</div>}
 {selected&&<Dialog title={selected.title} wide onClose={()=>setSelected(null)}>{selected.backdrop_path&&<img className="detail-backdrop" src={imageUrl(selected.backdrop_path,'w1280')} alt="" onError={e=>{e.currentTarget.style.display='none';}}/>}<div className="detail-content"><Poster className="detail-poster" path={selected.poster_path} title={selected.title}/><div><p className="eyebrow small">UNA HISTORIA PARA DESCUBRIR</p><h2>{selected.title}</h2>{selected.localized_title!==selected.title&&<p className="muted">{selected.localized_title}</p>}<div className="hero-meta"><span className="rating"><Star size={16} fill="currentColor"/>{selected.vote_average.toFixed(1)} / 10</span><span>{selected.release_date?.slice(0,4)}</span><span>{selected.runtime} min</span></div><p className="muted">{selected.vote_count.toLocaleString('es-ES')} votos en TMDB{selected.data_source === 'tmdb-snapshot' && ' · Datos verificados el 14/10/2026'}</p><div className="detail-genres">{selected.genres.map(g=><span className="chip" key={g.id}>{g.name}</span>)}</div><h3>Sinopsis</h3><p className="synopsis">{selected.overview||'TMDB no dispone de una sinopsis en español para esta película.'}</p><button className="primary" onClick={()=>toggleFavorite(selected.id)}><Heart size={18} fill={favorites.includes(selected.id)?'currentColor':'none'}/>{favorites.includes(selected.id)?'Eliminar de favoritos':'Agregar a favoritos'}</button><a className="text-link" target="_blank" rel="noreferrer" href={`https://www.themoviedb.org/movie/${selected.id}`}>Ver en TMDB ↗</a></div></div></Dialog>}
 </>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
