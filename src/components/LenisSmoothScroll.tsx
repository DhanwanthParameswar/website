import { useEffect } from 'react';
import Lenis from 'lenis';

import { isTouchPrimaryDevice } from '@/lib/device-capabilities';

const defaultEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Site-wide smooth scrolling (Lenis) on pointer-fine devices (desktop / trackpad).
 * Skipped on touch-primary devices so scrolling stays native.
 * Same-document `#` links: align the target section’s top edge with the viewport top
 * (`getBoundingClientRect().top + scrollY` → `scrollTo` that value).
 */
export function LenisSmoothScroll() {
	useEffect(() => {
		if (isTouchPrimaryDevice()) return;

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

		(window as any).lenis = lenis;

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

				// Explicitly skip code blocks, pre tags, and elements inside them so they never trap vertical scrolling
				if (el.tagName === 'PRE' || el.tagName === 'CODE' || el.closest('pre')) {
					continue;
				}

				const style = window.getComputedStyle(el);
				const hasVerticalScroll = 
					(style.overflowY === 'auto' || style.overflowY === 'scroll') && 
					el.scrollHeight > el.clientHeight;
				const isTextarea = el.tagName === 'TEXTAREA';

				if (hasVerticalScroll || isTextarea) {
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

		const scrollToHash = (targetHash?: string, immediate = true) => {
			const hash = targetHash || window.location.hash;
			if (!hash || hash === '#') return false;

			const id = decodeURIComponent(hash.slice(1));
			const el = document.getElementById(id);
			if (el) {
				const scrollOpts = immediate
					? { immediate: true as const }
					: { duration: 0.9 as const, easing: defaultEasing };

				const sectionTop = el.getBoundingClientRect().top + window.scrollY;
				lenis.scrollTo(Math.max(0, sectionTop), scrollOpts);
				return true;
			}
			return false;
		};

		// Scroll to initial hash if present
		if (window.location.hash) {
			setTimeout(() => {
				lenis.resize();
				scrollToHash(undefined, true);
			}, 100);
		}

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

				scrollToHash(hash, reduceMotion);
				break;
			}
		};

		document.addEventListener('click', onSameDocumentHashClickCapture, { capture: true });

		const handleAfterSwap = () => {
			lenis.resize();
			const scrolled = scrollToHash(undefined, true);
			if (!scrolled) {
				lenis.scrollTo(0, { immediate: true });
			} else {
				// Double-check the position in the next frames in case of layout shifts
				requestAnimationFrame(() => {
					lenis.resize();
					scrollToHash(undefined, true);
				});
			}
		};
		document.addEventListener('astro:after-swap', handleAfterSwap);

		return () => {
			document.removeEventListener('click', onSameDocumentHashClickCapture, { capture: true });
			document.removeEventListener('astro:after-swap', handleAfterSwap);
			observer.disconnect();
			cancelAnimationFrame(rafId);
			delete (window as any).lenis;
			lenis.destroy();
		};
	}, []);

	return null;
}

