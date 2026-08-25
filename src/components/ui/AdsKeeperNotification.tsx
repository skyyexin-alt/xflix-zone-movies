'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdsKeeperNotificationProps {
  widgetId?: string;
}

export default function AdsKeeperNotification({
  widgetId = "2066162",
}: AdsKeeperNotificationProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      // @ts-ignore
      window._mgq = window._mgq || [];
      // @ts-ignore
      window._mgq.push(["_mgc.load"]);
    } catch (e) {
      console.error("AdsKeeper Notification queue error:", e);
    }
  }, [pathname]);

  return (
    <div
      data-type="_mgwidget"
      data-widget-id={widgetId}
      id={`mg-insite-notif-${widgetId}`}
      className="adskeeper-insite-notification"
      aria-hidden="true"
    />
  );
}
