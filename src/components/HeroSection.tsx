import { motion, useReducedMotion } from 'framer-motion';
import { CircleChevronDown } from 'lucide-react';

import { Button } from '@/components/Button';
import { HeroBlobBackdrop } from '@/components/HeroBlobBackdrop';
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
		<section
			id="top"
			className={cn(
				'relative isolate z-[1] mx-auto box-border flex min-h-dvh w-full max-w-[1440px] flex-col overflow-visible',
				/* Pull into layout `pt` from BaseLayout, then mirror top/bottom inset so flex centering aligns with viewport midline (top-only pt shifts the cluster down by ~clearance/2). */
				'-mt-[var(--site-header-clearance)] py-[var(--site-header-clearance)]',
				'px-10',
			)}
			aria-labelledby="hero-heading"
		>
			<HeroBlobBackdrop />
			<div
				className={cn(
					'relative z-[2] flex w-full min-h-0 flex-1 flex-col items-center justify-center',
					'gap-2.5 px-[clamp(1rem,5vw,4.375rem)] py-[clamp(1.5rem,5.5vh,4.375rem)]',
				)}
			>
				<h1
					id="hero-heading"
					className={cn(
						'm-0 flex w-full flex-col items-center gap-2.5 font-normal text-foreground [text-rendering:optimizeLegibility]',
					)}
				>
					<motion.span
						className="block w-[70%] max-w-[53rem] text-center font-sans text-[length:var(--text-intro)] leading-[var(--text-intro--line-height)] will-change-[transform,filter]"
						{...blurReveal(0, reduceMotion, { blurPx: 8, y: 8 })}
					>
						Hey! I&apos;m
					</motion.span>
					<motion.span
						className={cn(
							'flex w-full max-w-[min(92vw,58rem)] justify-center will-change-[transform,filter]',
							'[&_img]:h-auto [&_img]:w-full [&_img]:max-h-[min(20vh,8.75rem)] [&_img]:object-contain md:[&_img]:max-h-[min(22vh,9.25rem)]',
						)}
						style={{ perspective: 1200 }}
						{...blurReveal(0.07, reduceMotion, { blurPx: 11, y: 10 })}
					>
						{/**
						 * Avoid a refresh flash: the theme class is applied by an inline script in `BaseLayout`
						 * before paint, but React islands can still SSR with a default theme.
						 * Render both assets and let CSS decide instantly.
						 */}
						<img
							src="/logo-light.svg"
							alt="Dhanwanth Parameswar"
							width={500}
							height={78}
							className="-rotate-[2deg] select-none dark:hidden md:-rotate-[2.5deg]"
							draggable={false}
							decoding="async"
						/>
						<img
							src="/logo-dark.svg"
							alt="Dhanwanth Parameswar"
							width={500}
							height={78}
							className="-rotate-[2deg] hidden select-none dark:block md:-rotate-[2.5deg]"
							draggable={false}
							decoding="async"
						/>
					</motion.span>
				</h1>

				<motion.p
					className="w-[80%] max-w-[61rem] text-center font-sans text-[length:var(--text-subtitle)] leading-[var(--text-subtitle--line-height)] font-normal text-foreground [text-rendering:optimizeLegibility]"
					{...blurReveal(0.18, reduceMotion, { blurPx: 8, y: 8 })}
				>
					A Computer Engineering student turning ideas into reality.
				</motion.p>

				<div className="h-6 shrink-0 md:h-7" aria-hidden />

				<motion.div
					className="flex flex-row flex-wrap items-center justify-center gap-3 md:gap-[15px]"
					{...blurReveal(0.32, reduceMotion, { blurPx: 7, y: 8 })}
				>
					<Button href="#work" variant="primary">
						View My Work
					</Button>
					<Button href="https://resume.dhanwanth.com" variant="secondary" target="_blank">
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
					'font-sans text-base leading-[1.2] font-normal will-change-[transform,filter]',
					'bottom-[calc(4.25rem+env(safe-area-inset-bottom,_0px))] md:bottom-[calc(5rem+env(safe-area-inset-bottom,_0px))]',
				)}
				{...scrollHintMotion(reduceMotion)}
				aria-hidden
			>
				<span className="text-center font-sans font-normal text-foreground/25">Scroll Down</span>
				<CircleChevronDown
					className="size-6 shrink-0 text-foreground/25"
					strokeWidth={1.5}
					aria-hidden
				/>
			</motion.div>
		</section>
	);
}
