import { Metadata } from 'next';
import { getDetails } from '@/lib/tmdb';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: 'movie' | 'tv'; id: string }>;
}): Promise<Metadata> {
  const { type, id } = await params;
  if (type !== 'movie' && type !== 'tv') {
    return { title: 'Title Not Found - NextZone Movies' };
  }

  try {
    const data = await getDetails(type, id);
    const title = data.title || data.name || 'Untitled';
    const overview = data.overview || 'Watch movies and TV shows online free in HD quality on NextZone Movies.';
    const year = (data.release_date || data.first_air_date || '').substring(0, 4);
    const displayTitle = year ? `Watch ${title} (${year}) Online Free in HD - NextZone Movies` : `Watch ${title} Online Free in HD - NextZone Movies`;

    return {
      title: displayTitle,
      description: overview,
    };
  } catch {
    return {
      title: 'Watch Free Movies & TV Shows - NextZone Movies',
    };
  }
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ type: 'movie' | 'tv'; id: string }>;
}) {
  const { type, id } = await params;

  if (type !== 'movie' && type !== 'tv') return notFound();

  // Redirect directly to the full video player page
  redirect(`/watch/${type}/${id}`);
}
