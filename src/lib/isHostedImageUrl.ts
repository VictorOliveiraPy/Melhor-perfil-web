// og:image (Open Graph) e o `image` de dado estruturado (JSON-LD) precisam
// de uma URL que um crawler EXTERNO (Facebook, Google, Twitter) consiga
// buscar sozinho — diferente de <img src>, que aceita perfeitamente um
// data: URI embutido (ver isSafeAvatarUrl.ts, usado no board). Incluir um
// data: URI nesses dois lugares não funciona (crawlers não decodificam
// data: URI de og:image) e ainda duplica um blob potencialmente grande no
// HTML/JSON-LD da página, piorando o peso que SEO penaliza.
export function isHostedImageUrl(url: string | undefined | null): url is string {
  if (!url) return false
  return url.startsWith('https://') || url.startsWith('http://')
}
