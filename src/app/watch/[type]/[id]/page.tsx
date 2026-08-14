import { Metadata } from 'next';
import { getDetails } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import IntegratedPlayer from '@/components/ui/IntegratedPlayer';
import CastCarousel from '@/components/ui/CastCarousel';
import MovieCard from '@/components/ui/MovieCard';
import GlobalBackButton from '@/components/ui/GlobalBackButton';
import AdsKeeperWidget from '@/components/ui/AdsKeeperWidget';
import { Star, ArrowLeft, Heart } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: 'movie' | 'tv'; id: string }>;
}): Promise<Metadata> {
  const { type, id } = await params;
  if (type !== 'movie' && type !== 'tv') {
    return { title: 'Watch Online - NextZone Movies' };
  }

  try {
    const data = await getDetails(type, id);
    const title = data.title || data.name || 'Untitled';
    return {
      title: `Watch ${title} Full HD Online Free - NextZone Movies`,
      description: data.overview || `Stream ${title} online for free in 1080p Full HD on NextZone Movies.`,
    };
  } catch {
    return { title: 'Watch Movies & TV Shows Online Free - NextZone Movies' };
  }
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ type: 'movie' | 'tv'; id: string }>;
}) {
  const { type, id } = await params;

  if (type !== 'movie' && type !== 'tv') return notFound();

  let data: any;
  try {
    data = await getDetails(type, id);
  } catch {
    return notFound();
  }

  const title = data.title || data.name || 'Untitled';
  const overview = data.overview || 'No synopsis available.';
  const backdropPath = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '';
  const rating = data.vote_average ? data.vote_average.toFixed(1) : '6.7';
  const releaseDate = data.release_date || data.first_air_date || '2026';
  const genres = data.genres || [];
  const cast = data.credits?.cast || [];

  const trailer = data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || data.videos?.results?.[0];

  const recommendations = (data.recommendations?.results || data.similar?.results || []).slice(0, 12);

  return (
    <div className="min-h-screen bg-[#0e0b1d] text-white pt-20 pb-24">
      <Container className="space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${type}/${id}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-violet-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Details</span>
          </Link>

          <span className="bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Streaming in HD 1080p
          </span>
        </div>

        {/* AdsKeeper Widget Above Video Player */}
        <AdsKeeperWidget />

        {/* Integrated Video Player */}
        <div className="space-y-4">
          <IntegratedPlayer
            title={title}
            backdrop={backdropPath}
            trailerKey={trailer?.key}
            tmdbId={id}
            type={type}
            seasons={data.seasons}
            originalLanguage={data.original_language}
          />
        </div>

        {/* Title Info & Synopsis */}
        <div className="bg-[#14142f] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
                <span className="uppercase tracking-wider">{type === 'tv' ? 'TV Series' : 'Movie'}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" /> {rating}
                </span>
                <span>•</span>
                <span>{releaseDate.substring(0, 4)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{title}</h1>
            </div>

            {genres.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {genres.map((g: any) => (
                  <span key={g.id} className="bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 px-3 py-1 rounded-lg">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-zinc-300 text-sm leading-relaxed">{overview}</p>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Cast</h2>
            <CastCarousel cast={cast} />
          </div>
        )}

        {/* FlickZone "You may also like" Section */}
        {recommendations.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe]">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">You may also like</h2>
                <p className="text-xs text-zinc-400">Because you're watching {title}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
              {recommendations.map((item: any) => (
                <MovieCard key={item.id} item={{...item, media_type: type}} className="w-full" />
              ))}
            </div>
          </div>
        )}

        {/* AdsKeeper Widget At Bottom of Page */}
        <AdsKeeperWidget />

      </Container>
    </div>
  );
}
