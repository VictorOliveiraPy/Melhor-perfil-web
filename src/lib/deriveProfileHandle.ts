// A API do melhorperfil-api devolve profile_url normalizada (ex.:
// "instagram.com/joao.silva"), não o @handle separado — o board precisa do
// handle isolado pra exibir "@joao.silva" e pro link de perfil.
export function deriveProfileHandle(profileUrl: string): string {
  const segments = profileUrl
    .replace(/^https?:\/\//i, '')
    .split('/')
    .filter(Boolean)

  return segments[segments.length - 1] ?? ''
}
