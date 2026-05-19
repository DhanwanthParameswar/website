/** Phones/tablets: coarse pointer, no hover. */
export function isTouchPrimaryDevice(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/** Mouse / trackpad primary — custom cursor and Lenis apply here. */
export function isPointerFineDevice(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(pointer: fine)').matches;
}

/**
 * Skip expensive fixed viewport chrome (stacked backdrop-blur, bottom fade, scroll-driven opacity).
 */
export function shouldReduceViewportEffects(): boolean {
	if (typeof window === 'undefined') return false;

	if (isTouchPrimaryDevice()) return true;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;

	const nav = navigator as Navigator & {
		deviceMemory?: number;
		connection?: { saveData?: boolean };
	};

	if (nav.connection?.saveData) return true;
	if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return true;
	if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) return true;

	return false;
}

/** Mirrors {@link shouldReduceViewportEffects} for inline head scripts (no imports). */
export const REDUCE_VIEWPORT_EFFECTS_INLINE = `(function(){var m=window.matchMedia;var n=navigator;var c=n.connection;if(m('(hover: none) and (pointer: coarse)').matches||m('(prefers-reduced-motion: reduce)').matches||(n.hardwareConcurrency&&n.hardwareConcurrency<=4)||(n.deviceMemory&&n.deviceMemory<=4)||(c&&c.saveData)){document.documentElement.classList.add('reduce-viewport-effects');}})();`;
