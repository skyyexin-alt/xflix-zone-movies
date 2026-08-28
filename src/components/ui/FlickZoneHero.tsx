"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Play, Info, Star } from 'lucide-react';
import { MediaItem } from '@/lib/tmdb';

interface FlickZoneHeroProps {
  item: MediaItem | null;
}

export default function FlickZoneHero({ item }: FlickZoneHeroProps) {
  if (!item) return null;

  const title = item.title || item.name || 'Featured Release';
  const overview = item.overview || 'Stream high quality movies and TV shows online free in HD on NextZone Movies.';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '7.9';
  const releaseYear = (item.release_date || item.first_air_date || '2026').substring(0, 4);
  const mediaType = item.media_type === 'tv' ? 'TV' : 'Movie';
  const backdropUrl = item.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
    : 'https://image.tmdb.org/t/p/w1280/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg';

  return (
    <section className="relative w-full min-h-[460px] sm:min-h-[540px] md:min-h-[600px] overflow-hidden mb-8 bg-[#0e0b1d] border-b border-white/10">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          className="object-cover object-top"
        />
        {/* FlickZone Dark Purple Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b1d] via-[#0e0b1d]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0b1d] via-[#0e0b1d]/70 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pt-28 pb-12 sm:pb-16 space-y-4">
        {/* Header Tagline */}
        <h1 className="text-xs sm:text-sm font-medium text-white/50 uppercase tracking-wider mb-1">
          NextZone &mdash; Watch Movies &amp; TV Shows Online Free in HD
        </h1>

        {/* FlickZone Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#6c5ce7]/20 text-[#a29bfe] border border-[#6c5ce7]/40">
            {mediaType}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            {rating}
          </span>
          <span className="px-3 py-1 text-xs rounded-full bg-white/5 text-zinc-300 border border-white/10">
            {releaseYear}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg max-w-3xl">
          {title}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-zinc-300 line-clamp-3 leading-relaxed max-w-[540px]">
          {overview}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 flex-wrap pt-4">
          <Link
            href={`/watch/${item.media_type || 'movie'}/${item.id}`}
            className="flex items-center gap-2.5 bg-[#6c5ce7] hover:bg-[#5a49df] text-white text-base font-bold px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#6c5ce7]/40 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Watch Now</span>
          </Link>

          <Link
            href={`/watch/${item.media_type || 'movie'}/${item.id}`}
            className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 text-base font-medium px-6 py-3 rounded-xl transition-all backdrop-blur-md active:scale-95"
          >
            <Info className="w-5 h-5" />
            <span>Watch Full HD</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
