import { useEffect } from 'react';
import Lenis from 'lenis';

const defaultEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Site-wide smooth scrolling (Lenis).
 * Same-document `#` links: align the target section’s top edge with the viewport top
 * (`getBoundingClientRect().top + scrollY` → `scrollTo` that value).
 */
export function LenisSmoothScroll() {
	useEffect(() => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const lenis = new Lenis({
			duration: 0.9,
			easing: defaultEasing,
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			anchors: false,
			stopInertiaOnNavigate: true,
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

		/** Block native hash jump; Lenis scrolls so the section top meets the viewport top. */
		const onSameDocumentHashClickCapture = (event: MouseEvent) => {
			if (event.defaultPrevented || event.button !== 0) return;
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

			for (const node of event.composedPath()) {
				if (!(node instanceof HTMLAnchorElement) || !node.href) continue;
				if (node.target === '_blank' || node.hasAttribute('download')) continue;

				let url: URL;
				try {
					url = new URL(node.href);
				} catch {
					continue;
				}

				const here = new URL(window.location.href);
				if (url.origin !== here.origin || url.pathname !== here.pathname) continue;

				const { hash } = url;
				if (!hash || hash === '#') continue;

				event.preventDefault();
				if (here.hash !== hash) {
					history.replaceState(null, '', `${url.pathname}${url.search}${hash}`);
				}

				const id = decodeURIComponent(hash.slice(1));
				const el = id ? document.getElementById(id) : null;
				const scrollOpts = reduceMotion
					? { immediate: true as const }
					: { duration: 0.9 as const, easing: defaultEasing };

				if (el) {
					const sectionTop = el.getBoundingClientRect().top + window.scrollY;
					lenis.scrollTo(Math.max(0, sectionTop), scrollOpts);
				}

				break;
			}
		};

		document.addEventListener('click', onSameDocumentHashClickCapture, { capture: true });

		return () => {
			document.removeEventListener('click', onSameDocumentHashClickCapture, { capture: true });
			observer.disconnect();
			cancelAnimationFrame(rafId);
			lenis.destroy();
		};
	}, []);

	return null;
}

