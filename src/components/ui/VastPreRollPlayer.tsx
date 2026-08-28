"use client";

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, SkipForward, Volume2, VolumeX, Play } from 'lucide-react';

interface VastAdData {
  hasAd: boolean;
  mediaUrl?: string;
  clickThroughUrl?: string;
  displayUrl?: string;
  impressions?: string[];
  trackingEvents?: Record<string, string[]>;
  skipOffset?: number;
}

interface VastPreRollPlayerProps {
  adData: VastAdData;
  onAdComplete: () => void;
}

export default function VastPreRollPlayer({ adData, onAdComplete }: VastPreRollPlayerProps) {
  const adVideoRef = useRef<HTMLVideoElement>(null);
  const [timeLeft, setTimeLeft] = useState<number>(adData.skipOffset || 5);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [adDuration, setAdDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const firedTrackingRef = useRef<Set<string>>(new Set());

  // Fire tracking beacons safely
  const fireBeacons = (urls?: string[]) => {
    if (!urls || urls.length === 0) return;
    urls.forEach((url) => {
      try {
        if (typeof window !== 'undefined' && url) {
          const img = new Image();
          img.src = url;
        }
      } catch (e) {
        // Silently continue
      }
    });
  };

  // 1. Fire Impressions on initial mount
  useEffect(() => {
    if (adData.impressions) {
      fireBeacons(adData.impressions);
    }
  }, [adData]);

  // 2. Play Ad Video with fallback timeout
  useEffect(() => {
    const video = adVideoRef.current;
    if (!video || !adData.mediaUrl) {
      onAdComplete();
      return;
    }

    // Safety timeout: if ad fails to load or buffer in 8s, continue to movie
    const safetyTimer = setTimeout(() => {
      if (!hasStarted) {
        onAdComplete();
      }
    }, 8000);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setHasStarted(true);
          if (!firedTrackingRef.current.has('start')) {
            firedTrackingRef.current.add('start');
            fireBeacons(adData.trackingEvents?.['start']);
          }
        })
        .catch(() => {
          // If browser blocked unmuted autoplay, mute and try again
          video.muted = true;
          setIsMuted(true);
          video.play()
            .then(() => setHasStarted(true))
            .catch(() => onAdComplete());
        });
    }

    return () => clearTimeout(safetyTimer);
  }, [adData, onAdComplete]);

  // 3. Track Time & Quartiles
  const handleTimeUpdate = () => {
    const video = adVideoRef.current;
    if (!video) return;

    const cur = video.currentTime;
    const dur = video.duration || 15;
    setCurrentTime(cur);
    setAdDuration(dur);

    // Skip Countdown
    const skipSecs = adData.skipOffset || 5;
    const remainingToSkip = Math.max(0, Math.ceil(skipSecs - cur));
    setTimeLeft(remainingToSkip);
    if (remainingToSkip === 0 && !canSkip) {
      setCanSkip(true);
    }

    // Quartiles Tracking
    const progress = cur / dur;
    if (progress >= 0.25 && !firedTrackingRef.current.has('firstquartile')) {
      firedTrackingRef.current.add('firstquartile');
      fireBeacons(adData.trackingEvents?.['firstquartile']);
    }
    if (progress >= 0.50 && !firedTrackingRef.current.has('midpoint')) {
      firedTrackingRef.current.add('midpoint');
      fireBeacons(adData.trackingEvents?.['midpoint']);
    }
    if (progress >= 0.75 && !firedTrackingRef.current.has('thirdquartile')) {
      firedTrackingRef.current.add('thirdquartile');
      fireBeacons(adData.trackingEvents?.['thirdquartile']);
    }
  };

  const handleAdEnded = () => {
    if (!firedTrackingRef.current.has('complete')) {
      firedTrackingRef.current.add('complete');
      fireBeacons(adData.trackingEvents?.['complete']);
    }
    onAdComplete();
  };

  const handleSkip = () => {
    if (!firedTrackingRef.current.has('skip')) {
      firedTrackingRef.current.add('skip');
      fireBeacons(adData.trackingEvents?.['skip'] || adData.trackingEvents?.['close']);
    }
    onAdComplete();
  };

  const handleClickThrough = () => {
    if (adData.clickThroughUrl) {
      window.open(adData.clickThroughUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleMute = () => {
    if (!adVideoRef.current) return;
    const newMuted = !isMuted;
    adVideoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <div className="absolute inset-0 z-30 bg-black flex items-center justify-center overflow-hidden group">
      {/* Video Creative */}
      <video
        ref={adVideoRef}
        src={adData.mediaUrl}
        className="w-full h-full object-contain cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAdEnded}
        onError={() => onAdComplete()}
        onClick={handleClickThrough}
        playsInline
      />

      {/* Top Banner: Ad / Visit Sponsor */}
      <div className="absolute top-3 left-3 z-40 flex items-center gap-2">
        <span className="bg-amber-400 text-black font-extrabold text-[11px] px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
          Advertisement
        </span>

        {adData.clickThroughUrl && (
          <button
            onClick={handleClickThrough}
            className="bg-black/80 hover:bg-black text-white text-xs font-semibold px-3 py-1 rounded-lg backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
          >
            <span>{adData.displayUrl || 'Visit Sponsor'}</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </button>
        )}
      </div>

      {/* Top-Right: Sound Mute Toggle */}
      <div className="absolute top-3 right-3 z-40 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="bg-black/80 hover:bg-black text-white p-2 rounded-lg backdrop-blur-md border border-white/20 transition-all shadow-lg cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Bottom-Right: Skip Ad Button */}
      <div className="absolute bottom-4 right-4 z-40">
        {canSkip ? (
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-[0_0_25px_rgba(124,58,237,0.6)] border border-violet-400 transition-all transform hover:scale-105 cursor-pointer"
          >
            <span>Skip Ad</span>
            <SkipForward className="w-4 h-4" />
          </button>
        ) : (
          <div className="bg-black/85 text-zinc-300 font-semibold text-xs px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-1.5">
            <span>Skip in</span>
            <span className="font-bold text-amber-400 text-sm">{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Bottom Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-40">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-violet-500 transition-all duration-200"
          style={{ width: `${adDuration > 0 ? (currentTime / adDuration) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}
