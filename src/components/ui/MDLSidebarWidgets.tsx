"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star, Award, MessageSquare, TrendingUp, ChevronRight, User } from 'lucide-react';
import { MediaItem } from '@/lib/tmdb';

interface MDLSidebarWidgetsProps {
  topRated: MediaItem[];
  upcoming: MediaItem[];
}

export default function MDLSidebarWidgets({ topRated }: MDLSidebarWidgetsProps) {
  const topAiring = topRated.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ── Widget 1: Top 5 Airing & Rated Leaderboard (100% Bigger Posters & 30% Bigger Text!) ── */}
      <div className="bg-[#14142f] border border-white/8 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-violet-400" />
            TOP AIRING & RATED
          </h3>
          <Link href="/top-rated" className="text-xs font-bold text-violet-300 hover:text-white flex items-center gap-0.5">
            Top 100 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {topAiring.map((item, idx) => {
            const title = item.title || item.name || 'Untitled';
            const poster = item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : '/no-poster.png';
            const score = item.vote_average ? item.vote_average.toFixed(1) : '8.5';
            const typeLabel = item.title ? 'MOVIE' : 'TV';

            return (
              <div key={item.id} className="flex items-center gap-4 group">
                {/* Rank number badge (30% Bigger Text) */}
                <span className={`w-8 text-center text-base sm:text-lg font-black flex-shrink-0 ${
                  idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-zinc-300' : idx === 2 ? 'text-amber-600' : 'text-zinc-500'
                }`}>
                  #{idx + 1}
                </span>

                {/* Poster (100% Bigger!) */}
                <Link 
                  href={`/watch/${item.title ? 'movie' : 'tv'}/${item.id}`} 
                  className="relative w-18 sm:w-20 h-26 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-xl group-hover:scale-102 transition-transform"
                >
                  <Image src={poster} alt={title} fill className="object-cover group-hover:scale-105 transition-transform" />
                </Link>

                {/* Info (30% Bigger Text) */}
                <div className="flex-1 min-w-0 space-y-1">
                  <Link href={`/watch/${item.title ? 'movie' : 'tv'}/${item.id}`} className="block font-black text-white text-sm sm:text-base truncate group-hover:text-violet-300 transition-colors leading-snug">
                    {title}
                  </Link>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-lg text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-current" /> {score}
                    </span>
                    <span className="text-xs text-zinc-400 font-extrabold uppercase tracking-wide">{typeLabel}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Widget 2: Recent Community Reviews (30% Bigger Text) ── */}
      <div className="bg-[#14142f] border border-white/8 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-400" />
            RECENT REVIEWS
          </h3>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="bg-white/3 border border-white/6 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-300 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-white text-xs sm:text-sm">KDramaLover</span>
              </div>
              <span className="bg-amber-500/15 text-amber-400 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-500/30">
                <Star className="w-3 h-3 fill-current" /> 9.5 / 10
              </span>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
              &ldquo;Incredible writing and unforgettable acting performances! A must-watch masterpiece.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* ── Widget 3: Popular Active Discussions (30% Bigger Text) ── */}
      <div className="bg-[#14142f] border border-white/8 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            ACTIVE THREADS
          </h3>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm">
          {[
            { title: 'Which movie had the best plot twist of 2026 so far?', replies: 48, time: '2h ago' },
            { title: 'Favorite main couple chemistry in action-romance series?', replies: 32, time: '4h ago' },
          ].map((thread, i) => (
            <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
              <Link href="/lists" className="font-bold text-white hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                {thread.title}
              </Link>
              <div className="flex items-center justify-between text-xs text-zinc-400 mt-1.5 font-semibold">
                <span>{thread.replies} Replies</span>
                <span>{thread.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
