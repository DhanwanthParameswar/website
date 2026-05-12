import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

/**
 * Syncs with the `dark` class on document.documentElement.
 * SSR safe: returns null initially.
 */
export function useTheme() {
	const [theme, setTheme] = useState<Theme | null>(null);

	useEffect(() => {
		const getTheme = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
		setTheme(getTheme());

		const observer = new MutationObserver(() => {
			setTheme(getTheme());
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => observer.disconnect();
	}, []);

	return theme;
}
