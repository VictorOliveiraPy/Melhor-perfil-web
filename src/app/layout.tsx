import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'melhorperfil',
  description: 'Ranking público de perfis de Instagram e LinkedIn',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-header">
          <div className="container shell-header">
            <div className="brand-wrap">
              <span>
                <span className="brand-mark">melhorperfil</span>
                <span className="brand-sub">Ranking de perfis — Instagram & LinkedIn</span>
              </span>
            </div>
            <nav aria-label="Navegação principal">
              <a href="/">Início</a>
              <a href="/board">Board</a>
              <a href="/board">Instagram</a>
              <a href="/board">LinkedIn</a>
            </nav>
          </div>
        </header>
        <div className="container main-shell">{children}</div>
      </body>
    </html>
  )
}
