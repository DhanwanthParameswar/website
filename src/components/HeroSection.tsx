import { motion, useReducedMotion } from 'framer-motion';
import { CircleChevronDown } from 'lucide-react';

import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { heroBlurReveal, heroScrollHintReveal } from '@/lib/motion-presets';

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
			transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const, delay: delay * 0.35 },
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
			transition: { duration: 0.22, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const },
		};
	}
	return {
		initial: { opacity: 0, filter: 'blur(9px)', y: 8 },
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
				'relative isolate mx-auto box-border flex min-h-dvh w-full max-w-[1440px] flex-col overflow-visible',
				/* Pull into layout `pt` from BaseLayout, then mirror top/bottom inset so flex centering aligns with viewport midline (top-only pt shifts the cluster down by ~clearance/2). */
				'-mt-[var(--site-header-clearance)] py-[var(--site-header-clearance)]',
				'px-10',
			)}
			aria-label="Introduction"
		>
			<div
				className={cn(
					'relative z-[2] flex w-full min-h-0 flex-1 flex-col items-center justify-center',
					'gap-2.5 px-[clamp(1rem,5vw,4.375rem)] py-[clamp(1.5rem,5.5vh,4.375rem)]',
				)}
			>
				<motion.p
					className="w-[70%] max-w-[53rem] text-center font-sans text-[length:var(--text-intro)] leading-[var(--text-intro--line-height)] font-normal text-foreground [text-rendering:optimizeLegibility]"
					{...blurReveal(0.1, reduceMotion, { blurPx: 10, y: 10 })}
				>
					Hey! I&apos;m
				</motion.p>

				<motion.div
					className="flex w-full max-w-[min(92vw,58rem)] justify-center will-change-[transform,filter] [&_img]:h-auto [&_img]:w-full [&_img]:max-h-[min(20vh,8.75rem)] [&_img]:object-contain md:[&_img]:max-h-[min(22vh,9.25rem)]"
					style={{ perspective: 1200 }}
					{...blurReveal(0, reduceMotion, { blurPx: 14, y: 14 })}
				>
					<img
						src="/logo.svg"
						alt="Dhanwanth Parameswar"
						width={500}
						height={78}
						className="-rotate-[2deg] select-none md:-rotate-[2.5deg]"
						draggable={false}
					/>
				</motion.div>

				<motion.p
					className="w-[80%] max-w-[61rem] text-center font-sans text-[length:var(--text-subtitle)] leading-[var(--text-subtitle--line-height)] font-normal text-foreground [text-rendering:optimizeLegibility]"
					{...blurReveal(0.16, reduceMotion, { blurPx: 10, y: 10 })}
				>
					A Computer Engineering student turning ideas into reality.
				</motion.p>

				<div className="h-6 shrink-0 md:h-7" aria-hidden />

				<motion.div
					className="flex flex-row flex-wrap items-center justify-center gap-3 md:gap-[15px]"
					{...blurReveal(0.3, reduceMotion, { blurPx: 8, y: 10 })}
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
			>
				<span className="text-center font-sans font-normal text-white/25">Scroll Down</span>
				<CircleChevronDown
					className="size-6 shrink-0 text-white/25"
					strokeWidth={1.5}
					aria-hidden
				/>
			</motion.div>
		</section>
	);
}
