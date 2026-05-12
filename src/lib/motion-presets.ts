import type { Transition } from 'framer-motion';

/**
 * Framer canvas default: Spring (based on time), time 0.8, bounce 0, delay 0.
 * Use for hover / state changes that should match published Framer feel.
 */
export const framerSpringTime: Transition = {
	type: 'spring',
	duration: 0.8,
	bounce: 0,
};

/**
 * Framer: text/link hover — Ease In Out, bezier (0.44, 0, 0.56, 1), time 0.2s, delay 0.
 * Use on `motion.a` / `motion.span` when animating link styles in React (not needed for plain `<a>` — see global CSS).
 */
export const linkHoverTransition: Transition = {
	duration: 0.2,
	ease: [0.44, 0, 0.56, 1],
};

/**
 * Hamburger morph + mobile drawer enter/exit — same object as {@link linkHoverTransition}
 * so open/close finishes when the icon finishes (0.2s, same bezier).
 */
export const menuToggleTransition: Transition = linkHoverTransition;

/**
 * Hero blur-reveal — tweened opacity + blur + slight lift (no spring bounce).
 * Ease is a smooth “settle” curve; duration tuned for editorial / premium feel.
 */
export const heroBlurReveal: Transition = {
	duration: 0.88,
	ease: [0.22, 1, 0.32, 1],
};

/** Scroll hint — delayed, same language as hero reveal (no long spring settle). */
export const heroScrollHintReveal: Transition = {
	duration: 1.05,
	ease: [0.22, 1, 0.32, 1],
	delay: 2.35,
};
