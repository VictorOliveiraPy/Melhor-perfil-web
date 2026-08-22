# melhorperfil-web — Instruções

Este repositório contém um esqueleto frontend Next.js com convenções do time (TDD em `src/lib`). Algumas ações automáticas foram realizadas pelo agente.

Próximos passos (no seu ambiente com Node/npm instalado):

Instalar dependências:

```bash
npm install
```

Rodar desenvolvimento:

```bash
npm run dev
```

Rodar testes (Vitest):

```bash
npm test -- --run
```

Rodar lint:

```bash
npm run lint
```

Build de produção:

```bash
npm run build
```

O agente criou as seguintes implementações e testes iniciais para você revisar:

- `src/lib/previewBid.ts` — lógica de preview de lance (owner paga diferença)
- `src/lib/previewBid.test.ts` — testes TDD cobrindo owner e non-owner

Utilitários adicionados:

- `src/lib/sanitize.ts` — `sanitizeDisplayName` escapa caracteres HTML
- `src/lib/normalizeProfileUrl.ts` — `normalizeProfileUrl` normaliza URL de perfil
- `src/lib/formatCurrency.ts` — `formatCurrency` formata centavos para BRL

Todos os utilitários têm testes em `src/lib/*.test.ts`.

Usando Docker
-------------

Construir imagem e subir container de desenvolvimento:

```bash
docker compose build --pull
docker compose up web
```

Rodar testes em container (vai instalar dependências dentro do container):

```bash
docker compose run --rm test
```

Observação: o container usa `node:20-bullseye-slim` e monta o diretório do projeto em `/app`.

Se quiser que eu execute as etapas de instalação, testes e build aqui, instale `node`/`npm` no ambiente ou permita que eu use outra ferramenta de execução; caso contrário, posso abrir um PR com as mudanças locais.
