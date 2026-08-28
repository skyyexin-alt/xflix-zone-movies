"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Film, Tv, User, Star, ArrowRight, Loader2, Sparkles, Flame } from 'lucide-react';

interface CenteredSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CenteredSearchModal({ isOpen, onClose }: CenteredSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Live search debounced fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '5d067b9d81cc3970f1365e1e9862ce6b';
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`
        );
        if (res.ok) {
          const data = await res.json();
          // Filter valid results with titles/names
          const items = (data.results || []).slice(0, 8);
          setResults(items);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#14142f] border border-violet-500/30 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(139,92,246,0.3)] space-y-4 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header & Search Input */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-violet-500 transition-all shadow-inner">
          <Search className="w-5 h-5 text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all movies, TV shows, actors, directors..."
            className="w-full bg-transparent text-white placeholder-zinc-400 focus:outline-none text-sm sm:text-base font-bold"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-violet-400 animate-spin shrink-0" />
          ) : query ? (
            <button onClick={() => setQuery('')} className="p-1 rounded-full text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors ml-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Live Results or Quick Suggestions */}
        <div className="max-h-[55vh] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400 space-y-2">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              <p className="text-xs font-bold">Searching movie database...</p>
            </div>
          ) : query.trim() && results.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-black text-violet-400 uppercase tracking-widest block mb-2 px-1">
                Live Search Results ({results.length})
              </span>
              {results.map((item) => {
                const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
                const title = item.title || item.name || 'Untitled';
                const year = (item.release_date || item.first_air_date || '').substring(0, 4);
                const score = item.vote_average ? item.vote_average.toFixed(1) : null;
                const posterPath = item.poster_path || item.profile_path;
                const imgUrl = posterPath ? `https://image.tmdb.org/t/p/w185${posterPath}` : '/no-poster.png';

                return (
                  <Link
                    key={`${mediaType}-${item.id}`}
                    href={mediaType === 'person' ? `/explore?cat=Top+Actors` : `/watch/${mediaType}/${item.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/4 hover:bg-violet-600/20 border border-white/6 hover:border-violet-500/40 transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-11 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-violet-950 shadow-md">
                        <Image src={imgUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            mediaType === 'movie' ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40' :
                            mediaType === 'tv' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {mediaType}
                          </span>
                          {year && <span className="text-[10px] text-zinc-400 font-semibold">• {year}</span>}
                        </div>
                        <h4 className="font-extrabold text-white text-sm group-hover:text-violet-300 transition-colors truncate">
                          {title}
                        </h4>
                        {item.overview && (
                          <p className="text-[11px] text-zinc-400 truncate max-w-sm mt-0.5">
                            {item.overview}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {score && (
                        <span className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                          <Star className="w-3 h-3 fill-current" />
                          {score}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="text-center py-10 bg-white/3 rounded-2xl border border-white/6 space-y-2">
              <Search className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-zinc-300">No movies or actors found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-500">Try searching for popular titles like Spider-Man, Dune, or Tom Holland.</p>
            </div>
          ) : (
            /* Quick Suggestions when input is empty */
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-black text-violet-400 uppercase tracking-widest block px-1">
                Popular Quick Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Spider-Man', icon: Flame },
                  { label: 'Avatar', icon: Sparkles },
                  { label: 'Supergirl', icon: Film },
                  { label: 'Tom Holland', icon: User },
                  { label: 'Zendaya', icon: User },
                  { label: 'Top Rated Movies', icon: Star },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setQuery(item.label)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-violet-600/30 border border-white/10 hover:border-violet-500/40 text-xs font-extrabold text-zinc-300 hover:text-white transition-all"
                  >
                    <item.icon className="w-3.5 h-3.5 text-violet-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: View Full Results Button */}
        {query.trim() && (
          <div className="pt-3 border-t border-white/10 text-center">
            <Link
              href={`/explore?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>See All Search Results in Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
