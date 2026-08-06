"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { MediaItem } from '@/lib/tmdb';

export type WatchStatus = 'watching' | 'completed' | 'plan_to_watch' | 'on_hold' | 'dropped';

export interface WatchlistItem {
  item: MediaItem;
  status: WatchStatus;
  userRating?: number; // 1 to 10 scale
  progress?: number;
  totalEpisodes?: number;
  rewatchCount?: number;
  notes?: string;
  updatedAt: string;
}

export interface WatchlistStats {
  total: number;
  watching: number;
  completed: number;
  planToWatch: number;
  onHold: number;
  dropped: number;
  meanScore: number;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  updateEntry: (item: MediaItem, status: WatchStatus, userRating?: number, progress?: number, notes?: string) => void;
  removeEntry: (id: number) => void;
  getEntry: (id: number) => WatchlistItem | undefined;
  isInWatchlist: (id: number) => boolean;
  getStats: () => WatchlistStats;
  isLoaded: boolean;
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (id: number) => void;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('xflix_watchlist_v2');
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load watchlist', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('xflix_watchlist_v2', JSON.stringify(watchlist));
      } catch (error) {}
    }
  }, [watchlist, isLoaded]);

  const updateEntry = (
    item: MediaItem,
    status: WatchStatus,
    userRating?: number,
    progress?: number,
    notes?: string
  ) => {
    setWatchlist(prev => {
      const existingIdx = prev.findIndex(entry => entry.item.id === item.id);
      const newEntry: WatchlistItem = {
        item,
        status,
        userRating: userRating !== undefined ? userRating : (existingIdx >= 0 ? prev[existingIdx].userRating : undefined),
        progress: progress !== undefined ? progress : (existingIdx >= 0 ? prev[existingIdx].progress : 0),
        notes: notes !== undefined ? notes : (existingIdx >= 0 ? prev[existingIdx].notes : ''),
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newEntry;
        return copy;
      } else {
        return [newEntry, ...prev];
      }
    });
  };

  const removeEntry = (id: number) => {
    setWatchlist(prev => prev.filter(entry => entry.item.id !== id));
  };

  const getEntry = (id: number) => {
    return watchlist.find(entry => entry.item.id === id);
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some(entry => entry.item.id === id);
  };

  const addToWatchlist = (item: MediaItem) => {
    updateEntry(item, 'plan_to_watch');
  };

  const removeFromWatchlist = (id: number) => {
    removeEntry(id);
  };

  const getStats = (): WatchlistStats => {
    const total = watchlist.length;
    let watching = 0;
    let completed = 0;
    let planToWatch = 0;
    let onHold = 0;
    let dropped = 0;
    let scoreSum = 0;
    let scoredCount = 0;

    watchlist.forEach(entry => {
      if (entry.status === 'watching') watching++;
      else if (entry.status === 'completed') completed++;
      else if (entry.status === 'plan_to_watch') planToWatch++;
      else if (entry.status === 'on_hold') onHold++;
      else if (entry.status === 'dropped') dropped++;

      if (entry.userRating && entry.userRating > 0) {
        scoreSum += entry.userRating;
        scoredCount++;
      }
    });

    const meanScore = scoredCount > 0 ? Number((scoreSum / scoredCount).toFixed(1)) : 0;

    return { total, watching, completed, planToWatch, onHold, dropped, meanScore };
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        updateEntry,
        removeEntry,
        getEntry,
        isInWatchlist,
        getStats,
        isLoaded,
        addToWatchlist,
        removeFromWatchlist,
        clearWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
