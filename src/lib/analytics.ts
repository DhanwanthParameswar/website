/** Umami tracker on `window` (loaded via /magic.js). */
export type UmamiTracker = {
	track: (event?: string | Record<string, unknown>, data?: Record<string, unknown>) => void;
};

declare global {
	interface Window {
		umami?: UmamiTracker;
	}
}

const HASH_SECTIONS: Record<string, string> = {
	'#work': 'work',
	'#about': 'about',
	'#contact': 'contact',
	'#top': 'home',
};

let lastSection: string | null = null;
let lastPath = '';

export function trackUmamiEvent(name: string, data?: Record<string, string>) {
	window.umami?.track(name, data);
}

function sectionFromHash(hash: string): string | null {
	return HASH_SECTIONS[hash] ?? null;
}

export function trackSectionView() {
	const path = window.location.pathname;
	if (path !== lastPath) {
		lastPath = path;
		lastSection = null;
	}

	const section = sectionFromHash(window.location.hash);
	if (!section || section === lastSection) return;
	lastSection = section;
	trackUmamiEvent('Section View', { section });
}

function trackPageview() {
	window.umami?.track();
	trackSectionView();
}

function tryTrackPageview(attempt = 0) {
	if (window.umami) {
		trackPageview();
		return;
	}
	if (attempt < 20) {
		window.setTimeout(() => tryTrackPageview(attempt + 1), 100);
	}
}

export function tagOutboundLinks() {
	const name = 'outbound-link-click';
	document.querySelectorAll('a[href]').forEach((anchor) => {
		const a = anchor as HTMLAnchorElement;
		if (a.getAttribute('data-umami-event')) return;
		try {
			if (a.host && a.host !== window.location.host) {
				a.setAttribute('data-umami-event', name);
				a.setAttribute('data-umami-event-url', a.href);
			}
		} catch {
			/* invalid href */
		}
	});
}

export function initUmamiAnalytics() {
	document.addEventListener('astro:page-load', () => {
		tryTrackPageview();
		tagOutboundLinks();
	});

	window.addEventListener('hashchange', trackSectionView);

	const script = document.querySelector('script[src="/magic.js"]');
	if (script) {
		script.addEventListener('load', () => tryTrackPageview());
	}
}
