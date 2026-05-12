import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Site-wide smooth scrolling (Lenis).
 * Mirrors the Framer script: duration 0.9, standard Lenis easing, RAF loop,
 * and overflow detection to avoid breaking nested scroll containers.
 */
export function LenisSmoothScroll() {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 0.9,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
		});

		let rafId = 0;
		const raf = (time: number) => {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		};
		rafId = requestAnimationFrame(raf);

		const markScrollContainers = (root: ParentNode) => {
			const nodes =
				root instanceof Element
					? [root, ...Array.from(root.querySelectorAll('*'))]
					: Array.from(root.querySelectorAll('*'));

			for (const el of nodes) {
				if (!(el instanceof HTMLElement)) continue;
				const style = window.getComputedStyle(el);
				if (style.overflow === 'auto' || style.overflow === 'scroll') {
					el.setAttribute('data-lenis-prevent', 'true');
				}
			}
		};

		// Initial pass
		markScrollContainers(document);

		// Keep parity for dynamically inserted scroll containers
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node instanceof Element) markScrollContainers(node);
				}
			}
		});
		observer.observe(document.documentElement, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
			cancelAnimationFrame(rafId);
			lenis.destroy();
		};
	}, []);

	return null;
}

