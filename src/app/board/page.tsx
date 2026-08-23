import CombinedBoard from '../../components/CombinedBoard'
import { isPlatform } from '../../lib/platform'

// Explícito mesmo já sendo implicitamente dinâmica por causa de
// searchParams — não depender de comportamento implícito do Next pra dado
// que precisa estar sempre fresco.
export const dynamic = 'force-dynamic'

type Props = {
  searchParams: { platform?: string }
}

// /instagram e /linkedin continuam existindo como páginas cheias de uma
// plataforma só, com seu próprio heading e página de perfil. Esta rota é
// só mais uma forma de navegar — o mesmo CombinedBoard também aparece
// direto na home (ver src/app/page.tsx), a pedido do usuário.
export default function Board({ searchParams }: Props) {
  const filter = isPlatform(searchParams.platform) ? searchParams.platform : undefined

  return (
    <main className="board-page">
      <CombinedBoard filter={filter} basePath="/board" headingLevel={1} />
    </main>
  )
}
