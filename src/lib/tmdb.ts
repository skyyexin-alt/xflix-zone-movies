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

export async function fetchAPI(endpoint: string, params: Record<string, string> = {}) {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY || '');
    
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 } // Cache for 1 hour by default
    });
    
    if (!response.ok) {
      console.error(`[TMDB API Error] ${endpoint} returned status ${response.status}`);
      return { results: [], page: 1, total_pages: 0, total_results: 0 };
    }

    return await response.json();
  } catch (error) {
    console.error(`[TMDB Network Exception] ${endpoint}:`, error);
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }
}

export async function getTrending(type: 'all' | 'movie' | 'tv' = 'all') {
  return fetchAPI(`/trending/${type}/week`);
}

export async function getPopularMovies() {
  return fetchAPI('/movie/popular');
}

export async function getPopularTV() {
  return fetchAPI('/tv/popular');
}

export async function getNowPlaying() {
  return fetchAPI('/movie/now_playing');
}

export async function getUpcoming() {
  return fetchAPI('/movie/upcoming');
}

export async function getTopRatedMovies() {
  return fetchAPI('/movie/top_rated');
}

export async function getAiringToday() {
  return fetchAPI('/tv/airing_today');
}

export async function getDetails(type: 'movie' | 'tv', id: string) {
  return fetchAPI(`/${type}/${id}`, { append_to_response: 'credits,videos,similar,recommendations,images' });
}

export async function searchMedia(query: string) {
  return fetchAPI('/search/multi', { query });
}

export async function getDiscoverMovies(params: Record<string, string> = {}) {
  return fetchAPI('/discover/movie', params);
}

export async function getDiscoverTV(params: Record<string, string> = {}) {
  return fetchAPI('/discover/tv', params);
}

export async function getGenres(type: 'movie' | 'tv') {
  return fetchAPI(`/genre/${type}/list`);
}

export async function getPersonDetails(id: string) {
  return fetchAPI(`/person/${id}`);
}

export async function getPersonCredits(id: string) {
  return fetchAPI(`/person/${id}/combined_credits`);
}
