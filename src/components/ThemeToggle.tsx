import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ICON_SIZE = 18;
const STROKE = 2;
const THEME_TRANSITION_MS = 320;

let themeTransitionTimeout: ReturnType<typeof setTimeout> | undefined;

export function ThemeToggle({ className, tabIndex }: { className?: string; tabIndex?: number }) {
	const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
	const reduceMotion = useReducedMotion();
	/** Instant icon swap — avoids motion churn when theme state updates alongside `html.theme-transitioning`. */
	const iconTransition = reduceMotion ? { duration: 0.01 } : { duration: 0 };

	// Initialize theme state from document class
	useEffect(() => {
		const isDark = document.documentElement.classList.contains('dark');
		setTheme(isDark ? 'dark' : 'light');

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'class') {
					const isDarkNow = document.documentElement.classList.contains('dark');
					setTheme(isDarkNow ? 'dark' : 'light');
				}
			}
		});

		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		const root = document.documentElement;

		root.classList.add('theme-transitioning');
		clearTimeout(themeTransitionTimeout);
		themeTransitionTimeout = setTimeout(() => {
			root.classList.remove('theme-transitioning');
		}, THEME_TRANSITION_MS);

		setTheme(newTheme);

		if (newTheme === 'dark') {
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};

	// Don't render until mounted to avoid hydration mismatch, but keeping structure steady
	if (theme === null) {
		return (
			<div
				className={cn(
					'inline-flex shrink-0 items-center justify-center rounded-sm font-medium leading-[var(--text-nav-link--line-height)] text-nav-link text-foreground',
					className,
				)}
				aria-hidden
			>
				<span className="block size-[18px]" />
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			tabIndex={tabIndex}
			className={cn(
				'link-hover-motion inline-flex shrink-0 items-center justify-center rounded-sm font-medium leading-[var(--text-nav-link--line-height)] text-nav-link text-foreground no-underline hover:opacity-60 dark:hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40',
				className,
			)}
			aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
		>
			<span
				className="relative inline-flex size-[18px] shrink-0 items-center justify-center"
				data-theme-toggle-icon
				aria-hidden
			>
				<motion.span
					initial={false}
					animate={{
						scale: theme === 'dark' ? 0 : 1,
						opacity: theme === 'dark' ? 0 : 1,
						rotate: theme === 'dark' ? 90 : 0,
					}}
					transition={iconTransition}
					className="pointer-events-none absolute inset-0 flex items-center justify-center"
				>
					<Sun size={ICON_SIZE} strokeWidth={STROKE} />
				</motion.span>

				<motion.span
					initial={false}
					animate={{
						scale: theme === 'dark' ? 1 : 0,
						opacity: theme === 'dark' ? 1 : 0,
						rotate: theme === 'dark' ? 0 : -90,
					}}
					transition={iconTransition}
					className="pointer-events-none absolute inset-0 flex items-center justify-center"
				>
					<Moon size={ICON_SIZE} strokeWidth={STROKE} />
				</motion.span>
			</span>
		</button>
	);
}
