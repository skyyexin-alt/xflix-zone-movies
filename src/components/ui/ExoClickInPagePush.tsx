"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    AdProvider?: any[];
  }
}

interface ExoClickInPagePushProps {
  zoneId?: string;
}

export default function ExoClickInPagePush({ zoneId = '6014150' }: ExoClickInPagePushProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (hasInitialized.current || !containerRef.current) return;
    hasInitialized.current = true;

    // 1. Ensure the ExoClick ad-provider script is loaded
    const SCRIPT_ID = 'exoclick-ad-provider-script';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.type = 'application/javascript';
      script.src = 'https://a.magsrv.com/ad-provider.js';
      document.head.appendChild(script);
    }

    // 2. Inject the ins element
    const ins = document.createElement('ins');
    ins.className = 'eas6a97888e42';
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
      id={`exoclick-ipp-${zoneId}`} 
      className="exoclick-inpage-push pointer-events-auto"
      aria-hidden="true" 
    />
  );
}
