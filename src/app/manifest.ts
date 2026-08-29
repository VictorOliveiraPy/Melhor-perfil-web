import type { MetadataRoute } from 'next'

// Convenção de arquivo especial do Next — vira /manifest.webmanifest,
// referenciado automaticamente no <head> (mesmo padrão de robots.ts/
// sitemap.ts). display: 'standalone' tira a barra de endereço quando
// instalado — sensação de app, não de aba do navegador.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'melhorperfil',
    short_name: 'melhorperfil',
    description: 'Leaderboard público de perfis do Instagram — dispute o topo com lance real em Pix.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    lang: 'pt-BR',
    background_color: '#efeeee',
    theme_color: '#5b4bdb',
    icons: [
      { src: '/icon-192', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512-maskable', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
