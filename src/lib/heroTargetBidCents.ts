const MIN_BID_CENTS = 100

// Valor mostrado na hero ("Pegue o número #1 por R$X") — pedido do usuário:
// deve ser dinâmico, não fixo. X = o maior lance atual entre as plataformas
// (é o que já custaria pra assumir o #1 hoje); sem ninguém ranqueado ainda
// em nenhuma plataforma, cai no mínimo do spec (spec.md do melhorperfil-api,
// seção 5: "Mínimo R$ 1") em vez de mostrar R$ 0.
export function heroTargetBidCents(topBidCentsByPlatform: readonly number[]): number {
  const highest = topBidCentsByPlatform.reduce((max, cents) => Math.max(max, cents), 0)
  return Math.max(highest, MIN_BID_CENTS)
}
