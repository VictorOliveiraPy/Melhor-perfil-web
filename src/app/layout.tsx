import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import { fontDisplay, fontMono, fontSans } from './fonts'
import { SITE_URL } from '../lib/siteUrl'
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration'
import InstallPwaBanner from '../components/InstallPwaBanner'
import './globals.css'

const TITLE = 'melhorperfil — dispute o topo do ranking de perfis do Instagram'
const DESCRIPTION =
  'Leaderboard público de perfis brasileiros do Instagram. Lance pra subir no ranking e ganhar visibilidade — o #1 muda a qualquer hora.'

// metadataBase resolve as URLs relativas de OG/Twitter (imagem, canonical)
// pro domínio de produção — sem isso o Next cai no host do próprio deploy
// (ex: *.vercel.app) em vez de melhorperfil.com.br quando renderizado fora
// de produção (preview, local).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | melhorperfil',
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'melhorperfil',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  manifest: '/manifest.webmanifest',
  // capable: true tira a barra do Safari quando adicionado à tela de
  // início do iOS — mesmo efeito do display:'standalone' do manifest.ts,
  // que o iOS não lê.
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'melhorperfil',
  },
}

// themeColor mora em viewport (não em metadata) desde o Next 14 — pinta a
// barra de status/endereço do navegador na cor da marca quando instalado.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#5b4bdb',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}>
      <body>
        <header className="site-header">
          <div className="container shell-header">
            <a className="brand-wrap" href="/" aria-label="melhorperfil, início">
              <svg className="brand-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="1" y="9" width="4" height="8" rx="1" fill="var(--muted)" />
                <rect x="7" y="5" width="4" height="12" rx="1" fill="var(--accent)" />
                <rect x="13" y="1" width="4" height="16" rx="1" fill="var(--muted)" />
              </svg>
              <span className="brand-mark">melhorperfil</span>
            </a>
            <nav aria-label="Navegação principal">
              <a href="/instagram">Instagram</a>
            </nav>
          </div>
        </header>
        <div className="container main-shell">{children}</div>
        {/* Himetrica é um tracker client-side (a chave é feita pra rodar no
            navegador — não é segredo tipo GATEWAY_SECRET, é padrão deles
            mesmos, igual site ID do Plausible/PostHog). strategy=
            "afterInteractive" é o equivalente do Next pro `defer` pedido no
            setup deles. Só carrega se a env var estiver configurada (Vercel
            → NEXT_PUBLIC_HIMETRICA_API_KEY) — sem ela, undefined vira a
            string "undefined" no atributo, então checa antes. */}
        {process.env.NEXT_PUBLIC_HIMETRICA_API_KEY && (
          <Script
            src="https://cdn.himetrica.com/tracker.js"
            strategy="afterInteractive"
            data-api-key={process.env.NEXT_PUBLIC_HIMETRICA_API_KEY}
          />
        )}
        <ServiceWorkerRegistration />
        <InstallPwaBanner />
      </body>
    </html>
  )
}
