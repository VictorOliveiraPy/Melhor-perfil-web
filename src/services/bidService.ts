import { postJson } from './httpClient'
import type { Platform } from '../lib/platform'

export type BidResult = {
  listingId: number
  chargedCents: number
  isReinforcement: boolean
  newTotalCents: number
  displayName: string
  bio: string
  avatarUrl?: string
  usedFallback: boolean
}

// Confirma o lance de verdade — cria ou reforça a entrada no
// melhorperfil-api (POST /listings/bid via o proxy /api/:path*), que faz
// o scraping (perfil novo) e a gravação no Postgres numa chamada só. Erros
// aqui NÃO caem em fallback silencioso: uma rejeição de negócio (ex.:
// valor abaixo do mínimo, reforço que não aumenta o lance) precisa chegar
// ao usuário com a mensagem real do backend (ver httpClient.postJson, que
// já extrai o "detail" do erro).
export async function submitBid(
  profileUrl: string,
  platform: Platform,
  amountCents: number,
  isOwner: boolean,
): Promise<BidResult> {
  return postJson<BidResult>('/api/listings/bid', { profileUrl, platform, amountCents, isOwner })
}
