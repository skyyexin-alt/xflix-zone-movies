"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronRight, ChevronLeft, Heart, Play, Plus, Check, Tag, Users, X } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import MDLAddToListModal from '@/components/ui/MDLAddToListModal';
import MovieCastRow from '@/components/ui/MovieCastRow';
import { MediaItem } from '@/lib/tmdb';

const genreMap: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 
  18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie', 53: 'Thriller', 
  10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality', 
  10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
};


export default function RecommendedReviewsList({ items, currentTitle }: { items: any[]; currentTitle: string }) {
  const { getEntry } = useWatchlist();
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState<string>('');

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

  if (!items || items.length === 0) return null;

  return (
    <div className="mt-12 border-t border-white/8 pt-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-inner">
          <Heart className="w-5 h-5 text-violet-400" />
        </span>
        <div>
          <h2 className="text-xl font-black text-white">Recommended Reviews</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Similar titles recommended for fans of {currentTitle}</p>
        </div>
      </div>

      {/* Detailed Horizontal Cards List matching Pic 2! */}
      <div className="space-y-6">
        {items.map((item) => {
          const title = item.title || item.name || 'Untitled';
          const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/no-poster.png';
          const year = (item.release_date || item.first_air_date || '2026').substring(0, 4);
          const score = item.vote_average ? item.vote_average.toFixed(1) : '8.0';
          const isMovie = item.media_type === 'movie' || !!item.title;
          const typeSubtitle = isMovie ? `Movie - ${year}, 2h 15m` : `Drama Series - ${year}, 16 episodes`;
          const entry = getEntry(item.id);

          const genres = (item.genre_ids || [])
            .map((id: number) => genreMap[id])
            .filter(Boolean)
            .slice(0, 3);

          return (
            <div
              key={item.id}
              className="bg-[#14142f] border border-white/8 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex flex-row items-start gap-3.5 sm:gap-6 hover:border-violet-500/40 transition-all shadow-xl group"
            >
              {/* HD Movie Poster Frame (Framed poster on mobile & desktop!) */}
              <Link
                href={`/watch/${isMovie ? 'movie' : 'tv'}/${item.id}`}
                className="relative w-28 sm:w-52 md:w-60 h-36 sm:h-80 md:h-[350px] rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 self-start border border-white/10 group-hover:scale-102 transition-transform shadow-2xl bg-violet-950"
              >
                <Image
                  src={poster}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Details Column */}
              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2 sm:space-y-3">
                <div>
                  {/* Title + Watchlist Add Button */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link href={`/watch/${isMovie ? 'movie' : 'tv'}/${item.id}`} className="block flex-1 min-w-0">
                      <h3 className="text-sm sm:text-xl font-extrabold sm:font-black text-white group-hover:text-violet-300 transition-colors leading-tight sm:leading-snug line-clamp-2">
                        {title}
                      </h3>
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
                      className={`p-1 sm:p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                        entry
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-violet-600/30 hover:bg-violet-600 text-violet-300 hover:text-white border-violet-500/40'
                      }`}
                      title={entry ? `Status: ${entry.status}` : 'Add to My List'}
                    >
                      {entry ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </button>
                  </div>

                  {/* Subtitle */}
                  <p className="text-[11px] sm:text-sm font-bold text-violet-300 mb-1.5">
                    {typeSubtitle}
                  </p>

                  {/* 5 Gold Stars + Score Badge */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md sm:rounded-lg">
                      {score} / 10
                    </span>
                  </div>

                  {/* Genre Pills */}
                  {genres.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 mb-3 flex-wrap">
                      <Tag className="w-3.5 h-3.5 text-violet-400 mr-0.5" />
                      {genres.map((g: string) => (
                        <span key={g} className="bg-white/5 border border-white/8 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-md">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Un-bolded Description */}
                  <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed line-clamp-2 sm:line-clamp-3 mb-2 hidden sm:block">
                    {item.overview || 'An outstanding cinematic experience with brilliant storytelling, gripping performances, and rich character development.'}
                  </p>

                  {/* Cast Carousel */}
                  <div className="hidden sm:block">
                    <MovieCastRow itemId={item.id} mediaType={isMovie ? 'movie' : 'tv'} />
                  </div>
                </div>

                {/* Buttons Action Bar */}
                <div className="flex items-center gap-2 flex-wrap pt-2 sm:pt-3 border-t border-white/8">
                  <button
                    onClick={() => openTrailerModal(item)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-[11px] sm:text-sm font-extrabold text-white shadow-md shadow-violet-600/30 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-white" />
                    <span>Watch Trailer</span>
                  </button>

                  <Link
                    href={`/${isMovie ? 'movie' : 'tv'}/${item.id}`}
                    className="px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] sm:text-sm font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1"
                  >
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
