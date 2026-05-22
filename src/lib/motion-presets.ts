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

/** Shared editorial ease — ease-out enter, no bounce (cinematic, not UI-snappy). */
export const heroRevealEase: Transition['ease'] = [0.16, 1, 0.3, 1];

/**
 * Hero blur-reveal tiers — staggered beats, not one shared duration.
 * Lead-in is quick; brand mark lingers; body/actions tighten so the arc resolves.
 */
export const heroBlurRevealLead: Transition = {
	duration: 0.56,
	ease: heroRevealEase,
};

export const heroBlurRevealBrand: Transition = {
	duration: 0.94,
	ease: heroRevealEase,
};

export const heroBlurRevealBody: Transition = {
	duration: 0.8,
	ease: heroRevealEase,
};

export const heroBlurRevealAction: Transition = {
	duration: 0.66,
	ease: heroRevealEase,
};

/** Default tier when no override is passed. */
export const heroBlurReveal: Transition = heroBlurRevealBody;

/** `prefers-reduced-motion`: opacity-only, short and linear-feeling ease (no blur choreography). */
export const heroBlurRevealReduced: Transition = {
	duration: 0.42,
	ease: [0.22, 1, 0.36, 1],
};

/**
 * Hero copy stagger (seconds) — story: greet → name/logo → role → act → scroll affordance.
 * Visual DOM stays “Hey!” above logo; timing follows spoken “Hey, I’m [name]”.
 */
export const heroStagger = {
	hey: 0,
	logo: 0.12,
	subtitle: 0.54,
	cta: 0.82,
	/** After CTA beat begins resolving; scroll hint is epilogue, not part of the headline cluster. */
	scrollHint: 1.36,
} as const;

/**
 * WebGPU hero backdrop — long opacity fade so the wash appears after layout, without competing with type.
 */
export const heroAmbientBackdrop: Transition = {
	duration: 1.12,
	delay: 0.1,
	ease: [0.16, 1, 0.3, 1],
};

export const heroAmbientBackdropReduced: Transition = {
	duration: 0.36,
	delay: 0,
	ease: [0.22, 1, 0.36, 1],
};

/**
 * Scroll hint — enters after headline cluster finishes (blurReveal max delay + duration), same motion language.
 */
export const heroScrollHintReveal: Transition = {
	duration: 0.68,
	ease: heroRevealEase,
	delay: heroStagger.scrollHint,
};

export const heroScrollHintRevealReduced: Transition = {
	duration: 0.4,
	ease: [0.22, 1, 0.36, 1],
	delay: 0.32,
};

/**
 * Work grid card — glow opacity on hover.
 * Slightly overdamped vs raw Framer physics (500/40/1) so opacity settles without wobble — reads more premium on UI chrome.
 */
export const workCardGlowHover: Transition = {
	type: 'spring',
	stiffness: 380,
	damping: 52,
	mass: 1,
	delay: 0,
};

/** `prefers-reduced-motion`: calm ease, no spring. */
export const workCardGlowHoverReduced: Transition = {
	duration: 0.28,
	ease: [0.4, 0, 0.2, 1],
	delay: 0,
};

/**
 * Below-the-fold sections — blur + lift on first scroll into view (same ease family as {@link heroBlurReveal}).
 */
export const sectionInViewReveal: Transition = {
	duration: 0.72,
	ease: [0.16, 1, 0.3, 1],
};

/** `prefers-reduced-motion`: opacity-only, shorter. */
export const sectionInViewRevealReduced: Transition = {
	duration: 0.38,
	ease: [0.22, 1, 0.36, 1],
};
