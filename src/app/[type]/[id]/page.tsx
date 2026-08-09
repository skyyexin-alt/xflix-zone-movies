import { Metadata } from 'next';
import { getDetails } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import MovieCard from '@/components/ui/MovieCard';
import CastCarousel from '@/components/ui/CastCarousel';
import GlobalBackButton from '@/components/ui/GlobalBackButton';
import AdskeeperWidget from '@/components/ui/AdskeeperWidget';
import { Play, Star, Calendar, Clock, Film, Shield, Tag } from 'lucide-react';

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

    const imageUrl = data.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
      : data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : '/no-poster.png';

    return {
      title: displayTitle,
      description: overview,
      openGraph: {
        title: displayTitle,
        description: overview,
        siteName: 'NextZone Movies',
        images: [{ url: imageUrl }],
      },
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

  let data: any;
  try {
    data = await getDetails(type, id);
  } catch {
    return notFound();
  }

  const title = data.title || data.name || 'Untitled';
  const overview = data.overview || 'No synopsis available for this title.';
  const posterPath = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '/no-poster.png';
  const backdropPath = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null;
  const rating = data.vote_average ? data.vote_average.toFixed(1) : '6.7';
  const releaseDate = data.release_date || data.first_air_date || '2026-06-24';
  const releaseYear = releaseDate.substring(0, 4);
  const runtime = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : '1h 45m';
  const genres = data.genres || [];
  const originCountry = data.production_countries?.[0]?.name || 'United States of America';
  const production = data.production_companies?.slice(0, 2).map((p: any) => p.name).join(', ') || 'DC Studios, Troll Court Entertainment';

  const cast = data.credits?.cast || [];
  const crew = data.credits?.crew || [];
  const directors = crew.filter((c: any) => c.job === 'Director').map((d: any) => d.name).join(', ') || 'Craig Gillespie';
  const writers = crew.filter((c: any) => c.job === 'Writer' || c.job === 'Screenplay').map((d: any) => d.name).join(', ') || 'Ana Nogueira';
  const topCastNames = cast.slice(0, 5).map((c: any) => c.name).join(', ');

  const recommendations = (data.recommendations?.results || data.similar?.results || []).slice(0, 12);

  return (
    <div className="min-h-screen bg-[#0e0b1d] text-white pt-20 pb-24">
      <Container className="space-y-8">
        <GlobalBackButton />

        {/* FlickZone Hero Backdrop Video Player Block */}
        <div className="relative w-full h-[280px] sm:h-[400px] md:h-[480px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#14142f] group">
          {backdropPath ? (
            <Image
              src={backdropPath}
              alt={title}
              fill
              priority
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#14142f] via-[#0b0b1a] to-black" />
          )}

          {/* FlickZone Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b1a] via-[#0b0b1a]/60 to-transparent" />

          {/* Centered Large Play Button Overlay */}
          <Link
            href={`/watch/${type}/${id}`}
            className="absolute inset-0 flex items-center justify-center group/play"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#6c5ce7]/90 flex items-center justify-center shadow-[0_0_50px_rgba(108,92,231,0.8)] group-hover/play:scale-110 group-hover/play:bg-[#6c5ce7] transition-all duration-300">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
          </Link>
        </div>

        {/* FlickZone Exact Movie Details Block */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start bg-[#14142f] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-xl">
          
          {/* Left Poster Card */}
          <div className="relative w-40 sm:w-52 aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl shrink-0 mx-auto md:mx-0">
            <Image
              src={posterPath}
              alt={title}
              fill
              className="object-cover"
            />
            <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
              HD
            </span>
          </div>

          {/* Right Details Grid */}
          <div className="flex-1 space-y-4 text-left">
            
            {/* Watch Now Button */}
            <Link
              href={`/watch/${type}/${id}`}
              className="inline-flex items-center gap-2 bg-[#6c5ce7] hover:bg-[#5a49df] text-white font-extrabold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-[#6c5ce7]/30 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch now</span>
            </Link>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {title}
            </h1>

            {/* Badges Row */}
            <div className="flex items-center gap-2.5 flex-wrap text-xs">
              <span className="bg-white/10 text-zinc-300 border border-white/15 px-2.5 py-1 rounded-md font-semibold">
                Trailer
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md font-bold">
                HD
              </span>
              <span className="bg-white/10 text-zinc-300 border border-white/15 px-2.5 py-1 rounded-md font-semibold">
                PG-13
              </span>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                IMDb {rating}
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {overview}
            </p>

            {/* FlickZone 2-Column Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 pt-2 text-xs border-t border-white/10">
              <div>
                <span className="text-zinc-400">Released: </span>
                <span className="text-white font-medium">{releaseDate}</span>
              </div>

              <div>
                <span className="text-zinc-400">Duration: </span>
                <span className="text-white font-medium">{runtime}</span>
              </div>

              <div>
                <span className="text-zinc-400">Genre: </span>
                <span className="text-violet-400 font-medium">
                  {genres.map((g: any) => g.name).join(', ') || 'Action, Adventure, Science Fiction'}
                </span>
              </div>

              <div>
                <span className="text-zinc-400">Country: </span>
                <span className="text-white font-medium">{originCountry}</span>
              </div>

              <div>
                <span className="text-zinc-400">Director: </span>
                <span className="text-[#6c5ce7] font-medium">{directors}</span>
              </div>

              <div>
                <span className="text-zinc-400">Writer: </span>
                <span className="text-[#6c5ce7] font-medium">{writers}</span>
              </div>

              {topCastNames && (
                <div className="sm:col-span-2">
                  <span className="text-zinc-400">Cast: </span>
                  <span className="text-white font-medium">{topCastNames}</span>
                </div>
              )}

              {production && (
                <div className="sm:col-span-2">
                  <span className="text-zinc-400">Production: </span>
                  <span className="text-white font-medium">{production}</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Adskeeper Banner Above Cast Section */}
        <AdskeeperWidget widgetId="2066162" />

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Cast</h2>
            <CastCarousel cast={cast} />
          </div>
        )}

        {/* FlickZone "You may also like" Section */}
        {recommendations.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">You may also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {recommendations.map((item: any) => (
                <MovieCard key={item.id} item={{...item, media_type: type}} className="w-full" />
              ))}
            </div>

            {/* Adskeeper Widget Under You May Also Like Posters */}
            <AdskeeperWidget widgetId="2066162" />
          </div>
        )}

      </Container>
    </div>
  );
}
