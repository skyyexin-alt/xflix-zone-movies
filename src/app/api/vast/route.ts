import { NextRequest, NextResponse } from 'next/server';

/**
 * ExoClick VAST 2.0 / 3.0 / 4.0 Server-Side Parser & Resolver
 * 
 * Fetches the VAST XML from ExoClick with client headers, parses video creatives,
 * tracking events, click-through URLs, and skip offsets.
 */
export async function GET(request: NextRequest) {
  const vastUrl = process.env.NEXT_PUBLIC_EXOCLICK_VAST_URL || 'https://s.magsrv.com/v1/vast.php?idz=6014142';

  try {
    const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    const res = await fetch(vastUrl, {
      headers: {
        'User-Agent': userAgent,
        ...(clientIp ? { 'X-Forwarded-For': clientIp } : {}),
        'Accept': 'application/xml, text/xml, */*',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ hasAd: false, error: 'VAST endpoint returned error' });
    }

    const xml = await res.text();

    if (!xml || !xml.includes('<VAST') || !xml.includes('<MediaFile')) {
      return NextResponse.json({ hasAd: false, message: 'No ad available' });
    }

    // Extract MediaFile (MP4 or WebM video URL)
    const mediaFileMatch = xml.match(/<MediaFile[^>]*?>([\s\S]*?)<\/MediaFile>/i);
    let mediaUrl: string | null = null;
    if (mediaFileMatch) {
      const raw = mediaFileMatch[1];
      const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
      mediaUrl = (cdata ? cdata[1] : raw).trim();
    }

    if (!mediaUrl) {
      return NextResponse.json({ hasAd: false, message: 'No linear video media found' });
    }

    // Extract ClickThrough URL
    const clickThroughMatch = xml.match(/<ClickThrough[^>]*?>([\s\S]*?)<\/ClickThrough>/i);
    let clickThroughUrl: string | null = null;
    if (clickThroughMatch) {
      const raw = clickThroughMatch[1];
      const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
      clickThroughUrl = (cdata ? cdata[1] : raw).trim();
    }

    // Extract Impression URLs
    const impressionMatches = Array.from(xml.matchAll(/<Impression[^>]*?>([\s\S]*?)<\/Impression>/gi));
    const impressions = impressionMatches.map(m => {
      const raw = m[1];
      const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
      return (cdata ? cdata[1] : raw).trim();
    }).filter(Boolean);

    // Extract Tracking Events
    const trackingEvents: Record<string, string[]> = {};
    const trackingMatches = Array.from(xml.matchAll(/<Tracking[^>]*?event=["']([^"']+)["'][^>]*?>([\s\S]*?)<\/Tracking>/gi));
    for (const m of trackingMatches) {
      const eventName = m[1].toLowerCase();
      const raw = m[2];
      const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
      const eventUrl = (cdata ? cdata[1] : raw).trim();
      if (eventName && eventUrl) {
        if (!trackingEvents[eventName]) trackingEvents[eventName] = [];
        trackingEvents[eventName].push(eventUrl);
      }
    }

    // Extract Skipoffset (default 5 seconds if not specified)
    const linearMatch = xml.match(/<Linear[^>]*?skipoffset=["']([^"']+)["']/i);
    let skipOffset = 5;
    if (linearMatch && linearMatch[1]) {
      const parts = linearMatch[1].split(':');
      if (parts.length === 3) {
        skipOffset = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
      } else {
        skipOffset = parseInt(linearMatch[1], 10) || 5;
      }
    }

    // Extract Title / CTA text if available
    const displayUrlMatch = xml.match(/<DisplayUrl>([\s\S]*?)<\/DisplayUrl>/i);
    let displayUrl = 'Visit Advertiser';
    if (displayUrlMatch) {
      const raw = displayUrlMatch[1];
      const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
      displayUrl = (cdata ? cdata[1] : raw).trim();
    }

    return NextResponse.json({
      hasAd: true,
      mediaUrl,
      clickThroughUrl,
      displayUrl,
      impressions,
      trackingEvents,
      skipOffset: isNaN(skipOffset) ? 5 : skipOffset,
    });

  } catch (error) {
    console.error('VAST parse error:', error);
    return NextResponse.json({ hasAd: false, error: 'Failed to resolve VAST ad' }, { status: 500 });
  }
}
