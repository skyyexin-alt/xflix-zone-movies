import { getDiscoverMovies, getDiscoverTV } from '@/lib/tmdb';
import FlickZoneCatalog from '@/components/ui/FlickZoneCatalog';

export const dynamic = 'force-dynamic';

export default async function ExplorePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;

  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'popular';
  const type = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : 'movie';
  const genre = typeof resolvedSearchParams.genre === 'string' ? resolvedSearchParams.genre : '';
  const year = typeof resolvedSearchParams.year === 'string' ? resolvedSearchParams.year : '';
  const cat = typeof resolvedSearchParams.cat === 'string' ? resolvedSearchParams.cat : '';

  const mediaType: 'movie' | 'tv' = type === 'tv' ? 'tv' : 'movie';
  const title = cat || (mediaType === 'tv' ? 'TV Shows' : 'Popular Movies');

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

    if (sort === 'top_rated') {
      queryParams.sort_by = 'vote_average.desc';
      queryParams['vote_count.gte'] = '200';
    } else if (sort === 'newest') {
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
    console.error("Explore fetch error:", e);
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
      baseUrl="/explore"
    />
  );
}
