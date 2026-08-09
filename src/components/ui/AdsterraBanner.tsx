'use client';

import { useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  bannerKey?: string;
  scriptHost?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function AdsterraBanner({
  bannerKey = '282e852f5808b9dd01d12c1ed30bf5d2',
  scriptHost = 'www.highperformanceformat.com',
  width = 728,
  height = 90,
  className = '',
}: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous elements if re-rendered
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
            <script type="text/javascript" src="https://${scriptHost}/${bannerKey}/invoke.js"></script>
          </body>
        </html>
      `);
      iframeDoc.close();
    }
  }, [bannerKey, scriptHost, width, height]);

  return (
    <div className={`w-full flex justify-center items-center my-3 overflow-hidden max-w-full ${className}`}>
      <div ref={containerRef} className="w-full flex justify-center items-center max-w-full overflow-hidden min-h-[90px]" />
    </div>
  );
}
