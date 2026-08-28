import { deriveProfileHandle } from '../lib/deriveProfileHandle'
import { formatRelativeTime } from '../lib/formatRelativeTime'
import type { BoardListing } from '../lib/boardListing'
import type { Platform } from '../lib/platform'

type ApiListingItem = {
  id: number
  platform: Platform
  display_name: string
  profile_url: string
  bio: string
  current_bid_cents: number
  status: string
  created_at: string
  avatarUrl: string | null
  // Opcional (não obrigatório): resiliente a um deploy do backend ainda
  // não ter esse campo — nunca quebra o board por causa disso, só mostra 0.
  clicks24h?: number
}

type BoardApiResponse = {
  board: string
  page: number
  limit: number
  total: number
  items: ApiListingItem[]
}

function mapApiItem(item: ApiListingItem): BoardListing {
  return {
    id: String(item.id),
    display_name: item.display_name,
    bio: item.bio,
    currentBidCents: item.current_bid_cents,
    platform: item.platform,
    profileHandle: deriveProfileHandle(item.profile_url),
    profileUrl: item.profile_url,
    // Achado em produção 2026-08-24: esse campo nunca era lido aqui (comentário
    // antigo dizia que a API não tinha foto pra devolver — deixou de ser
    // verdade faz tempo, e a foto sumia mesmo já salva no Postgres). API
    // devolve null quando não tem foto ainda; BoardListing.avatarUrl é
    // opcional (undefined), não null — por isso o ?? undefined.
    avatarUrl: item.avatarUrl ?? undefined,
    // Achado 2026-08-28: ficava hardcoded em 0 mesmo o backend já
    // calculando o valor real (ClickEvent existia no model desde o início,
    // sem nada gravando nem lendo — POST /listings/{id}/click, ver
    // clickService.ts, fecha o ciclo).
    clicks24h: item.clicks24h ?? 0,
    timeLabel: formatRelativeTime(item.created_at),
  }
}

// Busca listagens reais do melhorperfil-api. Server-only — nunca importar
// isto de um "use client" (chama a API externa direto com
// X-Gateway-Secret, o mesmo segredo que src/app/api/[...path]/route.ts usa
// pro proxy; aqui é a própria renderização SSR do Server Component fazendo
// a chamada, não um roundtrip via browser — AGENTS.md seção 1, "SSR/SSG no
// board público").
//
// Qualquer falha (env não configurado, API fora do ar, erro de rede,
// resposta não-2xx) devolve lista vazia em vez de derrubar a página — o
// board mostra "ninguém ainda" (ver BoardSection) em vez de quebrar a home
// inteira por causa do backend.
export async function fetchBoardListings(platform: Platform, page = 1, limit = 50): Promise<BoardListing[]> {
  const apiBaseUrl = process.env.API_BASE_URL
  if (!apiBaseUrl) return []

  try {
    const response = await fetch(`${apiBaseUrl}/boards/${platform}?page=${page}&limit=${limit}`, {
      headers: process.env.GATEWAY_SECRET ? { 'X-Gateway-Secret': process.env.GATEWAY_SECRET } : {},
      cache: 'no-store',
    })

    if (!response.ok) return []

    const data = (await response.json()) as BoardApiResponse
    return data.items.map(mapApiItem)
  } catch {
    return []
  }
}
