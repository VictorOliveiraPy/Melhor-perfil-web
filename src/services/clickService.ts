// Clique num card registra evento (spec.md do melhorperfil-api, seção 4/7,
// item 6) — chamado do onClick do link real do perfil, que abre em nova
// aba (target="_blank"). Best-effort igual trackEvent(): nunca lança, falha
// silenciosa. Devolve uma Promise (sempre resolve, nunca rejeita) — achado
// em produção 2026-08-28: o contador no card não atualizava sozinho porque
// quem chamava não tinha como saber quando encadear router.refresh(); não
// bloqueia a navegação real, que é o próprio <a target="_blank"> do
// browser, independente desta Promise. `keepalive: true` mantém a request
// viva mesmo se o browser decidir descartar contexto de fetch em algum
// caso extremo.
export function registerCardClick(listingId: string): Promise<void> {
  try {
    return fetch(`/api/listings/${listingId}/click`, { method: 'POST', keepalive: true })
      .then(() => undefined)
      .catch(() => undefined)
  } catch {
    // fetch nunca deveria lançar de forma síncrona, mas por garantia —
    // clique nunca pode quebrar a navegação pro perfil real.
    return Promise.resolve()
  }
}
