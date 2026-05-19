import { useEffect, useRef, useState } from 'react';
import { FileDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button';
import { MenuMorphIcon } from '@/components/MenuMorphIcon';
import { ThemeToggle } from '@/components/ThemeToggle';
import { trackUmamiEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { menuToggleTransition } from '@/lib/motion-presets';

const HERO_REVEAL_ID = 'hero-header-reveal';

const NAV_LINKS = [
	{ href: '/#work', label: 'Work', section: 'work' },
	{ href: '/#about', label: 'About', section: 'about' },
	{ href: '/#contact', label: 'Contact', section: 'contact' },
] as const;

const MOBILE_NAV_ID = 'site-header-mobile-nav';

const barShell =
	'pointer-events-auto relative z-10 flex w-[75%] max-w-full min-w-0 flex-col gap-2';

/** Pill bar: tint + backdrop on the same node that runs drawer-style motion (matches mobile panel). */
const barPillSurface = cn(
	'relative isolate box-border h-[var(--header-bar-height)] w-full min-w-0',
	'overflow-hidden rounded-[var(--header-radius)] border-[0.5px] border-solid border-border-footer',
	'px-[var(--header-padding-x)] py-[var(--header-padding-y)]',
	'bg-[color:var(--surface-header-bar)] [backdrop-filter:blur(var(--header-backdrop-blur))] [-webkit-backdrop-filter:blur(var(--header-backdrop-blur))]',
);

const mobilePanel = cn(
	'flex w-full flex-col gap-1 overflow-hidden rounded-[var(--header-radius)] border-[0.5px] border-solid border-border-footer bg-[color:var(--surface-header-bar)] p-4 [backdrop-filter:blur(var(--header-backdrop-blur))] [-webkit-backdrop-filter:blur(var(--header-backdrop-blur))] lg:hidden',
);

const mobileMenuVariants = {
	hidden: {
		opacity: 0,
		filter: 'blur(10px)',
		y: -8,
		scale: 0.99,
		transition: { duration: 0.2, ease: 'easeIn' },
	},
	shown: {
		opacity: 1,
		filter: 'blur(0px)',
		y: 0,
		scale: 1,
		transition: { duration: 0.2, ease: [0.44, 0, 0.56, 1] },
	},
} as const;

const mobileOverlayVariants = {
	hidden: {
		opacity: 0,
		transition: { duration: 0.2, ease: 'easeIn' },
	},
	shown: {
		opacity: 1,
		transition: { duration: 0.2, ease: [0.44, 0, 0.56, 1] },
	},
} as const;

const headerLinkChrome =
	'rounded-sm hover:opacity-60 dark:hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40';

const navLink = cn('type-nav text-foreground no-underline', headerLinkChrome);

const menuToggle = cn(
	'link-hover-motion flex shrink-0 items-center justify-center rounded-sm p-2 text-foreground hover:opacity-60 dark:hover:opacity-80 lg:hidden',
	'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40',
);

export function SiteHeader() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [headerRevealed, setHeaderRevealed] = useState(false);
	const reduceMotion = useReducedMotion();
	const panelTransition = reduceMotion ? { duration: 0.01 } : menuToggleTransition;
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const mobileNavFirstLinkRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		let observer: IntersectionObserver | null = null;

		const sync = () => {
			const marker = document.getElementById(HERO_REVEAL_ID);
			if (!marker) {
				setHeaderRevealed(true);
				if (observer) {
					observer.disconnect();
					observer = null;
				}
				return;
			}

			if (!observer) {
				observer = new IntersectionObserver(() => {
					sync();
				}, {
					root: null,
					rootMargin: '0px',
					threshold: [0, 0.01, 0.5, 1],
				});
				observer.observe(marker);
			}
			setHeaderRevealed(marker.getBoundingClientRect().top <= 0);
		};

		sync();

		const onResize = () => {
			sync();
		};
		window.addEventListener('resize', onResize, { passive: true });

		const handleBeforePreparation = (e: any) => {
			const toPath = e.to.pathname;
			const toHash = e.to.hash;

			if (toPath === '/' && toHash !== '#work' && toHash !== '#about' && toHash !== '#contact') {
				// Navigating to the top of the homepage -> start exit animation immediately!
				setHeaderRevealed(false);
			} else {
				// Navigating to a project page or a specific section -> ensure header stays or enters immediately
				setHeaderRevealed(true);
			}
		};
		document.addEventListener('astro:before-preparation', handleBeforePreparation);

		const handlePageLoad = () => {
			sync();
		};
		document.addEventListener('astro:page-load', handlePageLoad);

		return () => {
			if (observer) {
				observer.disconnect();
			}
			window.removeEventListener('resize', onResize);
			document.removeEventListener('astro:before-preparation', handleBeforePreparation);
			document.removeEventListener('astro:page-load', handlePageLoad);
		};
	}, []);

	useEffect(() => {
		if (!menuOpen) return;

		const focusableElements = document.querySelectorAll(
			`#${MOBILE_NAV_ID} a, #${MOBILE_NAV_ID} button`
		);
		const firstElement = focusableElements[0] as HTMLElement;
		const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setMenuOpen(false);
				queueMicrotask(() => menuButtonRef.current?.focus());
				return;
			}

			if (e.key === 'Tab') {
				if (e.shiftKey) {
					if (document.activeElement === firstElement || document.activeElement === menuButtonRef.current) {
						e.preventDefault();
						lastElement?.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement?.focus();
					}
				}
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [menuOpen]);

	useEffect(() => {
		if (!menuOpen) return;
		const prev = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		const id = requestAnimationFrame(() => {
			mobileNavFirstLinkRef.current?.focus();
		});
		return () => {
			cancelAnimationFrame(id);
			document.documentElement.style.overflow = prev;
		};
	}, [menuOpen]);

	const headerShown = headerRevealed || menuOpen;
	/** Bar is visually hidden before hero reveal — keep nav in the a11y tree but out of tab order until visible (or menu open). */
	const chromeTabHidden = !headerShown;

	const closeOverlayFocusMenuButton = () => {
		setMenuOpen(false);
		queueMicrotask(() => menuButtonRef.current?.focus());
	};

	return (
		<nav
			id="site-navigation"
			className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-5"
			aria-label="Main"
		>
			<AnimatePresence initial={false}>
				{menuOpen ? (
					<motion.button
						key="mobile-overlay"
						type="button"
						className="pointer-events-auto fixed inset-0 z-0 bg-black/35 lg:hidden"
						aria-label="Close menu"
						initial="hidden"
						animate="shown"
						exit="hidden"
						variants={mobileOverlayVariants}
						transition={reduceMotion ? { duration: 0.01 } : panelTransition}
						onClick={closeOverlayFocusMenuButton}
					/>
				) : null}
			</AnimatePresence>

			<div className={cn(barShell, !headerShown && 'pointer-events-none')}>
				<motion.div
					className={cn(barPillSurface, !headerShown && 'pointer-events-none')}
					initial={false}
					variants={mobileMenuVariants}
					animate={headerShown ? 'shown' : 'hidden'}
					transition={reduceMotion ? { duration: 0.01 } : panelTransition}
					style={{ willChange: 'opacity, filter, transform' }}
				>
					<div className="relative z-10 flex h-full w-full min-w-0 items-center gap-[var(--header-column-gap)]">
						<div className="flex min-w-0 flex-1 items-center gap-2.5">
							<a
								id="site-nav-first"
								href="/#top"
								tabIndex={chromeTabHidden ? -1 : undefined}
								className={cn('flex min-w-0 shrink-0 items-center', headerLinkChrome)}
								data-umami-event="Nav Home Click"
								onClick={() => setMenuOpen(false)}
							>
								<span className="relative block h-[22.7px] w-[min(164px,calc(75vw-8rem))] max-w-full">
									<img
										src="/logo-light.svg"
										alt="Dhanwanth Parameswar — Home"
										width={164}
										height={23}
										className="absolute inset-0 h-full w-full object-contain object-left opacity-100 dark:opacity-0"
										decoding="async"
									/>
									<img
										src="/logo-dark.svg"
										alt=""
										width={164}
										height={23}
										className="absolute inset-0 h-full w-full object-contain object-left opacity-0 dark:opacity-100"
										decoding="async"
										aria-hidden="true"
									/>
								</span>
							</a>
						</div>

						<div className="hidden h-[43px] shrink-0 items-center justify-end gap-[var(--header-column-gap)] lg:flex">
							{NAV_LINKS.map(({ href, label, section }) => (
								<a
									key={href}
									href={href}
									tabIndex={chromeTabHidden ? -1 : undefined}
									className={navLink}
									data-umami-event="Nav Click"
									data-umami-event-section={section}
									data-umami-event-device="desktop"
								>
									{label}
								</a>
							))}

							<ThemeToggle tabIndex={chromeTabHidden ? -1 : undefined} />

							<div className="flex h-[43px] items-center">
								<Button
									href="https://resume.dhanwanth.com"
									variant="primary"
									target="_blank"
									rel="noopener noreferrer"
									tabIndex={chromeTabHidden ? -1 : undefined}
									className="group h-[75%] min-h-0 py-0 leading-[var(--cta-label-line-height)]"
									data-umami-event="Resume View"
									data-umami-event-device="desktop"
								>
									Resume
									<FileDown
										className="link-hover-motion shrink-0 text-white opacity-100 dark:text-black"
										width={19}
										height={19}
										strokeWidth={1.5}
										aria-hidden
									/>
								</Button>
							</div>
						</div>

						<div className="flex shrink-0 items-center gap-2 lg:hidden">
							<ThemeToggle
								className="hidden min-[431px]:inline-flex"
								tabIndex={chromeTabHidden ? -1 : undefined}
							/>

							<button
								ref={menuButtonRef}
								type="button"
								className={menuToggle}
								tabIndex={chromeTabHidden ? -1 : undefined}
								aria-label={menuOpen ? 'Close menu' : 'Open menu'}
								aria-expanded={menuOpen}
								aria-controls={menuOpen ? MOBILE_NAV_ID : undefined}
								onClick={() => {
									setMenuOpen((o) => {
										if (!o) trackUmamiEvent('Mobile Menu Open');
										return !o;
									});
								}}
							>
								<MenuMorphIcon open={menuOpen} />
							</button>
						</div>
					</div>
				</motion.div>

				<AnimatePresence initial={false}>
					{menuOpen ? (
						<motion.div
							key="mobile-nav"
							id={MOBILE_NAV_ID}
							className={mobilePanel}
							initial="hidden"
							animate="shown"
							exit="hidden"
							variants={mobileMenuVariants}
							transition={reduceMotion ? { duration: 0.01 } : panelTransition}
							style={{ willChange: 'opacity, filter, transform' }}
						>
							<ul className="m-0 list-none p-0">
								{NAV_LINKS.map(({ href, label, section }, i) => (
									<li key={href}>
										<a
											ref={i === 0 ? mobileNavFirstLinkRef : undefined}
											href={href}
											className={cn(navLink, 'block py-3')}
											data-umami-event="Nav Click"
											data-umami-event-section={section}
											data-umami-event-device="mobile"
											onClick={() => setMenuOpen(false)}
										>
											{label}
										</a>
									</li>
								))}
								<li className="min-[431px]:hidden">
									<ThemeToggle
										tabIndex={chromeTabHidden ? -1 : undefined}
										className={cn(navLink, 'flex w-full justify-start py-3')}
									/>
								</li>
								<li className="pt-2">
									<Button
										href="https://resume.dhanwanth.com"
										variant="primary"
										target="_blank"
										rel="noopener noreferrer"
										className="group h-auto min-h-0 w-full justify-center py-3 leading-[var(--cta-label-line-height)]"
										onClick={() => setMenuOpen(false)}
										data-umami-event="Resume View"
										data-umami-event-device="mobile"
									>
										Resume
										<FileDown
											className="link-hover-motion shrink-0 text-white opacity-100 dark:text-black"
											width={19}
											height={19}
											strokeWidth={1.5}
											aria-hidden
										/>
									</Button>
								</li>
							</ul>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
		</nav>
	);
}
