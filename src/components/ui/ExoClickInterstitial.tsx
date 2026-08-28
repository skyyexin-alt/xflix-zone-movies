"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    AdProvider?: any[];
  }
}

interface ExoClickInterstitialProps {
  zoneId?: string;
}

export default function ExoClickInterstitial({ zoneId = '6014154' }: ExoClickInterstitialProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (hasInitialized.current || !containerRef.current) return;
    hasInitialized.current = true;

    // 1. Ensure the ad-provider script is loaded
    const SCRIPT_ID = 'exoclick-pemsrv-ad-provider';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.type = 'application/javascript';
      script.src = 'https://a.pemsrv.com/ad-provider.js';
      document.head.appendChild(script);
    }

    // 2. Inject the ins tag for the interstitial zone
    const ins = document.createElement('ins');
    ins.className = 'eas6a97888e35';
    ins.setAttribute('data-zoneid', zoneId);
    containerRef.current.appendChild(ins);

    // 3. Trigger ad serve
    try {
      (window.AdProvider = window.AdProvider || []).push({ serve: {} });
    } catch (e) {
      // Silently catch adblock or blocked requests
    }
  }, [zoneId]);

  return (
    <div 
      ref={containerRef} 
      id={`exoclick-interstitial-${zoneId}`} 
      className="exoclick-interstitial"
      aria-hidden="true" 
    />
  );
}
