'use client';

import { useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  bannerKey?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function AdsterraBanner({
  bannerKey = 'd092035ae89a38067d47dfdef5cf6b61',
  width = 728,
  height = 90,
  className = '',
}: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous iframe if re-rendered
    containerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = width.toString();
    iframe.height = height.toString();
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.maxWidth = '100%';
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
            <script type="text/javascript" src="https://yearlybeak.com/${bannerKey}/invoke.js"></script>
          </body>
        </html>
      `);
      iframeDoc.close();
    }
  }, [bannerKey, width, height]);

  return (
    <div className={`w-full flex justify-center items-center my-3 overflow-hidden max-w-full ${className}`}>
      <div ref={containerRef} className="w-full flex justify-center items-center max-w-full overflow-hidden min-h-[90px]" />
    </div>
  );
}
