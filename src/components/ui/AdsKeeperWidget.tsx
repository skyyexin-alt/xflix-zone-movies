'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface AdsKeeperWidgetProps {
  widgetId?: string;
  className?: string;
  loadScript?: boolean;
}

export default function AdsKeeperWidget({
  widgetId = "2066162",
  className = "",
  loadScript = true,
}: AdsKeeperWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      window._mgq = window._mgq || [];
      // @ts-ignore
      window._mgq.push(["_mgc.load"]);
    } catch (e) {
      console.error("AdsKeeper queue error:", e);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden rounded-2xl bg-[#14142f]/80 border border-violet-500/20 shadow-[0_0_20px_rgba(108,92,231,0.12)] p-2 transition-all ${className}`}>
      {loadScript && (
        <Script
          src="https://jsc.adskeeper.com/site/1106781.js"
          strategy="afterInteractive"
        />
      )}
      <div
        data-type="_mgwidget"
        data-widget-id={widgetId}
        ref={containerRef}
        className="w-full min-h-[90px] flex justify-center items-center"
      />
    </div>
  );
}
