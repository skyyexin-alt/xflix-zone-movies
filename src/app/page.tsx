import { Suspense } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import FlickZoneHero from '@/components/ui/FlickZoneHero';
import TelegramBanner from '@/components/ui/TelegramBanner';
import AdsKeeperWidget from '@/components/ui/AdsKeeperWidget';
import MovieCard from '@/components/ui/MovieCard';
import ContinueWatchingSection from '@/components/ui/ContinueWatchingSection';
import { 
  getTrending, 
  getPopularMovies, 
  getNowPlaying, 
  getTopRatedMovies,
  getUpcoming,
  fetchAPI
} from '@/lib/tmdb';
import { Flame, TrendingUp, Film, Star, ChevronRight, Tv } from 'lucide-react';

export const revalidate = 3600;

export default async function Home() {
  let trendingItems: any[] = [];
  let popularList: any[] = [];
  let nowPlayingList: any[] = [];
  let topRatedItems: any[] = [];
  let tvSeriesList: any[] = [];

  try {
    const results = await Promise.allSettled([
      getTrending('all'),
      getPopularMovies(),
      getNowPlaying(),
      getTopRatedMovies(),
      fetchAPI('/tv/popular')
    ]);

    trendingItems = results[0].status === 'fulfilled' ? results[0].value?.results || [] : [];
    popularList = results[1].status === 'fulfilled' ? results[1].value?.results || [] : [];
    nowPlayingList = results[2].status === 'fulfilled' ? results[2].value?.results || [] : [];
    topRatedItems = results[3].status === 'fulfilled' ? results[3].value?.results || [] : [];
    tvSeriesList = results[4].status === 'fulfilled' ? results[4].value?.results || [] : [];
  } catch (e) {
    console.error("Home page TMDB fetch error:", e);
  }

  const heroItem = trendingItems.length > 0 ? trendingItems[0] : popularList[0] || null;

  return (
    <div className="pt-16 pb-20 min-h-screen bg-[#0e0b1d] text-white">
      {/* 1. Hero Spotlight Section */}
      <FlickZoneHero item={heroItem} />

      <Container>
        {/* AdsKeeper Widget Above Content */}
        <AdsKeeperWidget />

        {/* 2. Telegram / Community Join Banner */}
        <TelegramBanner />

        {/* 3. Continue Watching Rail (LocalStorage Progress) */}
        <Suspense fallback={null}>
          <ContinueWatchingSection />
        </Suspense>

        {/* 4. Trending This Week */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <TrendingUp className="w-5 h-5" />
              </span>
              <span>Trending <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">This Week</span></span>
            </h2>

            <Link
              href="/trending"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {trendingItems.slice(0, 12).map((item) => (
              <MovieCard key={item.id} item={item} className="w-full" />
            ))}
          </div>
        </section>

        {/* 5. Hot Today */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-600/20 to-amber-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5" />
              </span>
              <span><span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Hot</span> Today</span>
            </h2>

            <Link
              href="/explore?sort=popular"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {popularList.slice(0, 12).map((item) => (
              <MovieCard key={item.id} item={item} className="w-full" />
            ))}
          </div>
        </section>

        {/* 6. Latest Movies */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Film className="w-5 h-5" />
              </span>
              <span>Latest <span className="text-indigo-400">Movies</span></span>
            </h2>

            <Link
              href="/movies"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {nowPlayingList.slice(0, 12).map((item) => (
              <MovieCard key={{...item, media_type: 'movie'}.id} item={{...item, media_type: 'movie'}} className="w-full" />
            ))}
          </div>
        </section>

        {/* 7. Latest TV Series */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-600/20 to-teal-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Tv className="w-5 h-5" />
              </span>
              <span>Latest <span className="text-cyan-400">TV Series</span></span>
            </h2>

            <Link
              href="/tv"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {tvSeriesList.slice(0, 12).map((item) => (
              <MovieCard key={item.id} item={{...item, media_type: 'tv'}} className="w-full" />
            ))}
          </div>
        </section>

        {/* 8. Top Rated */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
              </span>
              <span>Top Rated <span className="text-yellow-400 font-extrabold">Movies & Series</span></span>
            </h2>

            <Link
              href="/top-rated"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {topRatedItems.slice(0, 12).map((item) => (
              <MovieCard key={item.id} item={item} className="w-full" />
            ))}
          </div>
        </section>

        {/* AdsKeeper Widget At Bottom of Page */}
        <AdsKeeperWidget />

      </Container>
    </div>
  );
}
