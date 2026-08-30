export type LaunchCouponStatus = {
  isActive: boolean
  remaining: number
  maxRedemptions: number
  redeemedCount: number
  expiresAt: string | null
}

// Server-only — mesmo padrão de fetchBoardListings/fetchSiteAnalytics
// (SSR direto na API externa com X-Gateway-Secret, nunca via proxy
// client-side). Consumido pela home pra montar o banner de anúncio do
// cupom de lançamento (melhorperfil-api spec.md seção 9, "Status público
// do cupom") — GET /listings/coupon/status não exige X-Admin-Secret,
// só o header de borda comum.
//
// Qualquer falha (env não configurado, API fora do ar, erro de rede,
// resposta não-2xx) devolve null em vez de derrubar a página — sem
// cupom pra anunciar, o banner simplesmente não aparece (ver uso em
// src/app/page.tsx), igual à resiliência já usada pro board/analytics.
export async function fetchLaunchCouponStatus(): Promise<LaunchCouponStatus | null> {
  const apiBaseUrl = process.env.API_BASE_URL
  if (!apiBaseUrl) return null

  try {
    const response = await fetch(`${apiBaseUrl}/listings/coupon/status`, {
      headers: process.env.GATEWAY_SECRET ? { 'X-Gateway-Secret': process.env.GATEWAY_SECRET } : {},
      cache: 'no-store',
    })

    if (!response.ok) return null

    return (await response.json()) as LaunchCouponStatus
  } catch {
    return null
  }
}
