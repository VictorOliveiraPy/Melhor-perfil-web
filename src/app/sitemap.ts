import type { MetadataRoute } from 'next'
import { fetchBoardListings } from '../services/boardApiService'
import { profileDetailHref } from '../lib/profileDetailHref'
import { SITE_URL } from '../lib/siteUrl'

// Busca ao vivo no melhorperfil-api, igual o board (ver AGENTS.md do
// backend e boardApiService.ts) — sem `force-dynamic` o Next tenta gerar
// isto estático no build e o sitemap fica congelado sem os perfis criados
// depois (mesma classe de bug do achado 2026-08-23 na home).
export const dynamic = 'force-dynamic'

// Se a API estiver fora do ar, fetchBoardListings já devolve lista vazia
// (resiliência existente) — o sitemap cai só nas rotas estáticas em vez de
// quebrar a resposta inteira.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await fetchBoardListings('instagram')

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/instagram`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/analytics`, changeFrequency: 'daily', priority: 0.3 },
  ]

  const profileRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${SITE_URL}${profileDetailHref('instagram', listing.id)}`,
    changeFrequency: 'hourly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...profileRoutes]
}
