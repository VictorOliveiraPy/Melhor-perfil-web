import type { Metadata } from 'next'
import Board from '../../components/Board'

// Dado vem ao vivo do melhorperfil-api a cada request — sem isso o Next
// congelaria a página no build (viu isso acontecer: build local sem
// API_BASE_URL gerou /instagram como estático com board vazio "pra sempre").
export const dynamic = 'force-dynamic'

// Achado de SEO (2026-08-30): sem isso, /instagram herdava o MESMO title/
// description da home (RootLayout) — conteúdo duplicado aos olhos do
// Google entre as duas páginas, que mostram basicamente o mesmo board.
// Title/description próprios aqui distinguem as duas (home = hero +
// pitch, /instagram = lista completa em si).
export const metadata: Metadata = {
  title: 'Ranking completo de perfis do Instagram',
  description:
    'Lista completa do leaderboard de perfis brasileiros do Instagram — veja todas as posições, não só o pódio, e dispute seu lugar.',
}

export default function InstagramBoard() {
  return <Board platform="instagram" heading="Perfis do Instagram em destaque" />
}
