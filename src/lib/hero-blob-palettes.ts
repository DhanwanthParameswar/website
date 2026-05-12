/**
 * Curated hero blob gradients: deep bases + restrained highlights for a calm, premium look.
 * Picked on each full load (see `HeroBlobBackdrop`); only `colorA`, `colorB`, `highlightColor` vary here.
 */
export type HeroBlobPalette = {
	colorA: string;
	colorB: string;
	highlightColor: string;
};

export const HERO_BLOB_PALETTES: readonly HeroBlobPalette[] = [
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

/** First palette: stable SSR / hydration default before client picks a random entry. */
export const HERO_BLOB_PALETTE_SSR = HERO_BLOB_PALETTES[0];
