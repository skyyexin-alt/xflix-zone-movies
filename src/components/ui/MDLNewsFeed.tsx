"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronRight, ChevronLeft, Newspaper, Film, Users, Tag, Plus, Check } from 'lucide-react';
import { MediaItem } from '@/lib/tmdb';
import { useWatchlist } from '@/context/WatchlistContext';
import MDLAddToListModal from '@/components/ui/MDLAddToListModal';

interface MDLNewsFeedProps {
  popularMovies: MediaItem[];
  nowPlaying: MediaItem[];
  upcoming: MediaItem[];
  topRated: MediaItem[];
}

const genreMap: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 
  18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie', 53: 'Thriller', 
  10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality', 
  10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
};

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

  if (loading || !cast || cast.length === 0) return null;

  return (
    <div className="space-y-2 pt-2 relative group/cast">
      <div className="flex items-center justify-between pr-1">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-white">
          <Users className="w-3.5 h-3.5 text-violet-400" />
          <span>Cast</span>
        </div>

        {/* Carousel Left / Right Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={scrollPrev}
            className="w-6 h-6 rounded-full bg-white/5 hover:bg-violet-600 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all shadow active:scale-95"
            title="Previous Cast"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={scrollNext}
            className="w-6 h-6 rounded-full bg-white/5 hover:bg-violet-600 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all shadow active:scale-95"
            title="Next Cast"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {/* Embla Carousel Viewport */}
      <div className="overflow-hidden py-1" ref={emblaRef}>
        <div className="flex gap-3 sm:gap-4">
          {cast.map((actor) => {
            const profileImg = actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : '/no-poster.png';

            return (
              <Link
                key={actor.id}
                href={`/person/${actor.id}`}
                className="flex-[0_0_auto] flex flex-col items-center group flex-shrink-0 w-14 sm:w-16 text-center"
              >
                {/* Circular Avatar Photo */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-violet-500/30 group-hover:border-violet-400 shadow-xl bg-violet-950 mb-1 transition-all">
                  {actor.profile_path ? (
                    <Image
                      src={profileImg}
                      alt={actor.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-violet-800 text-white font-black text-xs">
                      {actor.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Actor Name */}
                <span className="block font-bold text-white text-[11px] truncate w-full group-hover:text-violet-300 transition-colors leading-tight">
                  {actor.name}
                </span>

                {/* Character / Role Name */}
                {actor.character && (
                  <span className="block text-[9px] text-zinc-400 truncate w-full mt-0.5 leading-tight">
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

export default function MDLNewsFeed({ popularMovies, nowPlaying, upcoming, topRated }: MDLNewsFeedProps) {
  const { getEntry } = useWatchlist();
  const [activeTab, setActiveTab] = useState<'featured' | 'now_playing' | 'upcoming' | 'top_rated'>('featured');
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (hash === '#top-rated-section' || hash === '#top-100-rated' || hash === '#top-rated') {
        setActiveTab('top_rated');
      } else if (hash === '#movies-review-section' || hash === '#movies-review') {
        setActiveTab('featured');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    
    const handleCustomTab = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('set-newsfeed-tab', handleCustomTab);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
      window.removeEventListener('set-newsfeed-tab', handleCustomTab);
    };
  }, []);

  const getActiveList = () => {
    switch (activeTab) {
      case 'now_playing':
        return nowPlaying;
      case 'upcoming':
        return upcoming;
      case 'top_rated':
        return topRated;
      default:
        return popularMovies;
    }
  };

  const currentItems = getActiveList().slice(0, 6);

  const getMediaImage = (item: MediaItem) => {
    if (item.poster_path) return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    if (item.backdrop_path) return `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
    return '/no-poster.png';
  };

  const getCategoryBadge = (item: MediaItem, tab: string) => {
    if (tab === 'now_playing') return 'IN THEATERS';
    if (tab === 'upcoming') return 'COMING SOON';
    if (tab === 'top_rated') return 'TOP RATED';
    return item.title ? 'MOVIE REVIEW' : 'TV DRAMA';
  };

  return (
    <div className="space-y-6">
      {/* MDL Feed Navigation Tabs */}
      <div className="bg-[#14142f] border border-white/8 rounded-2xl p-2.5 flex items-center justify-between flex-wrap gap-2 shadow-lg">
        <div className="touch-scroll flex items-center gap-1.5 max-w-full select-none py-1">
          {[
            { id: 'featured', label: 'Featured Movies' },
            { id: 'now_playing', label: 'In Theaters Now' },
            { id: 'upcoming', label: 'Upcoming Releases' },
            { id: 'top_rated', label: 'Top Rated Reviews' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'text-zinc-300 hover:text-white hover:bg-white/8'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <Link
          href="/explore"
          className="text-xs sm:text-sm font-extrabold text-violet-300 hover:text-white px-3.5 py-1.5 rounded-xl hover:bg-white/8 transition-colors flex items-center gap-1"
        >
          Explore Catalog <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Article & Movie Feed Cards (Exact Match to User Screenshot Layout!) */}
      <div className="space-y-4">
        {currentItems.map((item) => {
          const title = item.title || item.name || 'Untitled';
          const year = (item.release_date || item.first_air_date || '2026').substring(0, 4);
          const score = item.vote_average ? item.vote_average.toFixed(1) : '8.0';
          const imgUrl = getMediaImage(item);
          const badge = getCategoryBadge(item, activeTab);
          const isMovie = !!item.title;
          const typeSubtitle = isMovie ? `Movie - ${year}, 2h 15m` : `Drama Series - ${year}, 16 episodes`;
          const entry = getEntry(item.id);

          const genres = (item.genre_ids || [])
            .map((id: number) => genreMap[id])
            .filter(Boolean)
            .slice(0, 3);

          return (
            <div
              key={item.id}
              className="bg-[#14142f] border border-white/8 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-row items-start gap-3.5 sm:gap-6 hover:border-violet-500/40 transition-all shadow-xl group"
            >
              {/* Poster Thumbnail Image (Left side on mobile & desktop - Matches MyDramaList Screenshot!) */}
              <Link
                href={`/watch/${isMovie ? 'movie' : 'tv'}/${item.id}`}
                className="relative w-28 sm:w-52 md:w-60 h-36 sm:h-80 md:h-[350px] rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 self-start border border-white/10 group-hover:scale-102 transition-transform shadow-2xl bg-violet-950"
              >
                <Image
                  src={imgUrl}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-violet-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase backdrop-blur-sm shadow border border-white/10">
                  {badge}
                </span>
                <span className="absolute bottom-2 right-2 bg-amber-500 text-white text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-md flex items-center gap-0.5 sm:gap-1 shadow border border-amber-400/30">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" /> {score}
                </span>
              </Link>

              {/* Post Details Column (Right of Poster - Matches MyDramaList Screenshot!) */}
              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2 sm:space-y-3">
                <div>
                  {/* Title + Add to List Button */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link href={`/watch/${isMovie ? 'movie' : 'tv'}/${item.id}`} className="block flex-1 min-w-0">
                      <h3 className="text-sm sm:text-xl font-extrabold sm:font-black text-white group-hover:text-violet-300 transition-colors leading-tight sm:leading-snug line-clamp-2">
                        {title}
                      </h3>
                    </Link>

                    <button
                      onClick={() => setModalItem(item)}
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

                  {/* Subtitle: Movie - 2026, 2h 15m */}
                  <p className="text-[11px] sm:text-sm font-bold text-violet-300 mb-1.5">
                    {typeSubtitle}
                  </p>

                  {/* 5 Gold Stars + Score Badge: 8.0 / 10 */}
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

                  {/* Genre Pills: Tag icon + Sci-Fi, Action, Adventure (Desktop / Tablet) */}
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

                  {/* Un-bolded Description Text */}
                  <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed line-clamp-2 sm:line-clamp-3 mb-2 hidden sm:block">
                    {item.overview || 'Explore complete movie ratings, cast lists, plot details, and community reviews.'}
                  </p>

                  {/* Cast Carousel with Arrow Controls */}
                  <div className="hidden sm:block">
                    <MovieCastRow itemId={item.id} mediaType={isMovie ? 'movie' : 'tv'} />
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-300 pt-2.5 border-t border-white/8">
                  <div className="flex items-center gap-2 text-violet-300 font-extrabold">
                    <Film className="w-4 h-4 text-violet-400" />
                    <span>{isMovie ? 'Feature Film' : 'TV Series'}</span>
                  </div>

                  <Link
                    href={`/${isMovie ? 'movie' : 'tv'}/${item.id}`}
                    className="text-xs sm:text-sm font-black text-violet-300 hover:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Review & Watch</span>
                    <ChevronRight className="w-4 h-4" />
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

      {/* Featured Highlights */}
      {popularMovies.length > 0 && (
        <div className="bg-[#14142f] border border-white/8 rounded-2xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-violet-400" />
              Latest Popular Movies & Dramas
            </h3>
            <Link href="/explore" className="text-xs font-bold text-violet-300 hover:text-white flex items-center gap-1">
              View Database <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularMovies.slice(0, 4).map((item) => {
              const title = item.title || item.name || 'Untitled';
              const poster = item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : '/no-poster.png';
              const score = item.vote_average ? item.vote_average.toFixed(1) : '8.5';

              return (
                <Link
                  key={item.id}
                  href={`/${item.title ? 'movie' : 'tv'}/${item.id}`}
                  className="bg-white/3 border border-white/6 rounded-xl p-2.5 hover:border-violet-500/40 transition-all group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 border border-white/10">
                    <Image src={poster} alt={title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-1.5 left-1.5 bg-amber-500/90 text-white font-black text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                      <Star className="w-2.5 h-2.5 fill-current" /> {score}
                    </span>
                  </div>
                  <span className="block font-bold text-white text-xs truncate group-hover:text-violet-300 transition-colors">
                    {title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
