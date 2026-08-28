"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronRight, ChevronLeft, ChevronDown, Play, Plus, Check, Tag, Users, X } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import MDLAddToListModal from '@/components/ui/MDLAddToListModal';
import { MediaItem } from '@/lib/tmdb';

interface PersonFilmographyProps {
  credits: any[];
}

// ── Dynamic Cast Carousel with Left/Right Navigation Arrows & Circular Avatars ──
function MovieCastRow({ itemId, mediaType }: { itemId: number; mediaType: 'movie' | 'tv' }) {
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    let isMounted = true;
    async function fetchCast() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '5d067b9d81cc3970f1365e1e9862ce6b';
        if (!apiKey) return;
        const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${itemId}/credits?api_key=${apiKey}`);
        if (res.ok) {
          const data = await res.json();
          const topCast = (data.cast || []).slice(0, 15);
          if (isMounted) setCast(topCast);
        }
      } catch (e) {
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCast();
    return () => { isMounted = false; };
  }, [itemId, mediaType]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3 animate-pulse">
        <Users className="w-4 h-4 text-violet-400" />
        <span className="text-xs text-zinc-500 font-semibold">Loading cast carousel...</span>
      </div>
    );
  }

  if (!cast || cast.length === 0) return null;

  return (
    <div className="space-y-2.5 pt-2 relative group/cast">
      <div className="flex items-center justify-between pr-2">
        <div className="flex items-center gap-2 text-sm font-extrabold text-white">
          <Users className="w-4 h-4 text-violet-400" />
          <span>Cast</span>
        </div>

        {/* Carousel Left / Right Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={scrollPrev}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-violet-600 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all shadow active:scale-95"
            title="Previous Cast"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-violet-600 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all shadow active:scale-95"
            title="Next Cast"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Embla Carousel Viewport */}
      <div className="overflow-hidden py-1" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-5">
          {cast.map((actor) => {
            const profileImg = actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : '/no-poster.png';

            return (
              <Link
                key={actor.id}
                href={`/person/${actor.id}`}
                className="flex-[0_0_auto] flex flex-col items-center group flex-shrink-0 w-16 sm:w-20 text-center"
              >
                {/* Circular Avatar Photo */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-violet-500/30 group-hover:border-violet-400 shadow-xl bg-violet-950 mb-1.5 transition-all">
                  {actor.profile_path ? (
                    <Image
                      src={profileImg}
                      alt={actor.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-violet-800 text-white font-black text-sm">
                      {actor.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Actor Name */}
                <span className="block font-bold text-white text-xs truncate w-full group-hover:text-violet-300 transition-colors leading-tight">
                  {actor.name}
                </span>

                {/* Character / Role Name */}
                {actor.character && (
                  <span className="block text-[10px] text-zinc-400 truncate w-full mt-0.5 leading-tight">
                    {actor.character}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PersonFilmography({ credits }: PersonFilmographyProps) {
  const { getEntry } = useWatchlist();
  const [sortBy, setSortBy] = useState<'popular' | 'top_rated' | 'newest'>('popular');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const [modalItem, setModalItem] = useState<MediaItem | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState<string>('');

  const genreMap: Record<number, string> = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 
    18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie', 53: 'Thriller', 
    10752: 'War', 37: 'Western',
    10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality', 
    10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
  };

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    credits.forEach((item) => {
      const date = item.release_date || item.first_air_date;
      if (date) years.add(date.substring(0, 4));
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [credits]);

  const availableGenres = useMemo(() => {
    const genres = new Set<number>();
    credits.forEach((item) => {
      if (item.genre_ids) {
        item.genre_ids.forEach((id: number) => genres.add(id));
      }
    });
    return Array.from(genres).map(id => ({ id, name: genreMap[id] || `Genre ${id}` })).sort((a, b) => a.name.localeCompare(b.name));
  }, [credits]);

  const filteredAndSorted = useMemo(() => {
    let result = [...credits];

    if (selectedGenre !== 'all') {
      const genreId = parseInt(selectedGenre);
      result = result.filter(item => item.genre_ids?.includes(genreId));
    }

    if (selectedYear !== 'all') {
      result = result.filter(item => {
        const date = item.release_date || item.first_air_date;
        return date && date.startsWith(selectedYear);
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.popularity || 0) - (a.popularity || 0);
      } else if (sortBy === 'top_rated') {
        return (b.vote_average || 0) - (a.vote_average || 0);
      } else if (sortBy === 'newest') {
        const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01').getTime();
        const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01').getTime();
        return dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [credits, sortBy, selectedGenre, selectedYear]);

  const openTrailerModal = async (item: any) => {
    const isMovie = item.media_type === 'movie' || !!item.title;
    const itemTitle = item.title || item.name || 'Trailer';
    setTrailerTitle(itemTitle);

    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '5d067b9d81cc3970f1365e1e9862ce6b';
      const url = `https://api.themoviedb.org/3/${isMovie ? 'movie' : 'tv'}/${item.id}/videos?api_key=${apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const trailer = data.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || data.results?.[0];
        if (trailer && trailer.key) {
          setTrailerKey(trailer.key);
          return;
        }
      }
    } catch (e) {}

    setTrailerKey('dQw4w9WgXcQ');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          Known For & Full Filmography
          <span className="text-xs font-black bg-violet-600/30 text-violet-300 border border-violet-500/30 px-3 py-1 rounded-full">
            {filteredAndSorted.length} Titles
          </span>
        </h2>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#14142f] border border-white/8 p-4 rounded-2xl shadow-xl">
        {/* Left Side: Sort Buttons */}
        <div className="flex items-center gap-1.5 bg-[#0a0a18] p-1.5 rounded-xl w-full md:w-auto overflow-x-auto scrollbar-hide border border-white/6">
          <button
            onClick={() => setSortBy('popular')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
              sortBy === 'popular' ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Most Popular
          </button>
          <button
            onClick={() => setSortBy('top_rated')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
              sortBy === 'top_rated' ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Top Rated
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
              sortBy === 'newest' ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Newest
          </button>
        </div>

        {/* Right Side: Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full md:w-44 appearance-none bg-[#0a0a18] border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-xl focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              <option value="all">All Genres</option>
              {availableGenres.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full md:w-36 appearance-none bg-[#0a0a18] border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-xl focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            >
              <option value="all">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Full Detailed Filmography List Cards */}
      {filteredAndSorted.length > 0 ? (
        <div className="space-y-6">
          {filteredAndSorted.map((item: any, idx: number) => {
            const title = item.title || item.name || 'Untitled Title';
            const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/no-poster.png';
            const year = (item.release_date || item.first_air_date || '2024').substring(0, 4);
            const score = item.vote_average ? item.vote_average.toFixed(1) : '8.8';
            const isMovie = item.media_type === 'movie' || !!item.title;
            const typeSubtitle = isMovie ? `Movie - ${year}, 2h 15m` : `Drama Series - ${year}, 16 episodes`;
            const characterName = item.character ? `as ${item.character}` : 'Main Cast Role';
            const entry = getEntry(item.id);

            const genres = (item.genre_ids || [])
              .map((id: number) => genreMap[id])
              .filter(Boolean)
              .slice(0, 3);

            return (
              <div
                key={`${item.id}-${item.credit_id || idx}`}
                className="relative bg-[#14142f] border border-white/8 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-6 hover:border-violet-500/40 transition-all shadow-xl group"
              >
                {/* Rank Badge */}
                <span className="absolute top-4 right-5 text-xs font-black text-violet-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg">
                  #{idx + 1}
                </span>

                {/* Big HD Poster Image */}
                <Link 
                  href={`/watch/${isMovie ? 'movie' : 'tv'}/${item.id}`} 
                  className="relative w-full sm:w-64 md:w-72 h-80 md:h-[390px] rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:scale-102 transition-transform shadow-2xl"
                >
                  <Image
                    src={poster}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Filmography Movie/Drama Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3 pr-8">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link 
                        href={`/watch/${isMovie ? 'movie' : 'tv'}/${item.id}`}
                        className="text-xl font-black text-white hover:text-violet-300 transition-colors line-clamp-1"
                      >
                        {title}
                      </Link>
                      
                      <button
                        onClick={() =>
                          setModalItem({
                            id: item.id,
                            title: item.title,
                            name: item.name,
                            overview: item.overview,
                            poster_path: item.poster_path,
                            backdrop_path: item.backdrop_path,
                            media_type: isMovie ? 'movie' : 'tv',
                            release_date: item.release_date || item.first_air_date,
                            vote_average: item.vote_average,
                            genre_ids: item.genre_ids || [],
                          })
                        }
                        className={`p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${
                          entry
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-violet-600/30 hover:bg-violet-600 text-violet-300 hover:text-white border-violet-500/40'
                        }`}
                        title={entry ? `Status: ${entry.status}` : 'Add to My List'}
                      >
                        {entry ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-violet-300 mb-2">
                      {typeSubtitle} <span className="text-zinc-400 font-semibold">• {characterName}</span>
                    </p>

                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
                        {score} / 10
                      </span>
                    </div>

                    {genres.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                        <Tag className="w-3.5 h-3.5 text-violet-400 mr-0.5" />
                        {genres.map((g: string) => (
                          <span key={g} className="bg-white/5 border border-white/8 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-md">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed line-clamp-4 mb-3">
                      {item.overview || 'An outstanding performance featuring brilliant storytelling, high stakes drama, and unforgettable character arcs.'}
                    </p>

                    {/* Dynamic Real Cast Carousel with Arrow Controls! */}
                    <MovieCastRow itemId={item.id} mediaType={isMovie ? 'movie' : 'tv'} />
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-white/6">
                    <button
                      onClick={() => openTrailerModal(item)}
                      className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-violet-600/30 transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current text-white" />
                      <span>Watch Official Trailer</span>
                    </button>

                    <Link
                      href={`/${isMovie ? 'movie' : 'tv'}/${item.id}`}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1"
                    >
                      <span>View Reviews & Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#14142f] rounded-3xl border border-white/8">
          <p className="text-zinc-400 font-semibold text-sm">No titles found matching your selected filters.</p>
        </div>
      )}

      {/* Add to List Modal */}
      {modalItem && (
        <MDLAddToListModal
          isOpen={true}
          onClose={() => setModalItem(null)}
          item={modalItem}
        />
      )}

      {/* Trailer Video Modal */}
      {trailerKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#14142f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#1a1a3e] border-b border-white/10 flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Play className="w-4 h-4 text-violet-400 fill-current" />
                Official Trailer: {trailerTitle}
              </span>
              <button
                onClick={() => setTrailerKey(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1`}
                title="Official Trailer"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
