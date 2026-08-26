import { getJson } from './httpClient'

export type ListingStatus = {
  listingId: number
  status: string
  displayName: string
  bio: string
  avatarUrl?: string
  currentBidCents: number
}

// Consultado em polling pelo PixPaymentPanel enquanto espera o Pix
// confirmar (spec.md seção 7, passo 5) — nunca deve derrubar a tela por
// causa de uma falha pontual de rede/404, então falha silenciosa (null) em
// vez de lançar; quem chama só tenta de novo na próxima rodada.
export async function fetchListingStatus(listingId: number): Promise<ListingStatus | null> {
  try {
    return await getJson<ListingStatus>(`/api/listings/${listingId}/status`)
  } catch {
    return null
  }
}
