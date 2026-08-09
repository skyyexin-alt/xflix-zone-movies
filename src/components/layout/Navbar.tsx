"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from '@/components/ui/Container';
import Image from 'next/image';
import { 
  Film, Search, ChevronDown, Heart, Dices, TrendingUp, Tag, Star, 
  Layers, Globe, Tv, Calendar, PlayCircle, Clock, Radio, Menu, X,
  Home, Sparkles, Compass, Smartphone, ExternalLink
} from 'lucide-react';
import CenteredSearchModal from '@/components/layout/CenteredSearchModal';
import RandomPickModal from '@/components/ui/RandomPickModal';
import { useWatchlist } from '@/context/WatchlistContext';

export default function Navbar() {
  const pathname = usePathname();
  const { watchlist } = useWatchlist();
  const [browseOpen, setBrowseOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [randomModalOpen, setRandomModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e0b1d]/95 backdrop-blur-md border-b border-white/10 py-4.5">
        <Container className="flex items-center justify-between">
          
          {/* Left Side: Logo & Main Navigation Menu */}
          <div className="flex items-center gap-10">
            
            {/* xFlix Zone Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#6c5ce7] flex items-center justify-center text-white shadow-lg shadow-[#6c5ce7]/40 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">xFlix Zone</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-base font-bold">
              <Link 
                href="/" 
                className={`transition-colors py-1.5 ${pathname === '/' ? 'text-white font-extrabold' : 'text-zinc-300 hover:text-white'}`}
              >
                Home
              </Link>
              
              <Link 
                href="/movies" 
                className={`transition-colors py-1.5 ${pathname === '/movies' ? 'text-white font-extrabold' : 'text-zinc-300 hover:text-white'}`}
              >
                Movies
              </Link>

              <Link 
                href="/tv" 
                className={`transition-colors py-1.5 ${pathname === '/tv' ? 'text-white font-extrabold' : 'text-zinc-300 hover:text-white'}`}
              >
                TV Shows
              </Link>

              {/* FlickZone Dropdown Menu: Browse */}
              <div 
                className="relative"
                onMouseEnter={() => setBrowseOpen(true)}
                onMouseLeave={() => setBrowseOpen(false)}
              >
                <button 
                  onClick={() => setBrowseOpen(!browseOpen)}
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-white py-1.5 transition-colors font-bold text-base"
                >
                  <span>Browse</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${browseOpen ? 'rotate-180 text-[#6c5ce7]' : ''}`} />
                </button>

                {/* Dropdown Card */}
                {browseOpen && (
                  <div className="absolute top-full left-0 w-52 bg-[#16122b]/98 border border-white/15 rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl animate-in fade-in duration-150 z-50">
                    <Link href="/genre/action" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>Action Movies</span>
                    </Link>
                    <Link href="/genre/comedy" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span>Comedy Movies</span>
                    </Link>
                    <Link href="/genre/drama" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>Drama Movies</span>
                    </Link>
                    <Link href="/genre/sci-fi" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>Sci-Fi & Fantasy</span>
                    </Link>
                    <div className="my-1 border-t border-white/10" />
                    <Link href="/country" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>Countries</span>
                    </Link>
                    <Link href="/networks" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <Tv className="w-4 h-4 text-blue-400" />
                      <span>Networks</span>
                    </Link>
                    <Link href="/year/2026" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>2026 Movies</span>
                    </Link>
                    <Link href="/now-playing" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <PlayCircle className="w-4 h-4 text-[#6c5ce7]" />
                      <span>Now Playing</span>
                    </Link>
                    <Link href="/upcoming" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <Clock className="w-4 h-4 text-rose-400" />
                      <span>Upcoming</span>
                    </Link>
                    <Link href="/airing-today" onClick={() => setBrowseOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-all">
                      <Radio className="w-4 h-4 text-[#6c5ce7]" />
                      <span>Airing Today</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                href="/explore" 
                className="text-white font-extrabold tracking-wider hover:opacity-80 transition-opacity"
              >
                FlixNetwork
              </Link>
            </nav>

          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-zinc-300 transition-all"
            >
              <Search className="w-4.5 h-4.5 opacity-70" />
              <span className="hidden sm:inline opacity-70 font-medium">Enter keywords...</span>
            </button>

            {/* Random Pick Button */}
            <button
              onClick={() => setRandomModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-200 hover:text-white transition-all"
              title="Random Movie Picker"
            >
              <Dices className="w-5 h-5" />
            </button>

            {/* My List / Watchlist Button */}
            <Link
              href="/watchlist"
              className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-200 hover:text-white transition-all relative"
              title="My List"
            >
              <Heart className="w-4 h-4" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6c5ce7] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </Container>
      </header>

      {/* Ultra-Cool Mobile Menu Glass Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#090914]/98 backdrop-blur-2xl animate-in fade-in duration-200">
          
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#14142f]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 font-bold text-white">
              <div className="w-8 h-8 rounded-lg bg-[#6c5ce7] flex items-center justify-center text-white shadow-md shadow-[#6c5ce7]/40">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">xFlix Zone</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 p-3 rounded-xl text-xs font-bold text-[#a29bfe] hover:bg-[#6c5ce7]/30 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRandomModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
              >
                <Dices className="w-4 h-4" />
                <span>Random Pick</span>
              </button>
            </div>

            {/* Main Navigation Items */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest px-2">Main Navigation</span>
              
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)} 
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${
                  pathname === '/' ? 'bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/30' : 'text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Home className="w-5 h-5 text-[#6c5ce7]" />
                <span>Home</span>
              </Link>

              <Link 
                href="/movies" 
                onClick={() => setMobileMenuOpen(false)} 
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${
                  pathname === '/movies' ? 'bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/30' : 'text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Film className="w-5 h-5 text-blue-400" />
                <span>Movies</span>
              </Link>

              <Link 
                href="/tv" 
                onClick={() => setMobileMenuOpen(false)} 
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${
                  pathname === '/tv' ? 'bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/30' : 'text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Tv className="w-5 h-5 text-cyan-400" />
                <span>TV Shows</span>
              </Link>

              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('trigger-install-popup'));
                  }
                }} 
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-zinc-200 hover:bg-white/5 transition-all w-full text-left"
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>Install App</span>
                <span className="ml-auto bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow animate-pulse">
                  HOT
                </span>
              </button>

              <a 
                href="https://xflix.ink"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 text-white hover:bg-[#6c5ce7]/30 transition-all w-full shadow-lg shadow-[#6c5ce7]/20"
              >
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>XFlix Review</span>
                <ExternalLink className="ml-auto w-4 h-4 text-zinc-400" />
              </a>

              <Link 
                href="/watchlist" 
                onClick={() => setMobileMenuOpen(false)} 
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${
                  pathname === '/watchlist' ? 'bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/30' : 'text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Heart className="w-5 h-5 text-rose-400 fill-current" />
                <span>My Watchlist</span>
                {watchlist.length > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    {watchlist.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Categories & Collections */}
            <div className="space-y-1 pt-2 border-t border-white/10">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest px-2">Browse & Categories</span>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link href="/trending" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/3 hover:bg-white/10 transition-all border border-white/5">
                  <TrendingUp className="w-4 h-4 text-[#6c5ce7]" />
                  <span>Trending</span>
                </Link>

                <Link href="/top-rated" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/3 hover:bg-white/10 transition-all border border-white/5">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span>Top Rated</span>
                </Link>

                <Link href="/genre" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/3 hover:bg-white/10 transition-all border border-white/5">
                  <Tag className="w-4 h-4 text-violet-400" />
                  <span>Genres</span>
                </Link>

                <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/3 hover:bg-white/10 transition-all border border-white/5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Collections</span>
                </Link>

                <Link href="/country" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/3 hover:bg-white/10 transition-all border border-white/5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Countries</span>
                </Link>

                <Link href="/now-playing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/3 hover:bg-white/10 transition-all border border-white/5">
                  <PlayCircle className="w-4 h-4 text-[#6c5ce7]" />
                  <span>Now Playing</span>
                </Link>

                <Link href="/upcoming" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/3 hover:bg-white/10 transition-all border border-white/5">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>Upcoming</span>
                </Link>

                <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/3 hover:bg-white/10 transition-all border border-white/5">
                  <Compass className="w-4 h-4 text-[#6c5ce7]" />
                  <span>FlixNetwork</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Instant Search Modal */}
      <CenteredSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Random Movie Picker Modal */}
      <RandomPickModal
        isOpen={randomModalOpen}
        onClose={() => setRandomModalOpen(false)}
        items={[]}
      />
    </>
  );
}
