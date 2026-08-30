import type { LaunchCouponStatus } from '../services/launchCouponService'

export type LaunchCouponBannerInfo = {
  code: string
  remaining: number
}

// Decide se o banner/toggle de cupom deve aparecer em algum lugar da
// página. Precisa das TRÊS coisas ao mesmo tempo: o código configurado
// NESTE repo (NEXT_PUBLIC_LAUNCH_COUPON_CODE — o melhorperfil-api nunca
// devolve o código em si, só o status agregado, de propósito), o cupom
// ativado administrativamente (`isActive`), e ainda ter vaga (`remaining
// > 0`, que já contabiliza esgotamento por contagem OU expiração por
// tempo do lado do backend). Sem qualquer um dos três, `null` — melhor
// não anunciar nada do que anunciar uma promoção que a pessoa não
// consegue de fato usar.
export function resolveLaunchCoupon(
  status: LaunchCouponStatus | null,
  code: string | undefined,
): LaunchCouponBannerInfo | null {
  if (!status || !code || !status.isActive || status.remaining <= 0) return null
  return { code, remaining: status.remaining }
}
