import { cache } from 'react';

export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '5d067b9d81cc3970f1365e1e9862ce6b';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: 'movie' | 'tv' | 'person';
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

// In-Memory Fast Cache for instant Localhost & SSR responses (< 1ms)
const memoryCache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function fetchAPI(endpoint: string, params: Record<string, string> = {}) {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY || '');
    
    Object.keys(params).sort().forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    const cacheKey = url.toString();
    const cached = memoryCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s safety timeout

    const response = await fetch(cacheKey, {
      signal: controller.signal,
      next: { revalidate: 3600 }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[TMDB API Error] ${endpoint} returned status ${response.status}`);
      return { results: [], page: 1, total_pages: 0, total_results: 0 };
    }

    const json = await response.json();
    memoryCache.set(cacheKey, { data: json, expiresAt: now + CACHE_TTL_MS });
    return json;
  } catch (error) {
    console.error(`[TMDB Network Exception] ${endpoint}:`, error);
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }
}

export const getTrending = cache(async (type: 'all' | 'movie' | 'tv' = 'all') => {
  return fetchAPI(`/trending/${type}/week`);
});

export const getPopularMovies = cache(async () => {
  return fetchAPI('/movie/popular');
});

export const getPopularTV = cache(async () => {
  return fetchAPI('/tv/popular');
});

export const getNowPlaying = cache(async () => {
  return fetchAPI('/movie/now_playing');
});

export const getUpcoming = cache(async () => {
  return fetchAPI('/movie/upcoming');
});

export const getTopRatedMovies = cache(async () => {
  return fetchAPI('/movie/top_rated');
});

export const getAiringToday = cache(async () => {
  return fetchAPI('/tv/airing_today');
});

export const getDetails = cache(async (type: 'movie' | 'tv', id: string) => {
  return fetchAPI(`/${type}/${id}`, { append_to_response: 'credits,videos,similar,recommendations,images' });
});

export const searchMedia = cache(async (query: string) => {
  return fetchAPI('/search/multi', { query });
});

export const getDiscoverMovies = cache(async (params: Record<string, string> = {}) => {
  return fetchAPI('/discover/movie', params);
});

export const getDiscoverTV = cache(async (params: Record<string, string> = {}) => {
  return fetchAPI('/discover/tv', params);
});

export const getGenres = cache(async (type: 'movie' | 'tv') => {
  return fetchAPI(`/genre/${type}/list`);
});

export const getPersonDetails = cache(async (id: string) => {
  return fetchAPI(`/person/${id}`);
});

export const getPersonCredits = cache(async (id: string) => {
  return fetchAPI(`/person/${id}/combined_credits`);
});
