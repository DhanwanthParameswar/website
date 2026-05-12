# Website — agent context

## Goal

Rebuild a Framer portfolio as a **custom Astro site** with **visual parity** (layout, motion, blur, particles, scroll). Framer is the reference; treat published site + Framer canvas inspection as sources of truth for measurements and behavior.

## Implementation vs Framer

Framer sites are often **experimentally layered** or inconsistently named—not always aligned with maintainable code. **Prefer readability and sound structure** in this repo: semantic naming, consolidated tokens, sensible component boundaries, and conventional Astro/React patterns. Framer is the benchmark for **what users see and how interactions feel**, not a mandate to mirror messy trees, duplicate styles, or opaque hacks. Refactor freely when it improves clarity or fits this codebase; call out intentional deviations only when they affect parity.

## Stack

- **Astro** (minimal template), **React** islands where interactivity or motion needs hydration
- **Tailwind CSS v4** (Vite plugin)
- **Motion**: `framer-motion` in React components; prefer `client:visible` / `client:media` when possible
- **Icons**: [Lucide](https://lucide.dev) — use `lucide-react` in `.tsx` islands; in `.astro` prefer copying the Lucide SVG markup (same stroke/viewBox) so static shells stay dependency-light unless an icon needs interactivity.
- You may suggest more as necessary, this is just the base.

## Repo

- Remote: `https://github.com/DhanwanthParameswar/website`
- Node: `>=22.12.0` (see `package.json` engines)

## Resources

- **Framer MCP** (when enabled in the IDE): optional supplementary source for the Framer project—use with the published site and canvas, not instead of them.

## Conventions (target structure)

- `src/layouts/` — document shells
- `src/pages/` — routes
- `src/components/` — UI; prefer `*.astro` for static shells, `*.tsx` for motion/interaction
- `src/styles/` — global CSS, design tokens (CSS variables), Tailwind entry if needed
- `src/lib/` — small utilities (e.g. scroll helpers), no giant catch-alls

## Migration workflow

1. Lock **design tokens** (colors, type scale, radii, spacing) from Framer before pixel-chasing sections.
2. Rebuild **section by section** (hero → next block), comparing to live Framer URL in devtools.
3. Capture **motion** as named presets (duration, easing, stagger) in one place when patterns repeat.

## What not to do

- Do not add CMS, analytics, or new features until parity pass is done unless asked.
- Avoid shipping Framer-specific runtime; replicate behavior with our stack.
