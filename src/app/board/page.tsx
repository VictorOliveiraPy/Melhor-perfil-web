import Link from 'next/link'
import BoardSection from '../../components/BoardSection'
import { listingsByPlatform } from '../../data/mockListings'
import { rankListings } from '../../lib/rankListings'
import { boardStats } from '../../lib/boardStats'
import type { Platform } from '../../lib/platform'

type Props = {
  searchParams: { platform?: string }
}

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

function isPlatform(value: string | undefined): value is Platform {
  return value === 'instagram' || value === 'linkedin'
}

// Board combinado: Instagram e LinkedIn aparecem juntos por padrão, com um
// filtro (link, não estado client — SSR normal de Server Component) pra
// quem quiser ver só uma plataforma. Cada seção continua calculando seu
// próprio ranking via BoardSection/rankListings — as duas plataformas não
// competem na mesma lista, spec.md seção 1 ("Isolamento por board") segue
// valendo. /instagram e /linkedin continuam existindo como páginas cheias
// de uma plataforma só, com seu próprio heading e página de perfil.
export default function CombinedBoard({ searchParams }: Props) {
  const filter = isPlatform(searchParams.platform) ? searchParams.platform : undefined
  const platforms: Platform[] = filter ? [filter] : ['instagram', 'linkedin']

  const totalClicks = platforms.reduce(
    (sum, platform) => sum + boardStats(rankListings(listingsByPlatform(platform))).totalClicks,
    0,
  )

  return (
    <main className="board-page">
      <div className="board-topbar">
        <div>
          <p className="eyebrow">Board</p>
          <h1>Perfis em destaque</h1>
        </div>

        <div className="board-tabs">
          <Link href="/board" className={filter ? 'muted-tab' : 'active-tab'}>
            Todos
          </Link>
          <Link href="/board?platform=instagram" className={filter === 'instagram' ? 'active-tab' : 'muted-tab'}>
            Instagram
          </Link>
          <Link href="/board?platform=linkedin" className={filter === 'linkedin' ? 'active-tab' : 'muted-tab'}>
            LinkedIn
          </Link>
        </div>
      </div>

      <div className="board-meta-row">
        <span>Atualizado há 1 segundo</span>
        <span>·</span>
        <a href="#">Atualizar</a>
        <span>·</span>
        <span>{totalClicks.toLocaleString('pt-BR')} cliques em visibilidade</span>
      </div>

      {platforms.map((platform) => (
        <section key={platform} className="board-platform-group" aria-label={`Board de ${PLATFORM_LABEL[platform]}`}>
          {!filter && <h2 className="board-platform-heading">{PLATFORM_LABEL[platform]}</h2>}
          <BoardSection listings={listingsByPlatform(platform)} />
        </section>
      ))}
    </main>
  )
}
