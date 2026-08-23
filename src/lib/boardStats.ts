type ClickableBid = { clicks24h: number; currentBidCents: number }

export type BoardStats = {
  count: number
  totalClicks: number
  topBidCents: number
}

// Agregação simples usada tanto no board por plataforma (cabeçalho "N
// cliques em visibilidade") quanto na página /analytics (comparar as duas
// plataformas). Extraído pra não duplicar o mesmo reduce nos dois lugares.
export function boardStats(listings: readonly ClickableBid[]): BoardStats {
  return {
    count: listings.length,
    totalClicks: listings.reduce((sum, listing) => sum + listing.clicks24h, 0),
    topBidCents: listings.reduce((max, listing) => Math.max(max, listing.currentBidCents), 0),
  }
}
