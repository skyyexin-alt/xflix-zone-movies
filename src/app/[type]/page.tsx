import { getDiscoverMovies, getDiscoverTV, getPopularMovies, getTopRatedMovies, getNowPlaying, getUpcoming, getTrending, fetchAPI } from '@/lib/tmdb';
import FlickZoneCatalog from '@/components/ui/FlickZoneCatalog';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ type: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const rawType = resolvedParams.type;

  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'popular';
  const genre = typeof resolvedSearchParams.genre === 'string' ? resolvedSearchParams.genre : '';
  const year = typeof resolvedSearchParams.year === 'string' ? resolvedSearchParams.year : '';

  let mediaType: 'movie' | 'tv' = rawType === 'tv' || rawType === 'airing-today' ? 'tv' : 'movie';
  let title = 'Popular Movies';

  if (rawType === 'tv') title = 'TV Series';
  else if (rawType === 'movies') title = 'Popular Movies';
  else if (rawType === 'trending') title = 'Trending This Week';
  else if (rawType === 'top-rated') title = 'Top Rated Movies & Shows';
  else if (rawType === 'new-releases') title = 'New Releases';
  else if (rawType === 'now-playing') title = 'Now Playing';
  else if (rawType === 'upcoming') title = 'Upcoming Movies';

  let items: any[] = [];
  let totalPages = 500;

  try {
    const queryParams: Record<string, string> = {
      page: page.toString(),
    };
    if (genre) queryParams.with_genres = genre;
    if (year) {
      if (mediaType === 'movie') queryParams.primary_release_year = year;
      else queryParams.first_air_date_year = year;
    }

    if (sort === 'top_rated' || rawType === 'top-rated') {
      queryParams.sort_by = 'vote_average.desc';
      queryParams['vote_count.gte'] = '200';
    } else if (sort === 'newest' || rawType === 'new-releases') {
      queryParams.sort_by = 'primary_release_date.desc';
    }

    let response;
    if (mediaType === 'movie') {
      response = await getDiscoverMovies(queryParams);
    } else {
      response = await getDiscoverTV(queryParams);
    }

    items = (response?.results || []).map((item: any) => ({
      ...item,
      media_type: mediaType
    }));

    if (response?.total_pages) {
      totalPages = Math.min(response.total_pages, 500);
    }
  } catch (e) {
    console.error("Catalog fetch error:", e);
  }

  return (
    <FlickZoneCatalog
      title={title}
      items={items}
      currentPage={page}
      totalPages={totalPages}
      currentType={mediaType}
      currentSort={sort}
      currentGenre={genre}
      currentYear={year}
      baseUrl={`/${rawType}`}
    />
  );
}
