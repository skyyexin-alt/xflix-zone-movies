"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Sparkles, Star, Layers, Tv } from 'lucide-react';

function TabsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams?.get('sort');

  // Determine active tab
  const isTopRated = pathname === '/explore' && sort === 'top_rated';
  const isExplore = pathname === '/explore' && sort !== 'top_rated';
  const isWatchlist = pathname === '/watchlist';
  const isReviews = pathname === '/' || pathname === '/lists';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pb-6 w-full select-none">
      {/* 1. Explore Movie Database */}
      <Link
        href="/explore"
        className={`flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl transition-all shadow-md text-center ${isExplore
          ? 'bg-violet-600 text-white shadow-violet-600/40 ring-2 ring-violet-400/60 scale-[1.02] font-black'
          : 'bg-[#14142f] text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white font-bold'
          }`}
      >
        <Sparkles className={`w-4 h-4 shrink-0 ${isExplore ? 'text-white fill-current animate-pulse' : 'text-violet-400'}`} />
        <span className="truncate">Explore Movie Database</span>
      </Link>

      {/* 2. Top 100 Rated */}
      <Link
        href="/explore?type=movie&sort=top_rated&cat=Top+100+Rated"
        className={`flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl transition-all shadow-md text-center ${isTopRated
          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-amber-500/40 ring-2 ring-amber-300 scale-[1.02] font-black'
          : 'bg-[#14142f] text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 font-bold'
          }`}
      >
        <Star className={`w-4 h-4 shrink-0 fill-current ${isTopRated ? 'text-black' : 'text-amber-400'}`} />
        <span className="truncate">Top 100 Rated</span>
      </Link>

      {/* 3. Movies Review */}
      <Link
        href="/"
        className={`flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl transition-all shadow-md text-center ${isReviews
          ? 'bg-violet-600 text-white shadow-violet-600/40 ring-2 ring-violet-400/60 scale-[1.02] font-black'
          : 'bg-[#14142f] text-violet-300 border border-white/10 hover:bg-white/10 hover:text-white font-bold'
          }`}
      >
        <Layers className={`w-4 h-4 shrink-0 ${isReviews ? 'text-white' : 'text-violet-400'}`} />
        <span className="truncate">Movies Review</span>
      </Link>

      {/* 4. My Watchlist Tracker */}
      <Link
        href="/watchlist"
        className={`flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl transition-all shadow-md text-center ${isWatchlist
          ? 'bg-emerald-600 text-white shadow-emerald-600/40 ring-2 ring-emerald-400/60 scale-[1.02] font-black'
          : 'bg-[#14142f] text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white font-bold'
          }`}
      >
        <Tv className={`w-4 h-4 shrink-0 ${isWatchlist ? 'text-white' : 'text-emerald-400'}`} />
        <span className="truncate">My Watchlist Tracker</span>
      </Link>
    </div>
  );
}

export default function QuickFilterTabs() {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pb-6 w-full animate-pulse">
        <div className="h-12 bg-[#14142f] rounded-2xl border border-white/10"></div>
        <div className="h-12 bg-[#14142f] rounded-2xl border border-white/10"></div>
        <div className="h-12 bg-[#14142f] rounded-2xl border border-white/10"></div>
        <div className="h-12 bg-[#14142f] rounded-2xl border border-white/10"></div>
      </div>
    }>
      <TabsContent />
    </Suspense>
  );
}
