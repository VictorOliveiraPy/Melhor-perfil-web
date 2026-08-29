import { ImageResponse } from 'next/og'
import { appIconElement } from '../../lib/appIconElement'

// Variante "maskable" (purpose: 'maskable' no manifest.ts) — o Android pode
// recortar isto num círculo/squircle específico do fabricante; o conteúdo
// fica com mais respiro (padding maior em appIconElement) pra nunca ser
// cortado, custe a estética de encher o quadrado inteiro.
export async function GET() {
  return new ImageResponse(appIconElement({ size: 512, maskable: true }), { width: 512, height: 512 })
}
