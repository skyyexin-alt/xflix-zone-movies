"use client";

import Link from 'next/link';
import Script from 'next/script';
import Container from '@/components/ui/Container';
import AdsKeeperWidget from '@/components/ui/AdsKeeperWidget';
import { Film } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0e0b1d] border-t border-white/10 text-white pt-10 sm:pt-12 pb-24 sm:pb-16 overflow-hidden">
      {/* Footer Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6c5ce7]/50 to-transparent" />

      <Container>
        {/* Mobile-Optimized 2-Column Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-x-5 gap-y-8 pb-10 border-b border-white/10">
          
          {/* Brand Col (Spans full 2 cols on mobile, 2 cols on desktop) */}
          <div className="col-span-2 lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#6c5ce7] flex items-center justify-center text-white shadow-md shadow-[#6c5ce7]/40">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">xFlix Zone</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Stream your favorite movies and TV shows in HD quality. Free, fast, and always updated with the latest releases.
            </p>
          </div>

          {/* Col 1: Browse */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Browse</h4>
            <div className="flex flex-col space-y-2 text-xs text-zinc-400 font-medium">
              <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
              <Link href="/tv" className="hover:text-white transition-colors">TV Shows</Link>
              <Link href="/trending" className="hover:text-white transition-colors">Trending</Link>
              <Link href="/top-rated" className="hover:text-white transition-colors">Top Rated</Link>
            </div>
          </div>

          {/* Col 2: Movies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Movies</h4>
            <div className="flex flex-col space-y-2 text-xs text-zinc-400 font-medium">
              <Link href="/movies" className="hover:text-white transition-colors">Popular</Link>
              <Link href="/now-playing" className="hover:text-white transition-colors">Now Playing</Link>
              <Link href="/upcoming" className="hover:text-white transition-colors">Upcoming</Link>
              <Link href="/top-rated" className="hover:text-white transition-colors">Top Rated</Link>
            </div>
          </div>

          {/* Col 3: TV Shows */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">TV Shows</h4>
            <div className="flex flex-col space-y-2 text-xs text-zinc-400 font-medium">
              <Link href="/tv" className="hover:text-white transition-colors">Popular</Link>
              <Link href="/top-rated?type=tv" className="hover:text-white transition-colors">Top Rated</Link>
              <Link href="/airing-today" className="hover:text-white transition-colors">Airing Today</Link>
              <Link href="/networks" className="hover:text-white transition-colors">Networks</Link>
            </div>
          </div>

          {/* Col 4: Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Discover</h4>
            <div className="flex flex-col space-y-2 text-xs text-zinc-400 font-medium">
              <Link href="/genre" className="hover:text-white transition-colors">Genres</Link>
              <Link href="/country" className="hover:text-white transition-colors">Countries</Link>
              <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
              <Link href="/new-releases" className="hover:text-white transition-colors">New Releases</Link>
              <Link href="/watchlist" className="hover:text-white transition-colors">My Watchlist</Link>
            </div>
          </div>

        </div>

        {/* Legal Links Bar */}
        <div className="flex items-center justify-center gap-5 sm:gap-6 py-4 text-xs text-zinc-400 flex-wrap">
          <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        {/* AdsKeeper Widget At Bottom */}
        <AdsKeeperWidget />

        {/* Copyright & Visitor Counter */}
        <div className="text-center pt-2 text-xs text-zinc-500 space-y-2">
          <p>&copy; {currentYear} NextZone Movies. All rights reserved. This site does not store any files on its server.</p>

          {/* Live Visitor Counter Widget */}
          <div className="flex justify-center pt-2">
            <Script id="_wauset" strategy="afterInteractive">
              {`var _wau = _wau || []; _wau.push(["dynamic", "s7tc6l2q7r", "set", "c4302bffffff", "small"]);`}
            </Script>
            <Script src="https://waust.at/d.js" strategy="afterInteractive" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
