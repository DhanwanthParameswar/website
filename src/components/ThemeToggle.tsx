import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { trackUmamiEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { menuToggleTransition } from '@/lib/motion-presets';

const ICON_SIZE = 18;
const STROKE = 2;
export function ThemeToggle({ className, tabIndex }: { className?: string; tabIndex?: number }) {
	const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
	const reduceMotion = useReducedMotion();
	/** 
	 * Transition for icon morphing. Uses the same preset as the hamburger menu (0.2s).
	 */
	const iconTransition = reduceMotion ? { duration: 0.01 } : menuToggleTransition;

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

	const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		trackUmamiEvent('Theme Toggle', { theme: newTheme });
		const root = document.documentElement;

		// Wait for any active smooth scrolling to complete to ensure no abruptions
		if ((window as any).lenis) {
			const lenis = (window as any).lenis;
			if (lenis.isScrolling) {
				await new Promise<void>((resolve) => {
					const checkScroll = () => {
						if (!lenis.isScrolling) {
							lenis.off('scroll', checkScroll);
							resolve();
						}
					};
					lenis.on('scroll', checkScroll);
				});
			}
		}

		// Fallback for browsers that don't support View Transitions or if user prefers reduced motion
		if (!(document as any).startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			root.classList.add('no-transitions');
			setTheme(newTheme);
			if (newTheme === 'dark') {
				root.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				root.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			}
			const _ = root.offsetHeight;
			root.classList.remove('no-transitions');
			return;
		}

		let x = e.clientX;
		let y = e.clientY;

		// If click coordinates are 0, 0 (e.g. keyboard triggers), use the center of the button
		if (x === 0 && y === 0) {
			const rect = e.currentTarget.getBoundingClientRect();
			x = rect.left + rect.width / 2;
			y = rect.top + rect.height / 2;
		}

		const endRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y)
		);

		root.style.setProperty('--theme-transition-x', `${x}px`);
		root.style.setProperty('--theme-transition-y', `${y}px`);
		root.style.setProperty('--theme-transition-radius', `${endRadius}px`);

		root.classList.add('theme-transition');

		const transition = (document as any).startViewTransition(() => {
			setTheme(newTheme);
			if (newTheme === 'dark') {
				root.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				root.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			}
		});

		transition.finished.then(() => {
			root.classList.remove('theme-transition');
		});
	};

	// Don't render until mounted to avoid hydration mismatch, but keeping structure steady
	if (theme === null) {
		return (
			<div
				className={cn(
					'type-nav inline-flex shrink-0 items-center justify-center rounded-sm text-foreground',
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
				'type-nav link-hover-motion inline-flex shrink-0 items-center justify-center rounded-sm text-foreground no-underline hover:opacity-60 dark:hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40',
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
