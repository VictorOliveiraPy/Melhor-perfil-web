import Link from 'next/link'
import BoardSection from './BoardSection'
import { listingsByPlatform } from '../data/mockListings'
import { rankListings } from '../lib/rankListings'
import { boardStats } from '../lib/boardStats'
import type { Platform } from '../lib/platform'

type Props = {
  filter?: Platform
  basePath: string
  headingLevel?: 1 | 2
}

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

// Instagram e LinkedIn aparecem juntos por padrão, com filtro (link, não
// estado client — SSR normal de Server Component) pra quem quiser ver só
// uma plataforma. Cada seção continua calculando seu próprio ranking via
// BoardSection/rankListings — as duas plataformas não competem na mesma
// lista, spec.md seção 1 ("Isolamento por board") segue valendo.
// Reutilizado tanto em /board (headingLevel 1, é o h1 da página) quanto
// na home (headingLevel 2, a home já tem seu próprio h1 na hero — pedido
// do usuário pra ver os perfis na mesma tela da home, igual à referência
// melhorlance.dev, que também mostra o board direto na home).
export default function CombinedBoard({ filter, basePath, headingLevel = 1 }: Props) {
  const platforms: Platform[] = filter ? [filter] : ['instagram', 'linkedin']
  const totalClicks = platforms.reduce(
    (sum, platform) => sum + boardStats(rankListings(listingsByPlatform(platform))).totalClicks,
    0,
  )
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  const SubHeading = headingLevel === 1 ? 'h2' : 'h3'
  const todosHref = basePath === '/' ? '/' : basePath

  return (
    <section className="board-embed" aria-label="Board de perfis">
      <div className="board-topbar">
        <div>
          <p className="eyebrow">Board</p>
          <Heading>Perfis em destaque</Heading>
        </div>

        <div className="board-tabs">
          <Link href={todosHref} className={filter ? 'muted-tab' : 'active-tab'}>
            Todos
          </Link>
          <Link href={`${basePath}?platform=instagram`} className={filter === 'instagram' ? 'active-tab' : 'muted-tab'}>
            Instagram
          </Link>
          <Link href={`${basePath}?platform=linkedin`} className={filter === 'linkedin' ? 'active-tab' : 'muted-tab'}>
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
          {!filter && <SubHeading className="board-platform-heading">{PLATFORM_LABEL[platform]}</SubHeading>}
          <BoardSection listings={listingsByPlatform(platform)} />
        </section>
      ))}
    </section>
  )
}
