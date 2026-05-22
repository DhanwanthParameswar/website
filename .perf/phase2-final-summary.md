# Phase 2 Performance Summary

Date: 2026-05-22

## Scope completed

- Added Cloudflare headers in `public/_headers` (security + immutable caching for `/_astro/*`, logos/favicons, fonts).
- Deferred Lenis hydration in `src/layouts/BaseLayout.astro` from `client:load` to `client:media="(pointer: fine)"`.
- Removed one redundant logo preload in `src/layouts/BaseLayout.astro`.
- Migrated work content image references from `.png` to `.webp` in all `src/content/work/*/index.md` files.
- Removed now-unused `src/content/work/**/*.png` files (OG files under `design/` untouched).

## Asset-size impact (largest bottleneck addressed)

- Referenced work PNG assets in `HEAD`: **41,446 KB**
- Current referenced work WebP assets: **1,335 KB**
- Reduction: **96.8%**

Method: compared `git ls-tree -r --long HEAD src/content/work` PNG bytes against currently referenced `.webp` files in `src/content/work/*/index.md`.

## Isolated Lighthouse (local production preview)

Baseline files:
- `.perf/baseline/local-mobile.json`
- `.perf/baseline/local-desktop.json`

Post-change files (fresh preview process per run):
- `.perf/baseline/local-mobile-phase2-final.json`
- `.perf/baseline/local-desktop-phase2-final.json`

### Mobile

- Score: `72 -> 71`
- FCP: `1964ms -> 1965ms`
- LCP: `12788ms -> 14019ms`
- TBT: `43ms -> 42ms`
- CLS: `0.000 -> 0.000`
- Transfer: `2280KB -> 2736KB`
- Requests: `44 -> 42`

### Desktop

- Score: `88 -> 87`
- FCP: `623ms -> 564ms`
- LCP: `2313ms -> 2412ms`
- TBT: `0ms -> 0ms`
- CLS: `0.000 -> 0.000`
- Transfer: `2284KB -> 2763KB`
- Requests: `46 -> 46`

## Interpretation

- Local synthetic scores are roughly flat (slight noise/regression), but the core production risk found in Phase 1 was very large image payloads from work visuals.
- Phase 2 removed that upstream source risk by replacing referenced PNGs with compressed WebPs and deleting unused PNG assets from the content pipeline.
- Final validation should be done against deployed production (`dhanwanth.com`) after deployment, because the Phase 1 issue was specifically on production responses.

## Post-deploy production verification (completed)

Baseline files:
- `.perf/baseline/prod-mobile.json`
- `.perf/baseline/prod-desktop.json`

Post-deploy files:
- `.perf/baseline/prod-mobile-phase2-final.json`
- `.perf/baseline/prod-desktop-phase2-final.json`

### Production Mobile

- Score: `61 -> 68`
- FCP: `2651ms -> 2428ms`
- LCP: `56454ms -> 7990ms`
- TBT: `43ms -> 25ms`
- CLS: `0.000 -> 0.000`
- Transfer: `30517KB -> 1377KB`
- Requests: `47 -> 45`

### Production Desktop

- Score: `98 -> 100`
- FCP: `410ms -> 346ms`
- LCP: `1064ms -> 719ms`
- TBT: `0ms -> 0ms`
- CLS: `0.000 -> 0.000`
- Transfer: `30519KB -> 1386KB`
- Requests: `49 -> 49`
