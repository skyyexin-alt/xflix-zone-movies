'use client';

import { useEffect, useRef, useState } from 'react';

interface AdsterraBannerProps {
  bannerKey?: string;
  scriptHost?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function AdsterraBanner({
  bannerKey = 'd092035ae89a38067d47dfdef5cf6b61',
  scriptHost = 'yearlybeak.com',
  width = 728,
  height = 90,
  className = '',
}: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const availableWidth = wrapperRef.current.clientWidth - 16;
        if (availableWidth < width) {
          const calculatedScale = Math.max(0.4, Math.min(1, availableWidth / width));
          setScale(calculatedScale);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width]);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = width.toString();
    iframe.height = height.toString();
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';

    containerRef.current.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
              iframe { max-width: 100% !important; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '${bannerKey}',
                'format' : 'iframe',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://${scriptHost}/${bannerKey}/invoke.js"></script>
          </body>
        </html>
      `);
      iframeDoc.close();
    }
  }, [bannerKey, scriptHost, width, height]);

  const containerHeight = Math.round(height * scale);

  return (
    <div
      ref={wrapperRef}
      className={`w-full flex justify-center items-center my-3 overflow-hidden rounded-2xl bg-[#14142f]/80 border border-violet-500/20 shadow-[0_0_20px_rgba(108,92,231,0.12)] p-2 transition-all ${className}`}
      style={{ minHeight: `${containerHeight + 12}px` }}
    >
      <div
        className="flex justify-center items-center origin-center transition-transform duration-200"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
        }}
      >
        <div ref={containerRef} className="w-full h-full flex justify-center items-center" />
      </div>
    </div>
  );
}
