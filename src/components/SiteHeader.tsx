import { useEffect, useState } from 'react';
import { FileDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button';
import { MenuMorphIcon } from '@/components/MenuMorphIcon';
import { cn } from '@/lib/utils';
import { menuToggleTransition } from '@/lib/motion-presets';

const HERO_REVEAL_ID = 'hero-header-reveal';

const NAV_LINKS = [
	{ href: '/#work', label: 'Work' },
	{ href: '/#about', label: 'About' },
	{ href: '/#contact', label: 'Contact' },
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
	'flex w-full flex-col gap-1 overflow-hidden rounded-[var(--header-radius)] border-[0.5px] border-solid border-border-footer bg-[color:var(--surface-header-bar)] p-4 [backdrop-filter:blur(var(--header-backdrop-blur))] [-webkit-backdrop-filter:blur(var(--header-backdrop-blur))] md:hidden',
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
	'rounded-sm hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40';

const navLink = cn(
	'font-medium text-nav-link leading-[var(--text-nav-link--line-height)] text-foreground no-underline',
	headerLinkChrome,
);

const menuToggle = cn(
	'link-hover-motion flex shrink-0 items-center justify-center rounded-sm p-2 text-foreground hover:opacity-80 md:hidden',
	'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40',
);

export function SiteHeader() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [headerRevealed, setHeaderRevealed] = useState(false);
	const reduceMotion = useReducedMotion();
	const panelTransition = reduceMotion ? { duration: 0.01 } : menuToggleTransition;

	useEffect(() => {
		const marker = document.getElementById(HERO_REVEAL_ID);
		if (!marker) {
			setHeaderRevealed(true);
			return;
		}

		const sync = () => {
			setHeaderRevealed(marker.getBoundingClientRect().top <= 0);
		};

		const observer = new IntersectionObserver(sync, {
			root: null,
			rootMargin: '0px',
			threshold: [0, 0.01, 0.5, 1],
		});
		observer.observe(marker);
		sync();

		const onResize = () => {
			sync();
		};
		window.addEventListener('resize', onResize, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', onResize);
		};
	}, []);

	useEffect(() => {
		if (!menuOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setMenuOpen(false);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [menuOpen]);

	useEffect(() => {
		if (!menuOpen) return;
		const prev = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		return () => {
			document.documentElement.style.overflow = prev;
		};
	}, [menuOpen]);

	const headerShown = headerRevealed || menuOpen;

	return (
		<nav
			className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-5"
			aria-label="Main"
			aria-hidden={!headerShown}
		>
			<AnimatePresence initial={false}>
				{menuOpen ? (
					<motion.button
						key="mobile-overlay"
						type="button"
						className="pointer-events-auto fixed inset-0 z-0 bg-black/35 md:hidden"
						aria-label="Close menu"
						initial="hidden"
						animate="shown"
						exit="hidden"
						variants={mobileOverlayVariants}
						transition={reduceMotion ? { duration: 0.01 } : panelTransition}
						onClick={() => setMenuOpen(false)}
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
								href="/#top"
								className={cn('flex min-w-0 shrink-0 items-center', headerLinkChrome)}
								onClick={() => setMenuOpen(false)}
							>
								<img
									src="/logo.svg"
									alt="Dhanwanth Parameswar"
									width={164}
									height={23}
									className="h-[22.7px] w-[min(164px,calc(75vw-8rem))] max-w-full object-contain object-left"
									decoding="async"
								/>
							</a>
						</div>

						<div className="hidden h-[43px] shrink-0 items-center justify-end gap-[var(--header-column-gap)] md:flex">
							{NAV_LINKS.map(({ href, label }) => (
								<a key={href} href={href} className={navLink}>
									{label}
								</a>
							))}

							<div className="flex h-[43px] items-center">
								<Button
									href="https://resume.dhanwanth.com"
									variant="primary"
									target="_blank"
									rel="noopener noreferrer"
									className="group h-[75%] min-h-0 py-0 leading-[var(--cta-label-line-height)]"
								>
									Resume
									<FileDown
										className="link-hover-motion shrink-0 opacity-100 group-hover:opacity-80"
										width={19}
										height={19}
										strokeWidth={1.5}
										aria-hidden
									/>
								</Button>
							</div>
						</div>

						<button
							type="button"
							className={menuToggle}
							aria-label={menuOpen ? 'Close menu' : 'Open menu'}
							aria-expanded={menuOpen}
							aria-controls={menuOpen ? MOBILE_NAV_ID : undefined}
							onClick={() => setMenuOpen((o) => !o)}
						>
							<MenuMorphIcon open={menuOpen} />
						</button>
					</div>
				</motion.div>

				<AnimatePresence initial={false}>
					{menuOpen ? (
						<motion.div
							key="mobile-nav"
							id={MOBILE_NAV_ID}
							role="menu"
							className={mobilePanel}
							initial="hidden"
							animate="shown"
							exit="hidden"
							variants={mobileMenuVariants}
							transition={reduceMotion ? { duration: 0.01 } : panelTransition}
							style={{ willChange: 'opacity, filter, transform' }}
						>
							{NAV_LINKS.map(({ href, label }) => (
								<a
									key={href}
									href={href}
									role="menuitem"
									className={cn(navLink, 'block py-3')}
									onClick={() => setMenuOpen(false)}
								>
									{label}
								</a>
							))}
							<div className="pt-2" onClick={() => setMenuOpen(false)}>
								<Button
									href="https://resume.dhanwanth.com"
									variant="primary"
									target="_blank"
									rel="noopener noreferrer"
									className="group h-auto min-h-0 w-full justify-center py-3 leading-[var(--cta-label-line-height)]"
								>
									Resume
									<FileDown
										className="link-hover-motion shrink-0 opacity-100 group-hover:opacity-80"
										width={19}
										height={19}
										strokeWidth={1.5}
										aria-hidden
									/>
								</Button>
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
		</nav>
	);
}
