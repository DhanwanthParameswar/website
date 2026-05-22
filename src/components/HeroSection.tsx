import { motion, useReducedMotion } from 'framer-motion';
import { CircleChevronDown } from 'lucide-react';

import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import {
	heroBlurReveal,
	heroBlurRevealReduced,
	heroScrollHintReveal,
	heroScrollHintRevealReduced,
} from '@/lib/motion-presets';

type BlurRevealOpts = {
	/** Max blur in px at rest (before reveal). */
	blurPx?: number;
	/** Vertical offset in px (positive = starts lower). */
	y?: number;
};

function blurReveal(delay: number, reduceMotion: boolean | null, opts: BlurRevealOpts = {}) {
	const { blurPx = 11, y = 12 } = opts;

	if (reduceMotion) {
		return {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			transition: { ...heroBlurRevealReduced, delay: delay * 0.42 },
		};
	}

	return {
		initial: {
			opacity: 0,
			filter: `blur(${blurPx}px)`,
			y,
		},
		animate: {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
		},
		transition: { ...heroBlurReveal, delay },
	};
}

/** Blur-reveal delays (s) — logo leads as the focal point, then supporting copy. */
const HERO_REVEAL_DELAY = {
	logo: 0,
	intro: 0.07,
	subtitle: 0.18,
	cta: 0.32,
} as const;

function scrollHintMotion(reduceMotion: boolean | null) {
	if (reduceMotion) {
		return {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			transition: heroScrollHintRevealReduced,
		};
	}
	return {
		initial: { opacity: 0, filter: 'blur(6px)', y: 6 },
		animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
		transition: heroScrollHintReveal,
	};
}

export function HeroSection() {
	const reduceMotion = useReducedMotion();

	return (
		<>
			<div
				className={cn(
					'relative z-[2] flex w-full min-h-0 flex-1 flex-col items-center justify-center',
					'gap-2.5 px-[clamp(1rem,5vw,4.375rem)] py-[clamp(1.5rem,5.5vh,4.375rem)]',
					'max-sm:gap-3 max-sm:px-4 max-sm:py-[clamp(1rem,4vh,2.5rem)]',
				)}
			>
				<h1
					id="hero-heading"
					className="m-0 flex w-full flex-col items-center gap-2.5 text-foreground max-sm:max-w-[20rem] max-sm:gap-3"
				>
					<motion.span
						className="type-intro block w-[70%] max-w-[53rem] text-center text-foreground will-change-[transform,filter] max-sm:w-full max-sm:max-w-none max-sm:tracking-normal"
						{...blurReveal(HERO_REVEAL_DELAY.intro, reduceMotion, { blurPx: 8, y: 8 })}
					>
						Hey! I&apos;m
					</motion.span>
					<motion.span
						className={cn(
							'relative flex w-full max-w-[min(92vw,58rem)] justify-center will-change-[transform,filter]',
							'[&_img]:h-auto [&_img]:w-full [&_img]:max-h-[min(20vh,8.75rem)] [&_img]:object-contain md:[&_img]:max-h-[min(22vh,9.25rem)]',
							'max-sm:max-w-[min(100%,17.5rem)] max-sm:[&_img]:max-h-[min(9.5rem,46vw)]',
						)}
						style={{ perspective: 1200 }}
						{...blurReveal(HERO_REVEAL_DELAY.logo, reduceMotion, { blurPx: 11, y: 10 })}
					>
						{/* Crawlable name in DOM; logo remains the visual treatment on top */}
						<span className="type-intro pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center text-transparent select-none">
							Dhanwanth Parameswar
						</span>
						<span className="relative z-20 flex w-full justify-center">
							{/**
							 * Avoid a refresh flash: the theme class is applied by an inline script in `BaseLayout`
							 * before paint, but React islands can still SSR with a default theme.
							 * Render both assets and let CSS decide instantly.
							 */}
							<img
								src="/logo-light.svg"
								alt=""
								width={500}
								height={78}
								fetchPriority="high"
								className="-rotate-[2deg] select-none dark:hidden md:-rotate-[2.5deg]"
								draggable={false}
								decoding="async"
								aria-hidden
							/>
							<img
								src="/logo-dark.svg"
								alt=""
								width={500}
								height={78}
								fetchPriority="high"
								className="-rotate-[2deg] hidden select-none dark:block md:-rotate-[2.5deg]"
								draggable={false}
								decoding="async"
								aria-hidden
							/>
						</span>
					</motion.span>
				</h1>

				<motion.p
					className="type-subtitle w-[80%] max-w-[61rem] text-center text-foreground max-sm:w-full max-sm:max-w-[18.5rem]"
					{...blurReveal(HERO_REVEAL_DELAY.subtitle, reduceMotion, { blurPx: 8, y: 8 })}
				>
					A Computer Engineering student turning ideas into reality.
				</motion.p>

				<div className="h-6 shrink-0 max-sm:h-4 md:h-7" aria-hidden />

				<motion.div
					className={cn(
						'flex flex-row flex-nowrap items-center justify-center gap-3 md:gap-[15px]',
						'max-sm:w-full max-sm:max-w-[18.5rem] max-sm:flex-col max-sm:items-stretch max-sm:gap-2.5',
					)}
					{...blurReveal(HERO_REVEAL_DELAY.cta, reduceMotion, { blurPx: 7, y: 8 })}
				>
					<Button href="#work" variant="primary" className="max-sm:w-full">
						View My Work
					</Button>
					<Button
						href="https://resume.dhanwanth.com"
						variant="secondary"
						target="_blank"
						className="max-sm:w-full"
					>
						Download Resume
					</Button>
				</motion.div>
				{/* Scroll line for SiteHeader: show bar once this edge passes above the viewport */}
				<div
					id="hero-header-reveal"
					aria-hidden
					className="pointer-events-none h-px w-full shrink-0 overflow-hidden opacity-0"
				/>
			</div>

			<motion.div
				className={cn(
					'pointer-events-none absolute inset-x-0 z-[2] flex flex-row items-center justify-center gap-2.5',
					'type-ui-sm will-change-[transform,filter]',
					'bottom-[calc(4.25rem+env(safe-area-inset-bottom,_0px))] max-sm:bottom-[calc(3.5rem+env(safe-area-inset-bottom,_0px))] md:bottom-[calc(5rem+env(safe-area-inset-bottom,_0px))]',
				)}
				{...scrollHintMotion(reduceMotion)}
				aria-hidden
			>
				<span className="text-center text-foreground opacity-25">Scroll Down</span>
				<CircleChevronDown
					className="size-6 shrink-0 text-foreground opacity-25 max-sm:size-5"
					strokeWidth={1.5}
					aria-hidden
				/>
			</motion.div>
		</>
	);
}
