"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dices, X, Play, RefreshCw, Star } from 'lucide-react';
import { MediaItem } from '@/lib/tmdb';

interface RandomPickModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
}

export default function RandomPickModal({ isOpen, onClose, items }: RandomPickModalProps) {
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);

  if (!isOpen) return null;

  const pickRandom = () => {
    if (!items || items.length === 0) return;
    const randomIndex = Math.floor(Math.random() * items.length);
    setSelectedMovie(items[randomIndex]);
  };

  if (!selectedMovie && items.length > 0) {
    pickRandom();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#12122b] border border-violet-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <Dices className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Random Movie Picker</h3>
            <p className="text-xs text-zinc-400">Can't decide what to watch? Let us pick for you!</p>
          </div>
        </div>

        {/* Selected Movie Display */}
        {selectedMovie ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-violet-950">
              <Image
                src={
                  selectedMovie.backdrop_path
                    ? `https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path}`
                    : selectedMovie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                    : '/no-poster.png'
                }
                alt={selectedMovie.title || selectedMovie.name || 'Random Pick'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12122b] via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="bg-violet-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                  {selectedMovie.media_type === 'tv' ? 'TV Series' : 'Movie'}
                </span>
                <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2 py-0.5 rounded-md">
                  <Star className="w-3 h-3 fill-current text-amber-400" />
                  {selectedMovie.vote_average?.toFixed(1) || '8.0'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-white truncate">
                {selectedMovie.title || selectedMovie.name}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {selectedMovie.overview || 'Stream this title in HD quality now.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/watch/${selectedMovie.media_type || 'movie'}/${selectedMovie.id}`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-sm py-3 rounded-xl shadow-lg transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Now</span>
              </Link>

              <button
                onClick={pickRandom}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-3 rounded-xl border border-white/15 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Spin</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-400">Click spin to find a movie!</p>
            <button
              onClick={pickRandom}
              className="mt-4 bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl transition-all"
            >
              Pick Movie
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
