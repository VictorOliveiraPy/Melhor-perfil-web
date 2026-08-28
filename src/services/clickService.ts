// Clique num card registra evento (spec.md do melhorperfil-api, seção 4/7,
// item 6) — chamado do onClick do link real do perfil, que abre em nova
// aba (target="_blank"). Best-effort igual trackEvent(): nunca pode
// atrapalhar a navegação real, então não é `await`ado por quem chama, e
// falha silenciosa. `keepalive: true` porque, mesmo com target="_blank" não
// navegando a aba atual, o clique costuma vir junto de outras interações
// rápidas — mantém a request viva se o browser decidir descartar contexto
// de fetch em algum caso extremo.
export function registerCardClick(listingId: string): void {
  try {
    fetch(`/api/listings/${listingId}/click`, { method: 'POST', keepalive: true }).catch(() => {})
  } catch {
    // fetch nunca deveria lançar de forma síncrona, mas por garantia —
    // clique nunca pode quebrar a navegação pro perfil real.
  }
}
