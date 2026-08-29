import { ImageResponse } from 'next/og'
import { appIconElement } from '../lib/appIconElement'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Ícone de tela inicial do iOS (Adicionar à Tela de Início) — convenção de
// arquivo especial do Next, referenciado automaticamente como
// <link rel="apple-touch-icon">. 180×180 é o tamanho recomendado pela Apple
// pra cobrir os devices mais recentes sem upscale.
export default function AppleIcon() {
  return new ImageResponse(appIconElement({ size: size.width }), { ...size })
}
