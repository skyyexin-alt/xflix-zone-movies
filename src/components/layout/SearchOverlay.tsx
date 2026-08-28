"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Search as SearchIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { searchMedia, MediaItem } from '@/lib/tmdb';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const data = await searchMedia(query);
          setResults(data.results.filter((item: MediaItem) => item.media_type !== 'person'));
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1a3e]/95 backdrop-blur-xl animate-in fade-in duration-200">
      <Container className={`py-6 md:py-12 h-full flex flex-col ${(!query && results.length === 0) ? 'justify-center md:justify-start' : 'justify-start'}`}>
        <div className="flex items-center gap-4 relative">
          <SearchIcon className="w-6 h-6 text-zinc-400 absolute left-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for movies, TV shows..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="absolute right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto scrollbar-hide pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-violet-500">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {results.map(item => {
                const title = item.title || item.name;
                const isMovie = item.media_type === 'movie';
                const href = `/watch/${isMovie ? 'movie' : 'tv'}/${item.id}`;
                const poster = item.poster_path 
                  ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                  : 'https://via.placeholder.com/342x513?text=No+Poster';
                  
                return (
                  <Link href={href} key={item.id} onClick={onClose} className="group flex flex-col gap-2 w-full">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-white/5 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={poster} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-medium text-sm text-white truncate">{title}</h3>
                    <p className="text-xs text-zinc-500 capitalize">{item.media_type}</p>
                  </Link>
                );
              })}
            </div>
          ) : query.length > 1 ? (
            <div className="text-center py-20 text-zinc-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
