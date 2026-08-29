import { ImageResponse } from 'next/og'
import { appIconElement } from '../../lib/appIconElement'

// Ver icon-192/route.tsx — mesmo racional, tamanho maior exigido pelo
// manifest do Android (ícone de splash screen/launcher em telas de alta
// densidade).
export async function GET() {
  return new ImageResponse(appIconElement({ size: 512 }), { width: 512, height: 512 })
}
