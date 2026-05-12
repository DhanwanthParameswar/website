import { useEffect, useState } from 'react';

export function useIsDarkMode() {
	const [isDark, setIsDark] = useState(() => {
		if (typeof document === 'undefined') return true;
		return document.documentElement.classList.contains('dark');
	});
	
	useEffect(() => {
		const checkTheme = () => {
			setIsDark(document.documentElement.classList.contains('dark'));
		};
		checkTheme();
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'class') {
					checkTheme();
				}
			}
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	}, []);
	
	return isDark;
}
