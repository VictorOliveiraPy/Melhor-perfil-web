import { postJson } from './httpClient'
import type { Platform } from '../lib/platform'

export type ProfilePreview = {
  display_name: string
  bio: string
  avatarUrl?: string
  usedFallback: boolean
}

// Extrai um @handle plausível de uma URL de perfil já normalizada, só pro
// fallback client-side (nome = @handle, sem foto, bio vazia) — decisão
// "publica com fallback" fechada em 2026-08-23 (spec.md do melhorperfil-api,
// seção 11). A extração de verdade do nome/bio/foto é sempre resultado do
// backend; isto aqui é só o último recurso quando a chamada falha.
function fallbackFromUrl(profileUrl: string): ProfilePreview {
  const segments = profileUrl.replace(/^https?:\/\//, '').split('/').filter(Boolean)
  const handle = segments[segments.length - 1] ?? 'perfil'
  return { display_name: `@${handle}`, bio: '', usedFallback: true }
}

// Busca foto/bio reais a partir do link do perfil, via o proxy same-origin
// /api/:path* (que anexa o header de borda server-side). O scraping de
// verdade mora no melhorperfil-api — enquanto esse endpoint não existir ou
// falhar por qualquer motivo (perfil privado, rate limit, backend fora do
// ar), o comportamento é sempre o mesmo: fallback, sem bloquear o lance.
export async function fetchProfilePreview(profileUrl: string, platform: Platform): Promise<ProfilePreview> {
  try {
    return await postJson<ProfilePreview>('/api/profiles/preview', { profileUrl, platform })
  } catch {
    return fallbackFromUrl(profileUrl)
  }
}
