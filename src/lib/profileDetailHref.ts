import type { Platform } from './platform'

// Rota canônica da página de perfil individual (spec.md seção 4:
// "/instagram/p/:id e /linkedin/p/:id"). Extraído porque o mesmo template
// literal estava duplicado em ProfileCard, PodiumCard e BidRow — achado do
// code-reviewer, 2026-08-23.
export function profileDetailHref(platform: Platform, id: string): string {
  return `/${platform}/p/${id}`
}
