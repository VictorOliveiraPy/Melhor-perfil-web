import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'melhorperfil-web',
  description: 'Esqueleto inicial'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-header">
          <div className="container">
            <h1 className="brand">melhorperfil</h1>
            <nav>
              <a href="/">Início</a>
              <a href="/board">Board</a>
            </nav>
          </div>
        </header>
        <div className="container">{children}</div>
      </body>
    </html>
  )
}
