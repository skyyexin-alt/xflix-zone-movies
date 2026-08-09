import { NextRequest, NextResponse } from 'next/server';

/**
 * NextZone Movies - Stream Resolution API Bridge
 * 
 * Resolves TMDB IDs into direct HLS (.m3u8) video stream URLs
 * and WebVTT subtitle tracks for the clean ad-free CustomVideoPlayer.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tmdbId = searchParams.get('id');
  const type = searchParams.get('type') || 'movie';
  const season = searchParams.get('s');
  const episode = searchParams.get('e');

  if (!tmdbId) {
    return NextResponse.json({ error: 'Missing TMDB ID parameter' }, { status: 400 });
  }

  try {
    // -------------------------------------------------------------------------
    // 1. Explicit Test Mode (?test=true)
    // -------------------------------------------------------------------------
    // If testing the custom HLS player explicitly via `?test=true`:
    const isTestMode = searchParams.get('test') === 'true';

    if (isTestMode) {
      return NextResponse.json({
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        subtitles: [
          {
            label: 'English',
            kind: 'subtitles',
            srcLang: 'en',
            src: 'https://vtt-demo.s3.amazonaws.com/english.vtt',
            default: true,
          },
        ],
        status: 'success',
      });
    }

    // -------------------------------------------------------------------------
    // 2. Real Movie Player Fallback
    // -------------------------------------------------------------------------
    // For real movie requests, returning streamUrl: null allows IntegratedPlayer
    // to stream the ACTUAL requested movie (e.g. Robin Hood) from clean servers.
    return NextResponse.json({
      streamUrl: null,
      subtitles: [],
      status: 'pending_source',
    });

  } catch (error) {
    console.error('Error resolving video stream:', error);
    return NextResponse.json({ streamUrl: null, error: 'Internal Server Error' }, { status: 500 });
  }
}



