// Serializa dado estruturado (schema.org) pra injetar num
// <script type="application/ld+json"> via dangerouslySetInnerHTML.
//
// JSON.stringify sozinho não escapa "<" — um valor vindo de scraping
// (nome/bio) contendo literalmente "</script>" fecharia a tag cedo e
// qualquer HTML/script depois dele executaria de verdade. A sanitização
// de HTML que já roda no backend (nh3, melhorperfil-api) mira o contexto
// de renderização normal (dangerouslySetInnerHTML em <p>/<strong>), não
// esse contexto específico dentro de <script> — defesa em profundidade
// própria pra esse caso, não confia só na sanitização de outro lugar.
export function stringifyJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
