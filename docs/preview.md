Resumo do redesign — melhorperfil Web

1) Paleta de cores e tipografia
- Primária (fundo escuro): `#0B0B0B`
- Surface/strong: `#0F1113`
- Texto principal: `#F5F1EB`
- Texto mutado: `rgba(245,241,235,0.66)` (aprox. `#F5F1EB` com opacidade)
- Acento (call-to-action / destaque de lance): `#F1C97D`
- Acento 2 (gradiente): `#E8C48F`
- Erro: `#F76B6B`

Tipografia
- Fonte base: `Inter` (sistema fallback: `Segoe UI, system-ui`).
- Escala usada (variáveis em `globals.css`): `--text-xs` 0.72rem, `--text-sm` 0.86rem, `--text-md` 1rem, `--text-lg` 1.25rem, `--display-1` clamp(2rem, 4vw, 3.4rem).

2) Regras responsivas (mobile-first)
- Mobile (padrão): listas empilhadas (`.listing-row` -> uma coluna). Componentes com espaçamento compacto.
- Tablet / Desktop (`@media (min-width: 900px)`): aplicar `card-horizontal` em `.listing-row` para layout em duas colunas: conteúdo do perfil + coluna fixa para CTA/`BidForm` (320–360px).
- CTA: botões full-width no mobile, botão primário com altura 48px e gradiente `--accent-2 -> --accent`.

3) Comportamento visual (desktop / mobile)
- Cards horizontais com borda sutil e sombra; canto arredondado (12–14px).
- Avatar maior (64px) com radius 12px; rank como "pill" à esquerda.
- Badge de plataforma (Instagram/LinkedIn) com ícone inline + rótulo.
- Área de lance (coluna direita em desktop) com `BidForm` destacado; mostra `Valor atual` e `Preview de cobrança`.

4) Ícones (inline SVG)
- `src/components/icons/PlatformIcons.tsx` contém `InstagramIcon` e `LinkedInIcon` como SVGs inline.

5) Instruções para gerar previews
- Local (desenvolvimento):
```
npm install
npm run dev
```
Abra `http://localhost:3000/board` para ver o board e os cards.

- Com Docker (usa `docker-compose.yml` presente no repositório):
```
docker-compose build
docker-compose up
# Abra http://localhost:3000
```

6) Checagem de acessibilidade básica
- Texto principal `#F5F1EB` sobre `#0B0B0B`: contraste alto (> 12:1) — OK para corpo de texto e títulos.
- Acento `#F1C97D` sobre `#0B0B0B`: contraste estimado ~7.5:1 — OK para elementos importantes (botões, badges). Se usar `accent` sobre fundos claros, verifique contraste >= 4.5:1.
- Elementos mutados usam opacidade; garantir que labels e placeholders não fiquem abaixo de 4.5:1 em relação ao fundo quando usados sozinhos. Sugestões: aumentar opacidade ou usar `--text-sm` mais escuro para formulários críticos.

Teste de contraste local (sugestão): use o CLI `npx color-contrast-checker` ou ferramentas de navegador (Lighthouse / DevTools) para validar pares de cor.

7) Commit / branch / PR naming sugeridos
- Branch: `feat/ui/redesign-betterlance-style` (ou `feat/ui/board-redesign` para variação menor)
- Commit message (exemplo):
```
feat(ui): redesign visual do board seguindo estilo melhorlance.dev

- atualizar `globals.css` com tokens de paleta e utilitários
- badges de plataforma com SVG inline
- ajustar `ProfileCard` e `BidForm` para layout horizontal e CTA destacado
```
- PR title: `UI: Redesign do board — estilo melhorlance (Instagram/LinkedIn)`

Observações finais
- A lógica de negócio em `src/lib/*` não foi alterada. As mudanças são puramente visuais e componentes.
- Testes de lógica (`src/lib/*.test.ts`) devem continuar passando; mantenha TDD (escreva testes em `src/lib` antes de alterar regras de negócio).
