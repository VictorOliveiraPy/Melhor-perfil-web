type Bid = { currentBidCents: number }

// Ordenação por valor pago, desempate por ordem de pagamento (spec.md seção
// 3: "Empate" — quem pagou primeiro fica na frente). Array.prototype.sort é
// estável em todo runtime que suportamos, então preservar a ordem original
// do array de entrada já resolve o desempate sem precisar de timestamp.
export function rankListings<T extends Bid>(listings: readonly T[]): (T & { rank: number })[] {
  return [...listings]
    .sort((a, b) => b.currentBidCents - a.currentBidCents)
    .map((listing, index) => ({ ...listing, rank: index + 1 }))
}
