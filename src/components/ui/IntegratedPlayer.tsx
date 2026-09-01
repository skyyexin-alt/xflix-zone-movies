"use client";

import { useState, useEffect, useRef } from 'react';
import { TriangleAlert, Star, Play, ChevronDown, CheckCircle2, Maximize } from 'lucide-react';
import CustomVideoPlayer from './CustomVideoPlayer';

interface IntegratedPlayerProps {
  title: string;
  backdrop: string;
  poster?: string;
  trailerKey?: string;
  tmdbId: string;
  type: 'movie' | 'tv';
  seasons?: any[];
  /** ISO 639-1 original language code, e.g. 'ko', 'ja', 'fr'. Pass 'en' for English originals. */
  originalLanguage?: string;
}

/** Given a list of subtitles, marks the English track as default if the movie is non-English. */
function applyDefaultSubtitle(subs: any[], originalLanguage?: string): any[] {
  if (!subs || subs.length === 0) return subs;
  const isNonEnglish = originalLanguage && originalLanguage !== 'en';
  if (!isNonEnglish) return subs;

  const hasExplicitDefault = subs.some((s) => s.default);
  if (hasExplicitDefault) return subs;

  const engIndex = subs.findIndex((s) => s.srcLang?.toLowerCase().startsWith('en'));
  if (engIndex === -1) return subs;

  return subs.map((s, i) => ({ ...s, default: i === engIndex }));
}

export default function IntegratedPlayer({ 
  title, 
  backdrop, 
  trailerKey, 
  tmdbId, 
  type, 
  seasons = [], 
  originalLanguage 
}: IntegratedPlayerProps) {
  const [activeServer, setActiveServer] = useState('Server 2 (VidLink Pro)');

  // Find a valid default season (prefer Season 1 over Season 0/Specials)
  const defaultSeason = seasons.find((s: any) => s.season_number > 0) || seasons[0];
  const [activeSeason, setActiveSeason] = useState<number>(defaultSeason ? defaultSeason.season_number : 1);
  const [activeEpisode, setActiveEpisode] = useState<number>(1);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [streamData, setStreamData] = useState<{ url: string, subs: any[] } | null>(null);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [iframeOverlayVisible, setIframeOverlayVisible] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Fetch direct HLS stream URL asynchronously if available
  useEffect(() => {
    async function fetchStream() {
      try {
        const queryParams = type === 'tv' 
          ? `?id=${tmdbId}&type=tv&s=${activeSeason}&e=${activeEpisode}`
          : `?id=${tmdbId}&type=movie`;
          
        const res = await fetch(`/api/stream${queryParams}`);
        const data = await res.json();
        
        if (data.streamUrl) {
          const processedSubs = applyDefaultSubtitle(data.subtitles || [], originalLanguage);
          setStreamData({ url: data.streamUrl, subs: processedSubs });
        }
      } catch (err) {
        // Silently fallback to fast iframe player
      }
    }
    
    fetchStream();
  }, [tmdbId, type, activeSeason, activeEpisode]);

  // Reset overlay whenever the server/episode changes
  useEffect(() => {
    setIframeOverlayVisible(false);
  }, [activeServer, activeSeason, activeEpisode]);

  const handleIframePlay = () => {
    setIframeOverlayVisible(false);
  };

  const servers = [
    { name: 'Server 1 (Full HD)', id: 'server-1' },
    { name: 'Server 2 (VidLink Pro)', id: 'server-2', isRecommended: true },
    { name: 'Server 3 (EmbedSU)', id: 'server-3' },
  ];

  const getEmbedUrl = () => {
    const server = servers.find(s => s.name === activeServer) || servers[0];
    const serverId = server.id;
    
    if (type === 'tv') {
      switch (serverId) {
        case 'server-1': return `https://vidsrc.mov/embed/tv/${tmdbId}/${activeSeason}/${activeEpisode}`;
        case 'server-2': return `https://vidlink.pro/tv/${tmdbId}/${activeSeason}/${activeEpisode}`;
        case 'server-3': return `https://embed.su/embed/tv/${tmdbId}/${activeSeason}/${activeEpisode}`;
        default: return `https://vidsrc.mov/embed/tv/${tmdbId}/${activeSeason}/${activeEpisode}`;
      }
    } else {
      switch (serverId) {
        case 'server-1': return `https://vidsrc.mov/embed/movie/${tmdbId}`;
        case 'server-2': return `https://vidlink.pro/movie/${tmdbId}`;
        case 'server-3': return `https://embed.su/embed/movie/${tmdbId}`;
        default: return `https://vidsrc.mov/embed/movie/${tmdbId}`;
      }
    }
  };

  const currentSeasonData = seasons.find((s: any) => s.season_number === activeSeason);
  const episodeCount = currentSeasonData?.episode_count || 0;
  const episodeList = Array.from({ length: episodeCount }, (_, i) => i + 1);

  const toggleFullscreen = () => {
    if (!iframeContainerRef.current) return;
    if (!document.fullscreenElement) {
      iframeContainerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen error:", err);
      });
    }
  };

  return (
    <div className={`w-full flex flex-col gap-6 ${type === 'tv' ? 'lg:flex-row' : ''}`}>
      
      {/* Left Column: Player & Servers */}
      <div className={`flex flex-col gap-6 ${type === 'tv' ? 'lg:w-3/4' : 'w-full'}`}>
        
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5 group">
          {isStreamLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : streamData ? (
            <CustomVideoPlayer 
              src={streamData.url} 
              poster={`https://image.tmdb.org/t/p/w1280${backdrop}`} 
              subtitles={streamData.subs}
            />
          ) : (
            <div ref={iframeContainerRef} className="relative w-full h-full">
              <iframe
                key={`${activeServer}-${activeSeason}-${activeEpisode}`}
                className="w-full h-full absolute inset-0 bg-black border-0"
                src={getEmbedUrl()}
                title={`${title} Player`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen={true}
                referrerPolicy="origin"
              ></iframe>
              
              {/* Native Fullscreen Hover Button */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-3 right-3 z-20 bg-black/70 hover:bg-violet-600 text-white p-2 rounded-lg backdrop-blur-md opacity-80 hover:opacity-100 transition-all border border-white/10 shadow-lg cursor-pointer"
                title="Expand to Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>

              {/* Play overlay */}
              {iframeOverlayVisible && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
                  onClick={handleIframePlay}
                >
                  <div className="w-20 h-20 rounded-full bg-violet-600/90 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.6)] group-hover:scale-110 group-hover:bg-violet-500 transition-all duration-200">
                    <Play className="w-9 h-9 text-white fill-white ml-1" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Server Selection Section (Exact Previous UI from screenshot) */}
        <div className="bg-[#222255]/40 border border-white/5 rounded-xl p-4 md:p-6 flex flex-col gap-4">
          
          {/* Note Banner */}
          <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg p-3 text-xs md:text-sm font-medium">
            <TriangleAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <p>
              For best experience, use <span className="font-bold text-white">uBlock Origin</span> or <span className="font-bold text-white">Brave Browser</span>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-zinc-400 text-sm">
                Select Server (<Star className="w-3.5 h-3.5 inline fill-amber-500 text-amber-500 -mt-0.5" /> = Recommended):
              </span>
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/40 hover:bg-violet-600 border border-violet-500/50 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-md"
              >
                <Maximize className="w-4 h-4 text-violet-300" />
                <span>Full Screen (PC)</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {servers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => setActiveServer(server.name)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeServer === server.name 
                      ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-violet-400' 
                      : 'bg-[#2a2a4a] text-zinc-300 hover:bg-[#3a3a5a] hover:text-white border border-white/5'
                  }`}
                >
                  <span>{server.name}</span>
                  {server.isRecommended && (
                    <Star className={`w-3.5 h-3.5 ${activeServer === server.name ? 'fill-amber-300 text-amber-300' : 'fill-amber-500 text-amber-500'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Right Column: TV Series Episodes Sidebar */}
      {type === 'tv' && seasons.length > 0 && (
        <div className="lg:w-1/4 bg-[#1e1e38]/50 border border-white/5 rounded-xl p-4 flex flex-col h-[500px] lg:h-auto shadow-xl">
          
          {/* Season Dropdown */}
          <div className="mb-4 relative">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Season</label>
            <div className="relative">
              <button 
                onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
                className="w-full bg-[#2a2a4a] border border-white/10 hover:border-violet-500/50 text-white px-4 py-3 rounded-lg flex items-center justify-between transition-colors focus:outline-none cursor-pointer"
              >
                <span className="font-semibold text-sm">Season {activeSeason} ({episodeCount} eps)</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isSeasonDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSeasonDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a4a] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto custom-scrollbar">
                  {seasons.map((season: any) => (
                    <button
                      key={season.id}
                      onClick={() => {
                        setActiveSeason(season.season_number);
                        setActiveEpisode(1);
                        setIsSeasonDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer ${
                        activeSeason === season.season_number 
                          ? 'bg-violet-600 text-white font-bold' 
                          : 'text-zinc-300 hover:bg-white/5 hover:text-white font-medium'
                      }`}
                    >
                      Season {season.season_number} <span className="text-zinc-500 text-xs ml-1">({season.episode_count} eps)</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Episode List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block mt-2">Episodes</label>
            
            {episodeList.length > 0 ? (
              episodeList.map((epNum) => {
                const isActive = activeEpisode === epNum;
                const fakeRating = (7.0 + ((epNum * 3) % 20) / 10).toFixed(1);
                
                return (
                  <button
                    key={epNum}
                    onClick={() => setActiveEpisode(epNum)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border cursor-pointer ${
                      isActive 
                        ? 'bg-violet-600 border-violet-500 text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)]' 
                        : 'bg-[#2a2a4a]/50 border-transparent hover:bg-[#3a3a5a] text-zinc-300 hover:text-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-zinc-400'
                    }`}>
                      {epNum}
                    </div>
                    <div className="flex flex-col items-start flex-1 text-left min-w-0">
                      <span className={`text-sm font-bold truncate w-full ${isActive ? 'text-white' : 'text-zinc-200'}`}>
                        Episode {epNum}
                      </span>
                      <span className={`text-xs flex items-center gap-1 ${isActive ? 'text-violet-200' : 'text-zinc-500'}`}>
                        <Star className={`w-3 h-3 ${isActive ? 'fill-violet-300 text-violet-300' : 'fill-amber-500 text-amber-500'}`} />
                        {fakeRating}
                      </span>
                    </div>
                    {isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-white/80 flex-shrink-0" />
                    ) : (
                      <Play className="w-4 h-4 text-zinc-500 group-hover:text-white opacity-0 transition-opacity flex-shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-zinc-500 text-sm text-center mt-10">No episodes found.</div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
