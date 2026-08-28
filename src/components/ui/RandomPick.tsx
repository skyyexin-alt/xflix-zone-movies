"use client";

import { useState, useEffect } from 'react';
import { Shuffle, X, Play, Info } from 'lucide-react';
import Link from 'next/link';
import { MediaItem, getDiscoverMovies } from '@/lib/tmdb';

export default function RandomPick() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<MediaItem | null>(null);

  const fetchRandom = async () => {
    setLoading(true);
    try {
      // Pick a random page between 1 and 100 for variety
      const randomPage = Math.floor(Math.random() * 100) + 1;
      const data = await getDiscoverMovies({ page: randomPage.toString() });
      if (data.results && data.results.length > 0) {
        // Pick a random item from the page
        const randomItem = data.results[Math.floor(Math.random() * data.results.length)];
        setItem(randomItem);
      }
    } catch (e) {
      console.error('Error fetching random item', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !item) {
      fetchRandom();
    }
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button 
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4 rounded-full shadow-[0_0_20px_rgba(108,92,231,0.5)] hover:scale-110 transition-transform flex items-center justify-center text-white"
        aria-label="Random Pick"
      >
        <Shuffle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1a3e] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {loading || !item ? (
              <div className="p-12 text-center h-[400px] flex flex-col items-center justify-center">
                <Shuffle className="w-10 h-10 text-violet-500 animate-spin mb-4" />
                <p className="text-zinc-400">Finding something good...</p>
              </div>
            ) : (
              <div>
                <div className="relative aspect-video w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : 'https://via.placeholder.com/780x439?text=No+Image'} 
                    alt={item.title || item.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a3e] to-transparent"></div>
                </div>
                
                <div className="p-6 pt-0 relative -mt-10">
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title || item.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-amber-500 text-sm font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                      ★ {item.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-zinc-400 text-sm">
                      {(item.release_date || item.first_air_date || '').substring(0, 4)}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm line-clamp-3 mb-6">
                    {item.overview || 'No synopsis available.'}
                  </p>
                  
                  <div className="flex gap-3">
                    <Link 
                      href={`/watch/movie/${item.id}`}
                      onClick={handleClose}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-black" /> Play
                    </Link>
                    <Link 
                      href={`/watch/movie/${item.id}`}
                      onClick={handleClose}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                    >
                      <Info className="w-4 h-4" /> Watch Now
                    </Link>
                  </div>
                  
                  <button 
                    onClick={fetchRandom}
                    className="w-full mt-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Shuffle className="w-4 h-4" /> Spin Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
