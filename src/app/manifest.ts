import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NextZone Movies - Watch Free Movies & TV Shows',
    short_name: 'NextZone',
    description: 'Watch unlimited movies and TV shows online free in 1080p Full HD on NextZone Movies.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#090914',
    theme_color: '#090914',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
