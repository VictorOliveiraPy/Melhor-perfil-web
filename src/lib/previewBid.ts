export type Listing = {
  currentBidCents: number
}

export type PreviewInput = {
  amountCents: number
  isOwner?: boolean
}

export function previewBid(listing: Listing, input: PreviewInput) {
  const { currentBidCents } = listing
  const { amountCents, isOwner = false } = input

  if (isOwner) {
    // Owner pays only the difference (reinforcement)
    const charge = Math.max(0, amountCents - currentBidCents)
    return { chargeCents: charge }
  }

  // Non-owner pays the full amount as new bid
  return { chargeCents: amountCents }
}
