import type { ReactNode } from 'react'
import { fontDisplay, fontMono, fontSans } from './fonts'
import './globals.css'

export const metadata = {
  title: 'melhorperfil',
  description: 'Ranking público de perfis de Instagram e LinkedIn',
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
              <a href="/linkedin">LinkedIn</a>
            </nav>
          </div>
        </header>
        <div className="container main-shell">{children}</div>
      </body>
    </html>
  )
}
