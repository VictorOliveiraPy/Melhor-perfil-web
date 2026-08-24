"use client"

import { useState } from 'react'

type Props = {
  src?: string
  alt: string
  className?: string
}

// Fotos de Instagram/LinkedIn são URLs assinadas de CDN de terceiros — podem
// falhar depois de publicadas (a pessoa trocou/removeu a foto, bloqueio de
// hotlink variando por região/edge da CDN, etc). Achado do usuário testando
// no site ao vivo: uma foto real (@pontifex) apareceu com o ícone feio
// nativo de imagem quebrada do navegador. onError esconde a imagem e volta
// pro placeholder (div vazio) em vez de deixar o navegador mostrar isso —
// "use client" só por causa desse handler; o resto do board continua Server
// Component (CLAUDE.md seção 1).
export default function AvatarImage({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return null
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}
