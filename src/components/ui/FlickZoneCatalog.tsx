"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import MovieCard from '@/components/ui/MovieCard';
import Container from '@/components/ui/Container';
import { MediaItem } from '@/lib/tmdb';
import { ChevronLeft, ChevronRight, Filter, ChevronDown } from 'lucide-react';

interface FlickZoneCatalogProps {
  title: string;
  items: MediaItem[];
  currentPage: number;
  totalPages: number;
  currentType: 'movie' | 'tv' | 'all';
  currentSort: string;
  currentGenre?: string;
  currentYear?: string;
  baseUrl: string;
}

const genresList = [
  { id: '', name: 'All Genres' },
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' }
];

const yearsList = [
  'All Years', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'
];

export default function FlickZoneCatalog({
  title,
  items,
  currentPage,
  totalPages = 500,
  currentType,
  currentSort,
  currentGenre = '',
  currentYear = '',
  baseUrl
}: FlickZoneCatalogProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    router.push(url.pathname + url.search);
  };

  const handleFilterChange = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value && value !== 'All Genres' && value !== 'All Years') {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    url.searchParams.set('page', '1');
    router.push(url.pathname + url.search);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0e0b1d] text-white">
      <Container className="space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          {/* Type Filter Pills (Popular, Top Rated, Now Playing, Upcoming) */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`${baseUrl}?sort=popular`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentSort === 'popular' || !currentSort
                  ? 'bg-[#6c5ce7] text-white shadow-md shadow-[#6c5ce7]/30'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              Popular
            </Link>

            <Link
              href={`${baseUrl}?sort=top_rated`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentSort === 'top_rated'
                  ? 'bg-[#6c5ce7] text-white shadow-md shadow-[#6c5ce7]/30'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              Top Rated
            </Link>

            <Link
              href={`${baseUrl}?sort=now_playing`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentSort === 'now_playing'
                  ? 'bg-[#6c5ce7] text-white shadow-md shadow-[#6c5ce7]/30'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              Now Playing
            </Link>

            <Link
              href={`${baseUrl}?sort=upcoming`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentSort === 'upcoming'
                  ? 'bg-[#6c5ce7] text-white shadow-md shadow-[#6c5ce7]/30'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              Upcoming
            </Link>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex items-center gap-3 flex-wrap bg-[#14142f] p-3 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-300 pr-2">
            <Filter className="w-4 h-4 text-[#6c5ce7]" />
            <span>Filters:</span>
          </div>

          {/* Genre Dropdown */}
          <select
            value={currentGenre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="bg-[#0b0b1a] text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#6c5ce7]"
          >
            {genresList.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={currentYear}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="bg-[#0b0b1a] text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#6c5ce7]"
          >
            {yearsList.map((y) => (
              <option key={y} value={y === 'All Years' ? '' : y}>{y}</option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={currentSort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="bg-[#0b0b1a] text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#6c5ce7]"
          >
            <option value="popular">Sort: Popularity</option>
            <option value="top_rated">Sort: Rating</option>
            <option value="newest">Sort: Release Date</option>
          </select>
        </div>

        {/* 6-Column FlickZone Movie Card Grid */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
            {items.map((item) => (
              <MovieCard key={item.id} item={item} className="w-full" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-3">
            <p className="text-base text-zinc-400 font-medium">No movies found matching your filters.</p>
            <Link
              href={baseUrl}
              className="inline-block bg-[#6c5ce7] text-white text-xs font-bold px-5 py-2.5 rounded-xl"
            >
              Clear Filters
            </Link>
          </div>
        )}

        {/* FlickZone Pagination Controls */}
        <div className="flex items-center justify-center gap-4 pt-10 border-t border-white/10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-bold text-zinc-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 bg-[#6c5ce7] hover:bg-[#5a49df] disabled:opacity-30 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </Container>
    </div>
  );
}
