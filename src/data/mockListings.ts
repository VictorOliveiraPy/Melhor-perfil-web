export type BoardListing = {
  id: string
  rank: number
  display_name: string
  bio: string
  currentBidCents: number
  platform: 'instagram' | 'linkedin'
  profileHandle: string
  profileUrl: string
  clicks24h: number
  timeLabel: string
}

export const mockListings: BoardListing[] = [
  {
    id: 'inst-101',
    rank: 1,
    display_name: 'João Silva',
    bio: 'Designer & developer — Porto Alegre',
    currentBidCents: 1200,
    platform: 'instagram',
    profileHandle: 'joao.silva',
    profileUrl: 'https://instagram.com/joao.silva',
    clicks24h: 184,
    timeLabel: 'há 19 horas',
  },
  {
    id: 'lin-201',
    rank: 2,
    display_name: 'Maria Souza',
    bio: 'Marketing & growth para marcas digitais',
    currentBidCents: 5000,
    platform: 'linkedin',
    profileHandle: 'maria-souza',
    profileUrl: 'https://www.linkedin.com/in/maria-souza/',
    clicks24h: 512,
    timeLabel: 'há 11 horas',
  },
  {
    id: 'inst-102',
    rank: 3,
    display_name: 'Luan Costa',
    bio: 'Conteúdo de negócios e lifestyle',
    currentBidCents: 3400,
    platform: 'instagram',
    profileHandle: 'luan.costa',
    profileUrl: 'https://instagram.com/luan.costa',
    clicks24h: 301,
    timeLabel: 'há 3 horas',
  },
  {
    id: 'lin-202',
    rank: 4,
    display_name: 'Bia Rocha',
    bio: 'Product designer e UX',
    currentBidCents: 2800,
    platform: 'linkedin',
    profileHandle: 'bia-rocha',
    profileUrl: 'https://www.linkedin.com/in/bia-rocha/',
    clicks24h: 243,
    timeLabel: 'há 1 dia',
  },
]
