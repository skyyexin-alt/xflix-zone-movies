"use client";

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import VastPreRollPlayer from './VastPreRollPlayer';

interface Subtitle {
  label: string;
  kind: 'subtitles' | 'captions';
  srcLang: string;
  src: string;
  default?: boolean;
}

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  subtitles?: Subtitle[];
}

export default function CustomVideoPlayer({ src, poster, subtitles = [] }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [vastAd, setVastAd] = useState<any | null>(null);
  const [isAdChecked, setIsAdChecked] = useState<boolean>(false);

  // Check for ExoClick VAST in-stream pre-roll ad
  useEffect(() => {
    async function checkVastAd() {
      try {
        const res = await fetch('/api/vast');
        const data = await res.json();
        if (data.hasAd && data.mediaUrl) {
          setVastAd(data);
        }
      } catch (err) {
        // Silently continue to movie on ad failure
      } finally {
        setIsAdChecked(true);
      }
    }

    checkVastAd();
  }, []);

  useEffect(() => {
    // Only start main video setup if ad has finished or there is no ad
    if (vastAd) return;

    const video = videoRef.current;
    if (!video) return;

    // Use hls.js for desktop browsers that don't natively support HLS
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 60,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error occurred while loading video stream.');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setError('An unrecoverable error occurred.');
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } 
    // Fallback for native HLS support (like iOS Safari!)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else {
      setError('Your browser does not support HLS video playback.');
    }
  }, [src, vastAd]);

  const handleAdComplete = () => {
    setVastAd(null);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5 group">
      {/* 1. ExoClick VAST Pre-Roll Video Ad */}
      {vastAd && (
        <VastPreRollPlayer adData={vastAd} onAdComplete={handleAdComplete} />
      )}

      {/* 2. Main Video Stream */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-black/90 text-sm gap-2 p-4 text-center">
          <span className="text-red-500 font-bold text-lg">Playback Error</span>
          <p>{error}</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full outline-none focus:outline-none"
          controls
          playsInline // CRITICAL for iOS: Prevents forced fullscreen on load
          poster={poster}
          crossOrigin="anonymous" // CRITICAL for VTT subtitles loaded from another domain
        >
          {subtitles.map((sub, index) => (
            <track
              key={index}
              label={sub.label}
              kind={sub.kind}
              srcLang={sub.srcLang}
              src={sub.src}
              default={sub.default}
            />
          ))}
        </video>
      )}
    </div>
  );
}
