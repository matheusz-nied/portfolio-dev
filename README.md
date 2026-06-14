# me-blog-portifolio

Portfólio pessoal + blogs (tech e reflections). Next.js, TypeScript, Tailwind, next-intl (pt/en), conteúdo em MDX via Velite.

## Rodar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run lint` — ESLint
- `npm run content` — Velite em watch (MDX)

## Estrutura

- `content/` — portfólio, posts tech e reflections
- `src/app/[locale]/` — rotas (home, `/tech`, `/reflections`, projetos, resume)
- `messages/` — traduções
