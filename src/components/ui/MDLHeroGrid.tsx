"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star, Sparkles, Film } from 'lucide-react';
import { MediaItem } from '@/lib/tmdb';

interface MDLHeroGridProps {
  items: MediaItem[];
}

export default function MDLHeroGrid({ items }: MDLHeroGridProps) {
  if (!items || items.length === 0) return null;

  const mainItem = items[0];
  const sideItems = items.slice(1, 3);

  const getBackdrop = (item: MediaItem) => {
    if (item.backdrop_path) return `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
    if (item.poster_path) return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    return '/no-poster.png';
  };

  const mainTitle = mainItem.title || mainItem.name || 'Latest Movie Release';
  const mainYear = (mainItem.release_date || mainItem.first_air_date || '').substring(0, 4);

  return (
    <div className="grid grid-cols-12 gap-2.5 sm:gap-4 mb-6 sm:mb-8 items-stretch h-[240px] sm:h-[360px] lg:h-[440px]">
      {/* Main Big Featured Article (Left - 7 cols on mobile & desktop!) */}
      <div className="col-span-7 relative group rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#14142f] h-full flex flex-col justify-end">
        <Image
          src={getBackdrop(mainItem)}
          alt={mainTitle}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1f] via-[#0d0d1f]/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-7 space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-violet-600 text-white text-[9px] sm:text-xs font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg uppercase tracking-wider flex items-center gap-1 shadow">
              <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-violet-300" />
              HOT RELEASE
            </span>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] sm:text-xs font-black px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1">
              <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" /> {mainItem.vote_average ? mainItem.vote_average.toFixed(1) : '8.5'} / 10
            </span>
            {mainYear && (
              <span className="text-[9px] sm:text-xs text-white font-extrabold bg-white/20 px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-white/10">
                {mainYear}
              </span>
            )}
          </div>

          <Link href={`/watch/${mainItem.title ? 'movie' : 'tv'}/${mainItem.id}`} className="block">
            <h2 className="text-xs sm:text-2xl lg:text-3xl font-black text-white group-hover:text-violet-300 transition-colors leading-tight sm:leading-snug line-clamp-2">
              Watch Now: {mainTitle}
            </h2>
          </Link>

          <p className="text-xs sm:text-base text-zinc-200 font-medium line-clamp-2 leading-relaxed drop-shadow hidden sm:block">
            {mainItem.overview || 'Everything you need to know about the latest premiere, cast ratings, and plot details.'}
          </p>

          <div className="flex items-center gap-3 text-[10px] sm:text-sm text-violet-300 font-extrabold pt-0.5">
            <span className="flex items-center gap-1">
              <Film className="w-3 h-3 sm:w-4 sm:h-4 text-violet-400" />
              {mainItem.title ? 'Featured Movie' : 'Featured Series'}
            </span>
          </div>
        </div>
      </div>

      {/* 2 Side Stacked Cards (Right - 5 cols on mobile & desktop!) */}
      <div className="col-span-5 flex flex-col gap-2 sm:gap-4 justify-between h-full">
        {sideItems.map((item, idx) => {
          const itemTitle = item.title || item.name || 'Upcoming Release';
          const itemYear = (item.release_date || item.first_air_date || '').substring(0, 4);

          return (
            <div
              key={item.id}
              className="relative group rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#14142f] h-full flex flex-col justify-end flex-1"
            >
              <Image
                src={getBackdrop(item)}
                alt={itemTitle}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1f] via-[#0d0d1f]/60 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-5 space-y-0.5 sm:space-y-1.5">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="bg-violet-600 text-white text-[8px] sm:text-xs font-black px-1.5 py-0.5 rounded uppercase tracking-wide shadow">
                    {idx === 0 ? 'TRENDING NEWS' : 'LATEST PREMIERE'}
                  </span>
                  <span className="bg-amber-500/20 text-amber-400 text-[8px] sm:text-xs font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-500/30">
                    <Star className="w-2.5 h-2.5 fill-current" /> {item.vote_average ? item.vote_average.toFixed(1) : '8.0'}
                  </span>
                </div>

                <Link href={`/watch/${item.title ? 'movie' : 'tv'}/${item.id}`} className="block">
                  <h3 className="text-[11px] sm:text-base font-black text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-tight">
                    {itemTitle} {itemYear ? `(${itemYear})` : ''} - Stream in HD
                  </h3>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
