const DATA_IMAGE_URI_PATTERN = /^data:image\/[a-z0-9.+-]+;base64,/i

// Guarda contra esquema perigoso (javascript:, data:text/html) num <img src>
// vindo de dado externo. https:// cobre hotlink direto (comportamento
// antigo); data:image/...;base64,... é o formato atual do melhorperfil-api
// (foto baixada e embutida — achado com o usuário testando de rede
// diferente: hotlinkar a URL assinada do Instagram direto é frágil, ver
// instagram_avatar_refresh.py).
export function isSafeAvatarUrl(url: string | undefined | null): url is string {
  if (!url) return false
  return url.startsWith('https://') || DATA_IMAGE_URI_PATTERN.test(url)
}
