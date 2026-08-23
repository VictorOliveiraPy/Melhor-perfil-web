// Achado do security-reviewer (2026-08-23): o fallback antigo devolvia
// `raw` sem checar nada quando `new URL()` falhava — e "javascript:alert(1)"
// é exatamente um caso que falha (o prepend de "https://" abaixo produz uma
// URL inválida, "https://javascript:alert(1)"), então o valor saía intacto
// daqui e ia parar direto num href= (ProfileCard/ProfileDetail): clique no
// link do perfil executava JS arbitrário no contexto do site. Correção:
// nunca devolver `raw` no catch. O check de protocol logo abaixo é
// defesa em profundidade — hoje sempre verdadeiro dado o prepend acima,
// mas barato o suficiente pra manter caso essa lógica mude no futuro.
export function normalizeProfileUrl(raw: string): string {
  if (!raw) return ''
  let url = raw.trim()

  // add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  try {
    const u = new URL(url)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return ''
    // remove trailing slash
    u.pathname = u.pathname.replace(/\/+$/,'')
    return u.toString()
  } catch (e) {
    return ''
  }
}
