'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface AdskeeperWidgetProps {
  widgetId?: string;
  className?: string;
}

export default function AdskeeperWidget({
  widgetId = '2066162',
  className = '',
}: AdskeeperWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const enforceTwoColumns = () => {
      if (!containerRef.current) return;
      const widgetDiv = containerRef.current.querySelector('[data-type="_mgwidget"]');
      if (!widgetDiv) return;

      const allElements = widgetDiv.querySelectorAll('div, a, span, table, td');
      allElements.forEach((el: any) => {
        const className = (el.className || '').toString();

        if (
          className.includes('item') ||
          className.includes('card') ||
          className.includes('box') ||
          className.includes('cell') ||
          className.includes('mc_item') ||
          className.includes('mgbox')
        ) {
          el.style.setProperty('width', '48%', 'important');
          el.style.setProperty('max-width', '48%', 'important');
          el.style.setProperty('flex', '0 0 48%', 'important');
          el.style.setProperty('display', 'inline-block', 'important');
          el.style.setProperty('float', 'left', 'important');
          el.style.setProperty('margin-bottom', '12px', 'important');
          el.style.setProperty('box-sizing', 'border-box', 'important');
        }

        if (
          className.includes('content') ||
          className.includes('block') ||
          className.includes('line') ||
          className.includes('row') ||
          className.includes('wrap') ||
          className.includes('mgline') ||
          className.includes('mgcontent')
        ) {
          el.style.setProperty('display', 'flex', 'important');
          el.style.setProperty('flex-direction', 'row', 'important');
          el.style.setProperty('flex-wrap', 'wrap', 'important');
          el.style.setProperty('justify-content', 'space-between', 'important');
          el.style.setProperty('width', '100%', 'important');
        }
      });
    };

    const observer = new MutationObserver(() => {
      enforceTwoColumns();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    const interval = setInterval(enforceTwoColumns, 300);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-full my-3 flex justify-center items-center flex-col overflow-hidden ${className}`}
    >
      <style jsx global>{`
        [data-type="_mgwidget"] {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
        }

        [data-type="_mgwidget"] > div,
        [data-type="_mgwidget"] [class*="content"],
        [data-type="_mgwidget"] [class*="block"],
        [data-type="_mgwidget"] [class*="line"],
        [data-type="_mgwidget"] [class*="row"],
        [data-type="_mgwidget"] [class*="grid"],
        [data-type="_mgwidget"] [class*="wrap"],
        [data-type="_mgwidget"] [class*="mgcontent"],
        [data-type="_mgwidget"] [class*="mgline"] {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: wrap !important;
          justify-content: space-between !important;
          align-items: stretch !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        [data-type="_mgwidget"] [class*="item"],
        [data-type="_mgwidget"] [class*="box"],
        [data-type="_mgwidget"] [class*="card"],
        [data-type="_mgwidget"] [class*="cell"],
        [data-type="_mgwidget"] [class*="mc_item"],
        [data-type="_mgwidget"] [class*="mgbox"] {
          width: 48.5% !important;
          max-width: 48.5% !important;
          flex: 0 0 48.5% !important;
          min-width: 0 !important;
          float: left !important;
          display: inline-block !important;
          box-sizing: border-box !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          margin-bottom: 12px !important;
        }

        [data-type="_mgwidget"] img,
        [data-type="_mgwidget"] [class*="image"],
        [data-type="_mgwidget"] [class*="thumb"],
        [data-type="_mgwidget"] [class*="pic"] {
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
          object-fit: cover !important;
          border-radius: 8px !important;
        }

        @media (max-width: 640px) {
          [data-type="_mgwidget"] [class*="title"],
          [data-type="_mgwidget"] [class*="text"],
          [data-type="_mgwidget"] [class*="header"],
          [data-type="_mgwidget"] a {
            font-size: 11px !important;
            line-height: 1.3 !important;
          }
        }
      `}</style>

      <div
        data-type="_mgwidget"
        data-widget-id={widgetId}
        className="w-full max-w-full flex justify-center text-center"
      />

      <Script
        id="adskeeper-site-script-1106781"
        src="https://jsc.adskeeper.com/site/1106781.js"
        strategy="afterInteractive"
      />
      <Script
        id={`adskeeper-site-script-${widgetId}`}
        src={`https://jsc.adskeeper.com/site/${widgetId}.js`}
        strategy="afterInteractive"
      />
      <Script
        id={`adskeeper-init-${widgetId}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,q){w[q]=w[q]||[];w[q].push(["_mgc.load"])})(window,"_mgq");`,
        }}
      />
    </div>
  );
}
