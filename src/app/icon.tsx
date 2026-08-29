import { ImageResponse } from 'next/og'
import { appIconElement } from '../lib/appIconElement'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// Favicon da aba do navegador — convenção de arquivo especial do Next
// (referenciado automaticamente no <head>, sem <link rel="icon"> manual).
export default function Icon() {
  return new ImageResponse(appIconElement({ size: size.width }), { ...size })
}
