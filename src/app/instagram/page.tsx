import Board from '../../components/Board'

// Dado vem ao vivo do melhorperfil-api a cada request — sem isso o Next
// congelaria a página no build (viu isso acontecer: build local sem
// API_BASE_URL gerou /instagram como estático com board vazio "pra sempre").
export const dynamic = 'force-dynamic'

export default function InstagramBoard() {
  return <Board platform="instagram" heading="Perfis do Instagram em destaque" />
}
