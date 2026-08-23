import Board from '../../components/Board'

// Ver src/app/instagram/page.tsx pro porquê do force-dynamic.
export const dynamic = 'force-dynamic'

export default function LinkedInBoard() {
  return <Board platform="linkedin" heading="Perfis do LinkedIn em destaque" />
}
