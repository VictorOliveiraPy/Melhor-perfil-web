type AppIconOptions = {
  size: number
  maskable?: boolean
}

// Ícone do app reaproveita o mesmo gradiente da imagem de Open Graph
// (globals.css: --quente #c0398f -> --accent #5b4bdb) e o desenho de 3
// barras crescentes do wordmark do header (brand-icon em layout.tsx) —
// mesma identidade visual, sem depender de nenhum arquivo de design
// versionado. Compartilhado entre icon.tsx, apple-icon.tsx e as rotas de
// ícone do manifest (icon-192, icon-512, icon-512-maskable).
//
// `maskable`: o Android recorta o ícone num círculo/squircle — o conteúdo
// precisa caber dentro da "safe zone" (~80% central) ou fica cortado, por
// isso o padding aumenta bastante nesse modo.
// Ver https://web.dev/articles/maskable-icon.
export function appIconElement({ size, maskable = false }: AppIconOptions) {
  const padding = maskable ? size * 0.28 : size * 0.2
  const gap = size * 0.07
  const contentSize = size - padding * 2
  const barWidth = (contentSize - gap * 2) / 3
  const barHeights = [0.45, 0.72, 1].map((factor) => contentSize * factor)

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap,
        backgroundImage: 'linear-gradient(96deg, #c0398f, #5b4bdb)',
        padding,
      }}
    >
      {barHeights.map((height, index) => (
        <div
          key={index}
          style={{
            width: barWidth,
            height,
            borderRadius: size * 0.04,
            background: '#ffffff',
          }}
        />
      ))}
    </div>
  )
}
