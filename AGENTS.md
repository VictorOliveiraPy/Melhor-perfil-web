# AGENTS.md — melhorperfil (Web)

Constituição do repositório de **frontend**. `CLAUDE.md` é symlink para este arquivo. Regras de negócio (lance, ranking, moderação) não são duplicadas aqui — vivem em `../melhorperfil-api/specs/melhorperfil-mvp/spec.md`, acessível via `additionalDirectories` (`.claude/settings.json`). Leia o spec antes de implementar qualquer tela que dependa de regra de negócio.

**Stack:** Next.js (App Router) + React + TypeScript.

**Divisão com GitHub Copilot:** quando as duas ferramentas trabalham em paralelo, **GitHub Copilot é dono deste repo** (`melhorperfil-web`) — Claude Code fica no `melhorperfil-api`. O time de agentes em `.claude/agents/` deste repo continua disponível pra quando você quiser rodar Claude Code aqui fora desse modo paralelo, mas por padrão não roda simultâneo ao Copilot no mesmo repo.

## 1. Regras

- Server Components por padrão. `"use client"` só onde precisa de interatividade real (formulário de lance, contador de cliques).
- SSR/SSG no board público — é o motivo de usar Next.js em vez de SPA. Não implementar o board como client-only fetch.
- Nunca confiar em cálculo de lance (reforço vs. cheio) feito no client — é só preview; o servidor recalcula e é quem manda.
- Nunca renderizar nome de exibição/bio sem sanitizar — são campos livres preenchidos por qualquer usuário.
- Nada de segredo (chave de provedor Pix, secret de webhook) no client.

## Workflow e autonomia

Delegar pro time em `.claude/agents/`: `nextjs-engineer` implementa (TDD) → `code-reviewer` + `security-reviewer` revisam → `tdd-guide` confirma o ciclo red-green-refactor → corrige achado e repete até zero achados. Rodar esse loop até o fim **sem pausar pra pedir autorização a cada passo** — commitar e seguir pro próximo item do plano direto. Só interrompe se a tela depender de regra de negócio sem decisão no spec (`../melhorperfil-api/specs/melhorperfil-mvp/spec.md`), ou se for expor segredo/apagar dado — isso continua limite absoluto, não confirmação de rotina.

## 2. Padrões, reaproveitados do `santo-guardiao-web`

- Client HTTP genérico separado de services de domínio finos.
- Proxy same-origin `/api/:path*` para cookies first-party.
- `eslint` + `tsconfig strict`; convenções de componente/hook em `.claude/rules/{typescript,react}/coding-style.md` (copiar do santo-guardiao-web e adaptar).

## 3. Header de borda (`X-Gateway-Secret`)

O proxy `/api/:path*` (server-side, nunca client) anexa o header `X-Gateway-Secret` em toda chamada pra API — é o que permite a API rejeitar tráfego que não veio daqui (ver `AGENTS.md` do `melhorperfil-api`, seção 6).

- O segredo vive em `GATEWAY_SECRET` (env var **sem** prefixo `NEXT_PUBLIC_`) — só existe no processo server-side do Next.js, nunca chega no bundle do client.
- Nunca anexar esse header numa chamada feita direto do browser (client component fazendo `fetch` pra fora do proxy) — quebraria o propósito de existir.

## 4. Testes — TDD, mesma régua do backend

Teste primeiro, depois implementação (red → green → refactor) — ver `AGENTS.md` do `melhorperfil-api`, seção 2, mesma regra vale aqui.

- **Não testar componente visual/3D/estilo diretamente** — caro e frágil. Extrair toda regra de negócio do frontend (cálculo de lance pra preview, normalização de URL client-side, formatação de moeda) pra `src/lib/`, testada isolada, mesma estratégia do `santo-guardiao-web`.
- **Nome:** `describe`/`it` com comportamento, não implementação — `it("should show only the difference when owner reinforces bid")`.
- **Corpo do teste** com Given/When/Then em comentário + descrição de uma linha no próprio `it(...)`, sem docstring separada (não é o padrão em TS):

```ts
it("should show only the difference when owner reinforces bid", () => {
  // Given
  const listing = listingFactory({ currentBidCents: 1200 });

  // When
  const preview = previewBid(listing, { amountCents: 1500, isOwner: true });

  // Then
  expect(preview.chargeCents).toBe(300);
});
```

- Vitest, ambiente `node` (não `jsdom`) pra `src/lib/**` — reforça que só lógica pura é testada. Thresholds: 70% linhas/funções, 60% branches, mesmo padrão do `santo-guardiao-web`.

## 5. Comandos úteis

```
npm run lint
npm test -- --run
npm run build
npm run dev
```

## 6. Onde estão as coisas

- `../melhorperfil-api/specs/melhorperfil-mvp/spec.md` — regras de negócio, fluxo, critérios de aceitação. Fonte de verdade.
- Este arquivo — regras de comportamento do agente e padrões técnicos do frontend.
- `.claude/agents/` — time de especialistas do frontend: `nextjs-engineer` (implementa, TDD em `src/lib`), `ux-ui-designer` (layout/UX/copy), `build-error-resolver` (conserta build, diff mínimo), `code-reviewer` (qualidade, confiança >80%), `security-reviewer` (XSS/segredo no client/header de borda), `tdd-guide` (garante red-green-refactor de verdade).
