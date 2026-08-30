import { postJson } from './httpClient'
import type { Platform } from '../lib/platform'

export type BidResult = {
  listingId: number
  // public_token da BidTransaction (UUID opaco, não o PK sequencial) — é o
  // que PixPaymentPanel manda de volta em ?transactionId= no polling de
  // status pra saber se ESTE Pix específico foi pago, em vez do `status`
  // agregado do listing (achado em produção 2026-08-27, spec.md seção 7).
  transactionId: string
  chargedCents: number
  isReinforcement: boolean
  newTotalCents: number
  displayName: string
  bio: string
  avatarUrl?: string
  usedFallback: boolean
  // Cobrança Pix de verdade (Mercado Pago) — a entrada só vira "ativa" e o
  // valor só é publicado depois do webhook confirmar (spec.md seção 6/7).
  // pixQrCode é o texto copia-e-cola; pixQrCodeBase64 é a imagem do QR
  // pronta em base64.
  pixQrCode: string
  pixQrCodeBase64: string
  paymentStatus: string
}

// Confirma o lance de verdade — cria ou reforça a entrada no
// melhorperfil-api (POST /listings/bid via o proxy /api/:path*), que faz
// o scraping (perfil novo) e a gravação no Postgres numa chamada só. Erros
// aqui NÃO caem em fallback silencioso: uma rejeição de negócio (ex.:
// valor abaixo do mínimo, reforço que não aumenta o lance) precisa chegar
// ao usuário com a mensagem real do backend (ver httpClient.postJson, que
// já extrai o "detail" do erro, inclusive o "reason" estruturado dos erros
// de cupom — ver HttpError.reason).
//
// couponCode (spec.md do melhorperfil-api, seção 9, "Cupom de lançamento"):
// opcional — quando preenchido, o backend pula a cobrança Pix inteira
// (BidResult.paymentStatus volta "cortesia", pixQrCode/pixQrCodeBase64
// vazios) e ativa a entrada na hora. amountCents continua obrigatório no
// tipo só por retrocompatibilidade de assinatura; o backend ignora o valor
// quando coupon_code vem preenchido (sempre usa o mínimo vigente).
export async function submitBid(
  profileUrl: string,
  platform: Platform,
  amountCents: number,
  isOwner: boolean,
  couponCode?: string,
): Promise<BidResult> {
  return postJson<BidResult>('/api/listings/bid', { profileUrl, platform, amountCents, isOwner, couponCode })
}
