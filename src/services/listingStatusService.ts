import { getJson } from './httpClient'

export type ListingStatus = {
  listingId: number
  status: string
  displayName: string
  bio: string
  avatarUrl?: string
  currentBidCents: number
  // Status da transação Pix ESPECÍFICA (public_token passado via
  // ?transactionId=), não do listing inteiro — achado em produção
  // 2026-08-27 (spec.md seção 7): num reforço/ultrapassagem sobre uma
  // entrada já "ativa", `status` sozinho não muda até o valor novo ser
  // aplicado, então o polling confiava erroneamente que o Pix NOVO tinha
  // sido pago quando na verdade era o status da entrada ANTIGA. "pendente"
  // | "paga" | null (token não bate/não existe/não pertence a este
  // listing — nunca vaza status de transação de outro listing).
  transactionStatus: string | null
}

// Consultado em polling pelo PixPaymentPanel enquanto espera o Pix
// confirmar (spec.md seção 7, passo 5) — nunca deve derrubar a tela por
// causa de uma falha pontual de rede/404, então falha silenciosa (null) em
// vez de lançar; quem chama só tenta de novo na próxima rodada.
//
// transactionId é obrigatório (public_token devolvido por POST
// /listings/bid ou /listings/takeover) — é o único jeito de decidir se O
// PIX QUE ACABOU DE SER GERADO foi pago, em vez de confiar no `status`
// agregado do listing (que pode já estar "ativa" por causa de uma entrada
// anterior, ver `transactionStatus` acima).
export async function fetchListingStatus(listingId: number, transactionId: string): Promise<ListingStatus | null> {
  try {
    return await getJson<ListingStatus>(`/api/listings/${listingId}/status?transactionId=${encodeURIComponent(transactionId)}`)
  } catch {
    return null
  }
}
