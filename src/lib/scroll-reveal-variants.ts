import type { Viewport } from 'framer-motion';

import { sectionInViewReveal, sectionInViewRevealReduced } from '@/lib/motion-presets';

/**
 * Each block animates on its own — fire when **this** element scrolls into view (not when the section mounts).
 */
export const scrollRevealItemViewport: Viewport = {
	once: true,
	amount: 0.35,
	margin: '0px 0px -10% 0px',
};

/** Props to spread on `motion.*` for blur + lift scroll-in (respects reduced motion). */
export function scrollRevealItemMotionProps(reduceMotion: boolean | null) {
	const transition = reduceMotion ? sectionInViewRevealReduced : sectionInViewReveal;

	return {
		initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(9px)' },
		whileInView: reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' },
		viewport: scrollRevealItemViewport,
		transition,
	};
}
