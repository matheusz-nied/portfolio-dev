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

## Checklist para ir ao ar (domínio, analytics, agendamento)

Rode o wizard interativo, que te guia passo a passo pelas partes que só você
pode fazer (comprar domínio, mexer no dashboard da Vercel, criar conta de
agendamento):

```bash
./scripts/go-live-setup.sh
```

Ele cobre: registrar um domínio próprio, conectar na Vercel, configurar
`NEXT_PUBLIC_SITE_URL` (usado pelo sitemap, hreflang e JSON-LD), ativar o
Vercel Web Analytics (o pacote já está integrado em `src/app/[locale]/layout.tsx`)
e, opcionalmente, salvar um link de agendamento (Cal.com/Calendly) que ativa
automaticamente o canal "Agendar" na seção de contato.

Enquanto essa variável não estiver configurada, o site usa o endereço público
atual da Vercel (`https://portfolio-dev-lake-pi.vercel.app`) como fallback.

## Prints reais dos projetos

Os projetos abaixo ainda usam uma capa genérica (`cover.svg`) em
`public/projects/<slug>/` e precisam de prints reais antes de divulgar o link:

- `lumen` — `public/projects/lumen/`
- `revela-facil` — `public/projects/revela-facil/`
- `construcao-civil` — `public/projects/construcao-civil/`
- `sistemas-cett-ufg` — `public/projects/cett-ufg/`

Especificações para manter consistência com os cards já publicados (`orbit`,
`memora`, `orbitarium`):

- Formato `.png`, proporção próxima de **16:10** (o card usa `aspect-[16/10]`)
- Pelo menos 1 imagem "hero" por projeto; ideal 3–5 telas para quem tem mais de
  uma tela relevante (ver `memora/*.png` como referência)
- Depois de adicionar os arquivos, atualize `thumbnail` e `images` em
  `content/portfolio/projects.json` para apontar para eles
