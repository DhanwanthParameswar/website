# dhanwanth.com

Welcome! This is the repo for [dhanwanth.com](https://dhanwanth.com), my personal portfolio.

## What it's built with

- **[Astro 6](https://astro.build)** for the static shell and routing
- **React 19** islands for anything that needs to move, listen, or hydrate (`client:visible` / `client:media`)
- **Tailwind CSS v4** (via the Vite plugin) with design tokens centralized in CSS variables
- **[framer-motion](https://www.framer.com/motion/)** for choreographed transitions, **[Lenis](https://lenis.darkroom.engineering/)** for smooth scroll
- **[@firecms/neat](https://github.com/firecms/neat)** + custom shaders for the animated hero gradient
- **[Lucide](https://lucide.dev)** icons (React in islands, inlined SVG in `.astro` shells)
- **Cloudflare Pages** for hosting, with the `@astrojs/cloudflare` adapter

## Things worth a look

If you came here out of curiosity, these are the files I'd open first:

- [`src/components/Hero.astro`](src/components/Hero.astro) + [`HeroBlobIsland.tsx`](src/components/HeroBlobIsland.tsx) — the animated hero, with palette presets in [`src/lib/hero-blob-palettes.ts`](src/lib/hero-blob-palettes.ts)
- [`src/components/WorkSection.tsx`](src/components/WorkSection.tsx) — the project grid + pagination
- [`src/components/CustomCursor.tsx`](src/components/CustomCursor.tsx) — the cursor that follows you around
- [`src/components/LenisSmoothScroll.tsx`](src/components/LenisSmoothScroll.tsx) — Lenis wired into React + Astro
- [`src/lib/motion-presets.ts`](src/lib/motion-presets.ts) + [`scroll-reveal-variants.ts`](src/lib/scroll-reveal-variants.ts) — every duration/easing/stagger lives in one place
- [`src/lib/device-capabilities.ts`](src/lib/device-capabilities.ts) — how the site decides whether to dial back motion or shaders
- [`src/content/work/`](src/content/work/) — the project case studies, written as MDX

## Running it locally

You'll need **Node 22.12+** (`.node-version` is set).

```sh
npm install
npm run dev      # → http://localhost:4321
```

Other scripts:

| Command           | What it does                                              |
| :---------------- | :-------------------------------------------------------- |
| `npm run dev`     | Astro dev server (Node runtime)                           |
| `npm run build`   | Static build into `./dist/`                               |
| `npm run preview` | Build, then run the production worker locally (Wrangler)  |
| `npm run deploy`  | Build and ship to Cloudflare                              |

## Project layout

```text
src/
├── components/   UI — .astro for static shells, .tsx for motion / interaction
├── content/      MDX case studies + collection config
├── layouts/      Document shells (BaseLayout, etc.)
├── lib/          Small utilities — motion presets, SEO, device caps, hooks
├── pages/        Routes (index, /work/[slug], /privacy, 404, API)
└── styles/       Global CSS, design tokens
```



## Get in touch

- **Email:** [im@dhanwanth.com](mailto:im@dhanwanth.com)
- **LinkedIn:** [in/dhanwanthp](https://www.linkedin.com/in/dhanwanthp)
- **X:** [@dhanwanthp](https://x.com/dhanwanthp)
- **GitHub:** [@DhanwanthParameswar](https://github.com/DhanwanthParameswar)

If you found a bug, a typo, or just want to say hi — I'd genuinely love to hear from you.
