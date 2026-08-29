import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'melhorperfil — leaderboard público de perfis do Instagram'

// Gerada em runtime a partir do mesmo gradiente usado no valor do lance do
// site (globals.css: --quente #c0398f -> --accent #5b4bdb) — sem depender
// de nenhum arquivo de imagem versionado em public/.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(96deg, #c0398f, #5b4bdb)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '0 80px',
        }}
      >
        <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -2 }}>melhorperfil</div>
        <div style={{ fontSize: 40, marginTop: 28, opacity: 0.92 }}>
          Dispute o topo do ranking de perfis do Instagram
        </div>
      </div>
    ),
    { ...size },
  )
}
