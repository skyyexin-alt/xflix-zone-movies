"use client";

import { useState, useEffect } from 'react';
import { useWatchlist } from '@/context/WatchlistContext';
import Container from '@/components/ui/Container';
import MovieCard from '@/components/ui/MovieCard';
import Link from 'next/link';
import { Heart, Trash2, Film } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function WatchlistPage() {
  const { watchlist, clearWatchlist, isLoaded } = useWatchlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#0e0b1d] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#6c5ce7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const itemCount = watchlist.length;

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#0e0b1d] text-white">
      <Container className="space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>My Watchlist</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>

          {itemCount > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear your watchlist?')) {
                  clearWatchlist();
                }
              }}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear Watchlist</span>
            </button>
          )}
        </div>

        {/* Watchlist Movie Poster Grid */}
        {itemCount > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
            {watchlist.map((entry) => (
              <MovieCard 
                key={entry.item.id} 
                item={entry.item} 
                className="w-full" 
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe] mx-auto shadow-xl">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Your Watchlist is empty</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click the heart icon on any movie or TV show poster to save titles to your watchlist.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/movies"
                className="inline-flex items-center gap-2 bg-[#6c5ce7] hover:bg-[#5a49df] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#6c5ce7]/30"
              >
                <Film className="w-4 h-4" />
                <span>Explore Movies</span>
              </Link>
            </div>
          </div>
        )}

      </Container>
    </div>
  );
}
