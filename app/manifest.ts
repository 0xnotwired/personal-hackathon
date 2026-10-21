import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Autonomía Digital',
    short_name: 'Autonomía',
    description: 'Practicá tus trámites a tu ritmo. No se mueve dinero.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f6faff',
    theme_color: '#005dbb',
    lang: 'es-AR',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
