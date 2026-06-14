# Design System — Sage Cyberpunk / Netrun

Guia visual para reutilizar a identidade deste projeto em outros sites, apps ou interfaces.

---

## Identidade

**Tom:** cyberpunk técnico e sóbrio — não neon genérico, não “hacker matrix”.  
**Metáfora:** netrunning / terminal / breach — o usuário está dentro de um sistema ativo, não olhando um wallpaper animado.  
**Cor dominante:** sage green (`#8fbaa0`) sobre fundo quase preto esverdeado.  
**Sensação:** precisão, sinal, camadas de ICE, dados em trânsito — calmo, legível, atmosférico.

### Princípios

1. **Atmosfera na periferia, conteúdo no centro** — efeitos concentram-se nas bordas; o miolo fica limpo para leitura.
2. **Opacidade baixa** — acentos entre ~4% e ~18%; glow raro acima de 45%.
3. **Movimento lento** — ciclos de 3–28s; nada piscando agressivo.
4. **Interação ambiental** — affordances visuais (pontos, sublinhado tracejado, barras de ressonância), não tutoriais ou cards explicativos.
5. **Painéis, não cards fluff** — superfícies com borda, scanlines locais, header mono (`PRJ-01`, `REGISTRY`, `ICE:L3`).
6. **Sem parallax de cursor** — evita distração e parede de “portfólio template”.

---

## Paleta

### Portfolio (padrão)

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg-space` | `#0b0d0c` | Fundo base |
| `--bg-surface` | `#121614` | Superfícies, previews |
| `--bg-card` | `rgba(18, 24, 20, 0.55)` | Painéis semitransparentes |
| `--text-primary` | `#dde3df` | Texto principal |
| `--text-muted` | `#8a948c` | Labels, meta |
| `--accent-primary` | `#8fbaa0` | Acento, links, estados ativos |
| `--accent-secondary` | `#6d9f7e` | Acento secundário |
| `--border-subtle` | `rgba(143, 186, 160, 0.16)` | Bordas, grids |
| `--signal-accent-rgb` | `143, 186, 160` | Canvas/HUD (`rgba(var(--signal-accent-rgb), α)`) |

Fundo: radial-gradient sutil no topo (`rgba(80, 120, 95, 0.08)` → transparente).

### Tech

Mesma família, fundo levemente mais frio. `--tech-accent: #8fb89a`, `--signal-accent-rgb: 143, 184, 154`.

### Reflections

Tom roxo-ambar para contraste editorial. `--refl-accent: #b0a0c4`, `--refl-warm: #c4a894`, `--signal-accent-rgb: 176, 160, 196`.

### Regra de contraste

- Texto corpo: sempre `--text-primary` / `--text-muted` sobre `--bg-space`.
- Acento em decoração: opacidade ≤ 0.55 na maioria dos casos.
- Estados hover/focus: borda inset + leve `translateY(-1px)` + fundo `rgba(accent, 0.04–0.06)`.

---

## Tipografia

| Papel | Fonte | Onde |
|-------|-------|------|
| Corpo | Geist Sans (`--font-sans`) | Texto geral, prose tech |
| Display | Space Grotesk (`--font-display`) | Títulos de seção (`.section-title`) |
| Mono | Geist Mono (`--font-mono`) | HUD, labels, registry, terminal, headers tech |
| Serif | Lora (`--font-serif`) | Blog reflections, títulos editoriais |

### Escala HUD (mono)

- Meta / tags: `9px–11px`, `uppercase`, `letter-spacing: 0.12–0.14em`
- Feed terminal: `~9px` (`0.5625rem`)
- Status bar: `~9px`, peso 600 no tag principal

### Títulos de seção

```css
.section-title {
  font-family: var(--font-display);
  font-size: 1.625rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
/* barra decorativa 2rem × 2px, gradient accent → transparent */
```

---

## Camadas (z-index)

```
z-0   Fundo netrun (fixed, pointer-events-none)
z-10  Conteúdo da página
z-40  Nav sticky
z-50  Scanlines globais (se usadas — raro)
```

Wrapper de rota:

```tsx
<div className="theme-portfolio relative min-h-screen">
  <SignalMeshBackground />
  <div className="relative z-10">{/* conteúdo */}</div>
</div>
```

---

## Fundo — Netrun Field

Componente: `SignalMeshBackground`. Estética CP2077 / sessão de hack.

### Canvas (bordas)

- Colunas de **hex dump** (`4F 2A 8C …`) nas laterais
- **Blocos de memória** com endereços `0x…`
- **Scan horizontal** ocasional
- **Glitches** RGB raros (faixas deslocadas)
- Barra **BREACH** no canto superior esquerdo
- Grid vertical só onde `edgeWeight` é alto (periferia)

### HUD (CSS)

- **Brackets** nos 4 cantos
- Status: `NETRUN // DAEMON ACTIVE` + badge `ICE:L3`
- **Feed terminal** à esquerda (linhas rotativas: `> bypass_ICE`, `decrypt [████░░]`)
- Painel **ICE** à direita (barras + `BYPASSED`)
- Diamante rotativo (quickhack)
- Noise + auras blur + vignette central

### Comportamento

- `prefers-reduced-motion`: hex estático, sem feed, sem animações CSS
- `document.hidden`: pausa RAF
- `@media print`: oculto
- Mobile: esconde feed, ICE, statusbar; mantém brackets + canvas

### O que **não** repetir no fundo global

- Scanlines fortes (ficam nos painéis locais)
- Grid neon denso
- Partículas em excesso / rede de nós genérica

---

## Padrões de painel

Superfícies interativas seguem o mesmo vocabulário: **bus**, **registry**, **module**.

### Anatomia de um painel

```
┌─ scanlines (::after, opacity baixa)
│  ┌─ sweep horizontal (opcional, animado)
│  │
│  ├─ header mono: TAG | meta | status
│  ├─ corpo
│  └─ footer / hint
└─ borda: border-subtle / 60
```

### Contact — Data Bus

- Auto-scan entre canais (~2.2s)
- Nós clicáveis: label `Abrir →` / `Open →` em acento
- Valor com **sublinhado tracejado** (`border-bottom: dashed`)
- Hover/active: fundo inset, borda glow, linha gradiente no topo
- SVG de linhas com pulso de opacidade

### Projects — Registry

- Container `.project-registry` com scanlines + sweep
- Cards `.project-module` com header `PRJ-01`, badge `LIVE` / `STABLE`
- Preview com **corner brackets** (::before/::after 12×12px)
- Scan no hover (gradiente horizontal rápido)
- Primeiro featured: `md:col-span-2`

### Hero — Harmonic Field

- Campo imersivo full-width (fora do `max-w-5xl`)
- Onda SVG reativa ao cursor (probe)
- Letras do nome como nós: sublinhado pontilhado, estados `is-next` / `is-active` / `is-done` / `is-synced`
- Easter egg: sequência K→a→i→z→e→n acopla ressonância
- Readout flutuante com borda esquerda + blur (`hero-field-probe`)
- **Sem** prompt `$` ou copy de tutorial

---

## Motion

| Tipo | Duração | Easing |
|------|---------|--------|
| Entrada seção | 0.45s | `[0.22, 1, 0.36, 1]` |
| Hover UI | 0.2–0.28s | `ease` |
| Sweep painel | 3.5–4.5s | `ease-in-out`, loop |
| Aura fundo | 22–28s | `ease-in-out`, loop |
| Pulso live | 1.6s | `ease-in-out`, loop |

Sempre respeitar `prefers-reduced-motion` e `useReducedMotion()` (Framer) em componentes client.

---

## Microcopy / labels

Estilo **sistema operacional**, não marketing:

| ✅ Usar | ❌ Evitar |
|---------|----------|
| `REGISTRY`, `PRJ-01`, `LIVE` | “Meus projetos incríveis” |
| `Abrir →`, `ACCESS` | “Clique aqui!” |
| `NETRUN`, `ICE:L3`, `BREACH` | Lorem, emojis decorativos |
| `decrypt [████░░░░] 62%` | Parágrafos explicando a UI |

Idioma: conteúdo traduzível (next-intl); jargão HUD pode ficar em EN (autêntico ao gênero).

---

## Acessibilidade

- Fundo: `aria-hidden`, `pointer-events-none`
- Links e nós: estados `:focus-visible` com ring duplo (inset + outline)
- Contraste texto corpo OK sobre `--bg-space`
- Animações desligáveis globalmente via `prefers-reduced-motion`
- Imagens: `alt` descritivo; badges decorativos com texto adjacente

---

## Portar para outro projeto

### 1. Tokens

Copiar `src/styles/themes/portfolio.css` (e variantes) + bloco de tokens em `globals.css`.

### 2. Fontes

Geist Sans/Mono, Space Grotesk, Lora (ou substitutos: Inter + IBM Plex Mono + Source Serif).

### 3. Fundo

Copiar `SignalMeshBackground.tsx` + classes `.netrun-*` de `globals.css`.  
Montar dentro do wrapper de tema com `relative` + conteúdo em `z-10`.

### 4. Painéis

Reutilizar padrões `.contact-bus-*`, `.project-registry-*`, `.section-title`.  
Ajustar `--signal-accent-rgb` por tema.

### 5. Checklist visual

- [ ] Centro da tela legível (vignette ativa)
- [ ] Acento sage, não cyan/magenta saturado
- [ ] Scanlines só dentro de painéis
- [ ] Labels mono uppercase em headers de módulo
- [ ] Hover = borda inset + dashed underline, não scale exagerado
- [ ] Reduced motion testado

---

## Anti-patterns

- Grid hexagonal pesado ou “circuit board” clipart
- Neon rosa/azul estilo synthwave genérico
- Parallax de mouse no fundo
- Cards com sombra Material / border-radius 16px+
- Texto explicando como interagir com o Hero
- Scanlines globais fortes competindo com conteúdo
- Animações rápidas (< 1s) em loop contínuo
- Mais de 2–3 efeitos simultâneos na mesma área

---

## Referência rápida de arquivos

| Área | Arquivo |
|------|---------|
| Tokens portfolio | `src/styles/themes/portfolio.css` |
| Tokens tech / reflections | `src/styles/themes/tech.css`, `reflections.css` |
| Estilos globais + painéis | `src/app/globals.css` |
| Fundo netrun | `src/components/portfolio/SignalMeshBackground.tsx` |
| Hero | `src/components/portfolio/Hero.tsx` |
| Contact bus | `src/components/portfolio/ContactSection.tsx` |
| Project registry | `src/components/portfolio/ProjectsSection.tsx` |
