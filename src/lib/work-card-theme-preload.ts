export type ThemeImageAsset = {
	src: string;
	srcSet?: string;
	sizes?: string;
};

type ImagePair = {
	light: ThemeImageAsset;
	dark: ThemeImageAsset;
};

const pairs = new Set<ImagePair>();

/** Register a work card’s light/dark assets for toggle-time preloading. */
export function registerWorkCardThemeImages(pair: ImagePair): () => void {
	pairs.add(pair);
	return () => {
		pairs.delete(pair);
	};
}

function preloadOne(asset: ThemeImageAsset): Promise<void> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve();
		img.onerror = () => resolve();
		if (asset.sizes) img.sizes = asset.sizes;
		if (asset.srcSet) img.srcset = asset.srcSet;
		img.src = asset.src;
	});
}

/** Warm the cache for the target theme’s work card images before the view transition runs. */
export async function preloadWorkCardTheme(theme: 'light' | 'dark'): Promise<void> {
	if (pairs.size === 0) return;

	const assets = [...pairs].map((pair) => (theme === 'dark' ? pair.dark : pair.light));
	await Promise.all(assets.map(preloadOne));
}
