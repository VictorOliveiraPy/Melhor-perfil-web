import type { Platform } from './platform'

// Vivia em src/data/mockListings.ts — movido pra cá quando o mock foi
// removido e o board passou a consumir a API real (src/services/boardApiService.ts).
export type BoardListing = {
  id: string
  display_name: string
  bio: string
  currentBidCents: number
  platform: Platform
  profileHandle: string
  profileUrl: string
  avatarUrl?: string
  clicks24h: number
  timeLabel: string
}
