/**
 * NextZone Movies - Custom HLS Stream Resolver Utility Template
 * 
 * Usage:
 * node scripts/streamResolverTemplate.js <tmdbId> <type> [m3u8Url]
 * 
 * Example:
 * node scripts/streamResolverTemplate.js 550 movie "https://your-cdn.com/streams/550/master.m3u8"
 */

const fs = require('fs');
const path = require('path');

const tmdbId = process.argv[2] || '550';
const type = process.argv[3] || 'movie';
const m3u8Url = process.argv[4] || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

console.log(`[Stream Resolver] Registering HLS stream for TMDB ID: ${tmdbId} (${type})`);
console.log(`[Stream Resolver] Target m3u8 URL: ${m3u8Url}`);

const streamData = {
  tmdbId,
  type,
  streamUrl: m3u8Url,
  subtitles: [
    {
      label: 'English',
      kind: 'subtitles',
      srcLang: 'en',
      src: 'https://vtt-demo.s3.amazonaws.com/english.vtt',
      default: true
    }
  ],
  updatedAt: new Date().toISOString()
};

console.log('[Stream Resolver] Stream payload generated successfully:');
console.log(JSON.stringify(streamData, null, 2));

console.log('\n[Stream Resolver] To link this stream in your app:');
console.log(`Update src/app/api/stream/route.ts to return this payload when requested with id=${tmdbId}`);
