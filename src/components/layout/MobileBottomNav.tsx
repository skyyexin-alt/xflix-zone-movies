"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Tv, Smartphone, Heart } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { watchlist } = useWatchlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenAppInstall = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trigger-install-popup'));
    }
  };

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Movies',
      href: '/movies',
      icon: Film,
      isActive: pathname === '/movies',
    },
    {
      label: 'TV Shows',
      href: '/tv',
      icon: Tv,
      isActive: pathname === '/tv',
    },
    {
      label: 'Install App',
      onClick: handleOpenAppInstall,
      icon: Smartphone,
      isHot: true,
    },
    {
      label: 'Watchlist',
      href: '/watchlist',
      icon: Heart,
      isActive: pathname === '/watchlist',
      badge: mounted && watchlist.length > 0 ? watchlist.length : undefined,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090914]/98 backdrop-blur-2xl border-t border-white/15 px-3 py-2.5 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isButton = !!item.onClick;

        if (isButton) {
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className="relative flex flex-col items-center justify-center flex-1 py-1.5 rounded-2xl transition-all active:scale-95 text-zinc-400 hover:text-white font-semibold"
            >
              <div className="relative">
                <Icon className="w-6 h-6 text-emerald-400" />
                {item.isHot && (
                  <span className="absolute -top-1.5 -right-3 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow animate-pulse">
                    HOT
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight font-bold text-emerald-400">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href || '#'}
            className={`relative flex flex-col items-center justify-center flex-1 py-1.5 rounded-2xl transition-all active:scale-95 ${
              item.isActive
                ? 'text-[#6c5ce7] font-black'
                : 'text-zinc-400 hover:text-white font-semibold'
            }`}
          >
            <div className="relative">
              <Icon className={`w-6 h-6 transition-all duration-200 ${item.isActive ? 'text-[#6c5ce7] scale-110 drop-shadow-[0_0_10px_rgba(108,92,231,0.8)]' : ''}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-3 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-[#090914] shadow-md animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>
            
            <span className={`text-[11px] mt-1 tracking-tight ${item.isActive ? 'font-black text-white' : 'font-bold'}`}>
              {item.label}
            </span>

            {/* Glowing Dot Indicator for Active Tab */}
            {item.isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7] shadow-[0_0_10px_#6c5ce7] mt-1" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
