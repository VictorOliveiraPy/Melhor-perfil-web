import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/siteUrl'

// /api/ é o proxy server-side pra melhorperfil-api (anexa X-Gateway-Secret,
// ver AGENTS.md seção 3) — rota técnica, não conteúdo pra indexar.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
