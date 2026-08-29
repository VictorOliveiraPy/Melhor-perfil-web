import { ImageResponse } from 'next/og'
import { appIconElement } from '../../lib/appIconElement'

// Ícone dedicado pro manifest.ts (PWA) — a convenção especial icon.tsx só
// cobre o favicon da aba (um tamanho fixo), então os tamanhos que o
// manifest do Android pede (192/512, ver web.dev/articles/maskable-icon)
// viram rota própria em vez de arquivo de convenção.
export async function GET() {
  return new ImageResponse(appIconElement({ size: 192 }), { width: 192, height: 192 })
}
