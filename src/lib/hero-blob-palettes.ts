/**
 * Curated hero blob gradients: deep bases + restrained highlights for a calm, premium look.
 * Picked on each full load (see `HeroBlobBackdrop`); only `colorA`, `colorB`, `highlightColor` vary here.
 */
export type HeroBlobPalette = {
	colorA: string;
	colorB: string;
	highlightColor: string;
};

export const HERO_BLOB_PALETTES_DARK: readonly HeroBlobPalette[] = [
	// Indigo → violet (original site direction)
	{ colorA: '#1e3a8a', colorB: '#5b21b6', highlightColor: '#a5b4fc' },
	// Deep ocean
	{ colorA: '#0c4a6e', colorB: '#0369a1', highlightColor: '#7dd3fc' },
	// Onyx teal
	{ colorA: '#0f172a', colorB: '#115e59', highlightColor: '#5eead4' },
	// Plum silk
	{ colorA: '#3b0764', colorB: '#6d28d9', highlightColor: '#c4b5fd' },
	// Charcoal iris
	{ colorA: '#18181b', colorB: '#4c1d95', highlightColor: '#d8b4fe' },
	// Espresso copper (warm premium)
	{ colorA: '#292524', colorB: '#7c2d12', highlightColor: '#fcd34d' },
	// Forest jade
	{ colorA: '#14532d', colorB: '#047857', highlightColor: '#6ee7b7' },
	// Midnight rose
	{ colorA: '#1c1917', colorB: '#9f1239', highlightColor: '#fda4af' },
	// Slate steel
	{ colorA: '#1e293b', colorB: '#334155', highlightColor: '#cbd5e1' },
	// Abyss cyan
	{ colorA: '#164e63', colorB: '#0e7490', highlightColor: '#a5f3fc' },
] as const;

export const HERO_BLOB_PALETTES_LIGHT: readonly HeroBlobPalette[] = [
	/**
	 * Light-mode palettes need enough chroma/contrast to survive blending on a near-white page.
	 * Pastel tints tend to wash out (especially with soft-light), so these are "mid" tones
	 * that still read as ambient when opacity is kept low.
	 */
	// Sky ink
	{ colorA: '#38bdf8', colorB: '#60a5fa', highlightColor: '#93c5fd' },
	// Rose ink
	{ colorA: '#fb7185', colorB: '#f472b6', highlightColor: '#fda4af' },
	// Emerald ink
	{ colorA: '#34d399', colorB: '#22c55e', highlightColor: '#86efac' },
	// Violet ink
	{ colorA: '#a78bfa', colorB: '#818cf8', highlightColor: '#c4b5fd' },
	// Amber ink
	{ colorA: '#fbbf24', colorB: '#fb923c', highlightColor: '#fed7aa' },
	// Slate ink (neutral option that still shows on white)
	{ colorA: '#94a3b8', colorB: '#64748b', highlightColor: '#cbd5e1' },
] as const;

/** First palette: stable SSR / hydration default before client picks a random entry. */
export const HERO_BLOB_PALETTE_SSR_DARK = HERO_BLOB_PALETTES_DARK[0];
export const HERO_BLOB_PALETTE_SSR_LIGHT = HERO_BLOB_PALETTES_LIGHT[0];
