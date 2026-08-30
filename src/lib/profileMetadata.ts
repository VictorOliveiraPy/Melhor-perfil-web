import type { BoardListing } from './boardListing'

const MAX_DESCRIPTION_LENGTH = 160
// Google trunca o <title> exibido na busca por volta de 60-70 caracteres —
// display_name vem de scraping (og:title) e às vezes carrega o nome do
// site junto (ex.: "Fulano (@fulano) • Instagram photos and videos"),
// deixando o título bem mais longo que o necessário. Truncar aqui evita um
// title cortado no meio de uma frase pelo próprio Google; a correção de
// verdade (limpar o sufixo no scraping) é um problema de qualidade de dado
// separado deste trabalho de SEO, não deste arquivo.
const MAX_TITLE_LENGTH = 70

// Cada página de perfil (/instagram/p/:id, listada no sitemap) tinha o
// MESMO title/description genérico do site inteiro, herdado do
// RootLayout — pior pra SEO de duas formas: conteúdo duplicado aos olhos
// do Google entre todas as páginas de perfil, e nenhuma chance de aparecer
// numa busca pelo nome/@ de alguém específico. Extraído pra src/lib
// (AGENTS.md seção 4) por ser regra de negócio pura, testável sem
// precisar montar uma Server Component inteira.
//
// `title` não inclui "| melhorperfil" — o template do RootLayout
// (metadata.title.template) já adiciona isso automaticamente.
export function buildProfileMetadata(listing: BoardListing & { rank: number }): {
  title: string
  description: string
} {
  const title = truncate(`${listing.display_name} — #${listing.rank} no ranking do Instagram`, MAX_TITLE_LENGTH)

  const bio = listing.bio.trim()
  const description = bio
    ? truncate(`${bio} · #${listing.rank} no ranking do melhorperfil`, MAX_DESCRIPTION_LENGTH)
    : `${listing.display_name} está em #${listing.rank} no ranking de perfis do Instagram do melhorperfil. Veja o perfil e dispute a posição.`

  return { title, description: truncate(description, MAX_DESCRIPTION_LENGTH) }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}
