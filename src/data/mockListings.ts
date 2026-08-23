import type { Platform } from '../lib/platform'

export type { Platform }

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

// spec.md seção 1, "Dois boards independentes": cada plataforma tem seu
// próprio ranking, então o rank não é um dado fixo aqui — é calculado por
// board com rankListings() a partir do currentBidCents de cada plataforma.
export const mockListings: BoardListing[] = [
  {
    id: 'lin-101',
    display_name: 'Victor Hugo',
    bio: 'Product & growth — construindo negócios digitais',
    currentBidCents: 12800,
    platform: 'linkedin',
    profileHandle: 'victor-hugo-py',
    profileUrl: 'https://www.linkedin.com/in/victor-hugo-py/',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    clicks24h: 412,
    timeLabel: 'há 22 minutos',
  },
  {
    id: 'inst-101',
    display_name: 'João Silva',
    bio: 'Designer & developer — Porto Alegre',
    currentBidCents: 1200,
    platform: 'instagram',
    profileHandle: 'joao.silva',
    profileUrl: 'https://instagram.com/joao.silva',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    clicks24h: 184,
    timeLabel: 'há 19 horas',
  },
  {
    id: 'lin-201',
    display_name: 'Maria Souza',
    bio: 'Marketing & growth para marcas digitais',
    currentBidCents: 5000,
    platform: 'linkedin',
    profileHandle: 'maria-souza',
    profileUrl: 'https://www.linkedin.com/in/maria-souza/',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    clicks24h: 512,
    timeLabel: 'há 11 horas',
  },
  {
    id: 'inst-102',
    display_name: 'Luan Costa',
    bio: 'Conteúdo de negócios e lifestyle',
    currentBidCents: 3400,
    platform: 'instagram',
    profileHandle: 'luan.costa',
    profileUrl: 'https://instagram.com/luan.costa',
    avatarUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=80',
    clicks24h: 301,
    timeLabel: 'há 3 horas',
  },
  {
    id: 'lin-202',
    display_name: 'Bia Rocha',
    bio: 'Product designer e UX',
    currentBidCents: 2800,
    platform: 'linkedin',
    profileHandle: 'bia-rocha',
    profileUrl: 'https://www.linkedin.com/in/bia-rocha/',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    clicks24h: 243,
    timeLabel: 'há 1 dia',
  },
  {
    id: 'lin-203',
    display_name: 'Rafael Nunes',
    bio: 'Vendas B2B e parcerias estratégicas',
    currentBidCents: 700,
    platform: 'linkedin',
    profileHandle: 'rafael-nunes',
    profileUrl: 'https://www.linkedin.com/in/rafael-nunes/',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    clicks24h: 58,
    timeLabel: 'há 4 dias',
  },
  {
    id: 'inst-103',
    display_name: 'Ana Ribeiro',
    bio: 'Fotografia e viagens pelo Brasil',
    currentBidCents: 900,
    platform: 'instagram',
    profileHandle: 'ana.ribeiro',
    profileUrl: 'https://instagram.com/ana.ribeiro',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    clicks24h: 97,
    timeLabel: 'há 2 dias',
  },
]

export function listingsByPlatform(platform: Platform): BoardListing[] {
  return mockListings.filter((listing) => listing.platform === platform)
}
