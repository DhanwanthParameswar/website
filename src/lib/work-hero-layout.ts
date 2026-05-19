/** Desktop reference layout for work project hero (WorkProjectHero). */
export const WORK_HERO = {
	/** Viewport width at which mockup width / peek stop growing. */
	layoutCapPx: 1200,
	/** Horizontal inset on the hero anchor (paddingInline × 2). */
	horizontalGutter: 32,
	titleGap: 136,
	/** Extra lift on the title block (px up from the mockup). */
	titleLiftPx: 160,
	/** Layout scale on the mockup column only (title stays 1×). */
	mockupScale: 1.12,
	/** PNG scale at scroll start (tilted rest pose). */
	restAssetScale: 1.18,
	/** Scroll-end asset scale at layoutCapPx. */
	scrollEndAssetScaleMin: 1.18,
	/** Scroll-end asset scale at tiltViewportMin (fills transparent padding on narrow viewports). */
	scrollEndAssetScaleMax: 1.5,
	/** Fraction of scaled mockup height that sits below the viewport bottom. */
	peekRatioOfMockup: 0.54,
	/** Minimum peek at layoutCapPx. */
	peekMinPx: 500,
	/** Extra upward pull on peek when viewport is narrower than layoutCapPx. */
	peekNarrowLiftMaxPx: 140,
	scrollEndScale: 0.75,
	/** Visual center Y for scroll-end centering (flat mockup, no tilt). */
	scrollEndCenterRatio: 0.5,
	/** Visual center Y for transform-origin (tilted rest pose + asset scale). */
	restCenterRatio: 0.425,
	/** Tilt at layoutCapPx and wider (scroll rest pose). */
	tiltDegMin: 18,
	/** Tilt at narrowest reference width. */
	tiltDegMax: 28,
	tiltViewportMin: 320,
	/** Title size at tiltViewportMin / layoutCapPx (rem). */
	titleRemMin: 2.5,
	titleRemMax: 7,
	/** Scroll progress at which title fade completes (wider = earlier fade). */
	titleFadeOpacityEndWide: 0.7,
	titleFadeOpacityEndNarrow: 0.96,
	titleFadeBlurEndWide: 0.6,
	titleFadeBlurEndNarrow: 0.9,
} as const;

export type TitleScrollFadeEnds = {
	opacityEnd: number;
	blurEnd: number;
	yEnd: number;
};

/** Max cluster content width (layout cap minus side gutter). */
export function getClusterMaxWidthPx(): number {
	return WORK_HERO.layoutCapPx - WORK_HERO.horizontalGutter;
}

export type ScrollEndCenterOffsets = { x: number; y: number };

/** Center of the sticky hero band below the fixed header (not full viewport). */
export function computeContentAreaCenterFromSection(
	sectionRect: DOMRectReadOnly,
	headerClearancePx: number,
): { x: number; y: number } {
	const contentHeight = Math.max(0, sectionRect.height - headerClearancePx);
	return {
		x: sectionRect.left + sectionRect.width / 2,
		y: sectionRect.top + headerClearancePx + contentHeight / 2,
	};
}

/** Center of the visible mockup image (falls back to layout box). */
export function getMockupVisualCenter(el: HTMLElement): { x: number; y: number } {
	const img = el.querySelector('img');
	const node = img instanceof HTMLImageElement ? img : el;
	const rect = node.getBoundingClientRect();
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2,
	};
}

/** Matches framer-motion transformPropOrder: translateX/Y → scale → rotateX. */
function formatScrollEndMockupTransform(
	offsets: ScrollEndCenterOffsets,
	scale: number,
): string {
	return `translateX(${offsets.x}px) translateY(${offsets.y}px) scale(${scale}) rotateX(0deg)`;
}

/**
 * Scroll-end translate (progress=1) to center the mockup in the content band below the header.
 * Uses the same transform string order as framer-motion (translateX/Y, not translate3d).
 */
export function measureScrollEndCenterOffsets(
	innerEl: HTMLElement,
	mockupEl: HTMLElement,
	targetCenterX: number,
	targetCenterY: number,
	options?: { endScale?: number; transformOrigin?: string },
): ScrollEndCenterOffsets {
	const endScale = options?.endScale ?? WORK_HERO.scrollEndScale;
	const savedTransform = mockupEl.style.transform;
	const savedOrigin = mockupEl.style.transformOrigin;
	if (options?.transformOrigin) {
		mockupEl.style.transformOrigin = options.transformOrigin;
	}

	let offsetX = 0;
	let offsetY = 0;

	for (let i = 0; i < 20; i++) {
		mockupEl.style.transform = formatScrollEndMockupTransform(
			{ x: offsetX, y: offsetY },
			endScale,
		);
		const { x: centerX, y: centerY } = getMockupVisualCenter(innerEl);
		const deltaX = targetCenterX - centerX;
		const deltaY = targetCenterY - centerY;
		if (Math.hypot(deltaX, deltaY) < 0.5) break;
		offsetX += deltaX;
		offsetY += deltaY;
	}

	mockupEl.style.transform = savedTransform;
	mockupEl.style.transformOrigin = savedOrigin;

	return {
		x: Math.round(offsetX * 10) / 10,
		y: Math.round(offsetY * 10) / 10,
	};
}

/** Scroll-end PNG scale inside the aspect box (grows as viewport width decreases). */
export function computeScrollEndAssetScale(viewportW: number): number {
	const w = Math.min(
		WORK_HERO.layoutCapPx,
		Math.max(WORK_HERO.tiltViewportMin, viewportW),
	);
	const span = WORK_HERO.layoutCapPx - WORK_HERO.tiltViewportMin;
	const narrowT = span > 0 ? (WORK_HERO.layoutCapPx - w) / span : 0;
	const scale =
		WORK_HERO.scrollEndAssetScaleMin +
		narrowT * (WORK_HERO.scrollEndAssetScaleMax - WORK_HERO.scrollEndAssetScaleMin);
	return Math.round(scale * 1000) / 1000;
}

/** Interpolate rest → scroll-end asset scale by scroll progress (0 = rest, 1 = end). */
export function lerpAssetScale(scrollProgress: number, scrollEndScale: number): number {
	const t = Math.min(1, Math.max(0, scrollProgress));
	return WORK_HERO.restAssetScale + t * (scrollEndScale - WORK_HERO.restAssetScale);
}

/** Scroll-rest tilt: increases as viewport width decreases. */
export function computeTiltDeg(viewportW: number): number {
	const w = Math.min(
		WORK_HERO.layoutCapPx,
		Math.max(WORK_HERO.tiltViewportMin, viewportW),
	);
	const span = WORK_HERO.layoutCapPx - WORK_HERO.tiltViewportMin;
	const t = span > 0 ? (WORK_HERO.layoutCapPx - w) / span : 0;
	return WORK_HERO.tiltDegMin + t * (WORK_HERO.tiltDegMax - WORK_HERO.tiltDegMin);
}

/** How far to push the cluster down so the enlarged mockup peeks below the fold. */
export function computeBottomPeekPx(mockupLayoutHeight: number, viewportW: number): number {
	const scaledH = mockupLayoutHeight * WORK_HERO.mockupScale;
	const fromMockup = scaledH * WORK_HERO.peekRatioOfMockup;
	const widthT = Math.min(1, viewportW / WORK_HERO.layoutCapPx);
	const basePeek = Math.max(WORK_HERO.peekMinPx * widthT, fromMockup);
	// Below layout cap: pull the cluster up further as the viewport narrows.
	const narrowLift = (1 - widthT) * WORK_HERO.peekNarrowLiftMaxPx;
	return Math.round(Math.max(0, basePeek - narrowLift));
}

/** Title font size scales linearly with viewport width up to layoutCapPx. */
export function computeTitleRem(viewportW: number): number {
	const w = Math.min(
		WORK_HERO.layoutCapPx,
		Math.max(WORK_HERO.tiltViewportMin, viewportW),
	);
	const span = WORK_HERO.layoutCapPx - WORK_HERO.tiltViewportMin;
	const t = span > 0 ? (w - WORK_HERO.tiltViewportMin) / span : 1;
	const rem = WORK_HERO.titleRemMin + t * (WORK_HERO.titleRemMax - WORK_HERO.titleRemMin);
	return Math.round(rem * 100) / 100;
}

/** Later fade endpoints on narrow viewports so the title stays readable until the mockup covers it. */
export function computeTitleScrollFadeEnds(viewportW: number): TitleScrollFadeEnds {
	const w = Math.min(
		WORK_HERO.layoutCapPx,
		Math.max(WORK_HERO.tiltViewportMin, viewportW),
	);
	const span = WORK_HERO.layoutCapPx - WORK_HERO.tiltViewportMin;
	const narrowT = span > 0 ? (WORK_HERO.layoutCapPx - w) / span : 0;
	const opacityEnd =
		WORK_HERO.titleFadeOpacityEndWide +
		narrowT * (WORK_HERO.titleFadeOpacityEndNarrow - WORK_HERO.titleFadeOpacityEndWide);
	const blurEnd =
		WORK_HERO.titleFadeBlurEndWide +
		narrowT * (WORK_HERO.titleFadeBlurEndNarrow - WORK_HERO.titleFadeBlurEndWide);
	return { opacityEnd, blurEnd, yEnd: opacityEnd };
}

/** Shrink title only when the full stack would collide with the header. */
export function computeTitleFitScale(
	viewportH: number,
	titleBlockHeight: number,
	mockupLayoutHeight: number,
	headerClearancePx: number,
	bottomPeekPx: number,
): number {
	const scaledMockupH = mockupLayoutHeight * WORK_HERO.mockupScale;
	const stackHeight =
		titleBlockHeight +
		WORK_HERO.titleGap +
		WORK_HERO.titleLiftPx +
		scaledMockupH -
		bottomPeekPx;
	const availableH = viewportH - headerClearancePx;
	if (stackHeight <= 0 || availableH <= 0) return 1;
	return Math.min(1, availableH / stackHeight);
}

let headerClearanceProbe: HTMLDivElement | null = null;

/** Resolved pixel height of --site-header-clearance (parseFloat on calc() is wrong). */
export function readHeaderClearancePx(): number {
	if (typeof document === 'undefined') return 0;
	if (!headerClearanceProbe) {
		headerClearanceProbe = document.createElement('div');
		headerClearanceProbe.style.cssText =
			'position:absolute;visibility:hidden;pointer-events:none;height:var(--site-header-clearance);width:0;';
		document.documentElement.appendChild(headerClearanceProbe);
	}
	return headerClearanceProbe.offsetHeight;
}

/**
 * Depth-fade strength (0 = fully revealed, 1 = max recede into tilt).
 * Coupled to scroll and current tilt so narrow / tilted views feel more dimensional.
 */
export function computeDepthFadeIntensity(scrollProgress: number, tiltDeg: number): number {
	const scrollFade = 1 - scrollProgress;
	const tiltSpan = WORK_HERO.tiltDegMax - WORK_HERO.tiltDegMin;
	const tiltFade = tiltSpan > 0 ? (tiltDeg - WORK_HERO.tiltDegMin) / tiltSpan : 0;
	return Math.min(1, scrollFade * (0.38 + 0.62 * tiltFade));
}

/** CSS mask gradient mimicking foreshortening on a tilted device (top recedes). */
export function buildMockupDepthMask(intensity: number, theme: 'light' | 'dark'): string {
	const rgb = theme === 'light' ? '0,0,0' : '255,255,255';
	const opacity = (receded: number) => {
		const value = receded + (1 - receded) * (1 - intensity);
		return Math.round(value * 1000) / 1000;
	};
	return `linear-gradient(to bottom,
		rgba(${rgb},${opacity(0.18)}) 0%,
		rgba(${rgb},${opacity(0.34)}) 7%,
		rgba(${rgb},${opacity(0.48)}) 15%,
		rgba(${rgb},${opacity(0.62)}) 24%,
		rgba(${rgb},${opacity(0.76)}) 34%,
		rgba(${rgb},${opacity(0.87)}) 44%,
		rgba(${rgb},${opacity(0.94)}) 54%,
		rgba(${rgb},${opacity(0.98)}) 62%,
		rgba(${rgb},1) 70%
	)`;
}

export function shouldSkipHeroLayoutMeasure(): boolean {
	if (typeof document === 'undefined') return false;
	const root = document.documentElement;
	return (
		root.classList.contains('theme-transition') ||
		root.classList.contains('no-transitions')
	);
}
