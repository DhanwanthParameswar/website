import { motion, useReducedMotion } from 'framer-motion';

import { ABOUT_GREETING, ABOUT_PARAGRAPHS, ABOUT_SIGNOFF_LINES } from '@/lib/about-copy';
import { scrollRevealItemMotionProps } from '@/lib/scroll-reveal-variants';

const proseClass =
	'm-0 typography-portfolio w-full max-w-[1086px] text-pretty text-body-md leading-[var(--text-body-md--line-height)] text-foreground md:w-[80%]';

export function AboutSection() {
	const reduceMotion = useReducedMotion();
	const reveal = scrollRevealItemMotionProps(reduceMotion);

	return (
		<section id="about" aria-labelledby="about-heading">
			<div className="mx-auto box-border flex w-full max-w-[1440px] flex-col items-center gap-[15px] overflow-hidden px-10 py-24 md:py-[150px]">
				<motion.h2
					id="about-heading"
					className="w-full max-w-[600px] text-center font-sans font-normal text-[length:var(--text-work-section-title)] leading-[var(--text-work-section-title--line-height)] tracking-[-0.04em] text-foreground [text-rendering:optimizeLegibility]"
					{...reveal}
				>
					About
				</motion.h2>

				<div className="h-[50px] w-full max-w-[1358px] shrink-0" aria-hidden />

				<motion.p className={proseClass} {...reveal}>
					{ABOUT_GREETING}
				</motion.p>

				{ABOUT_PARAGRAPHS.map((text, index) => (
					<motion.p key={`about-p-${index}`} className={proseClass} {...reveal}>
						{text}
					</motion.p>
				))}

				<motion.p className={proseClass} {...reveal}>
					{ABOUT_SIGNOFF_LINES[0]}
					<br />
					{ABOUT_SIGNOFF_LINES[1]}
				</motion.p>
			</div>
		</section>
	);
}
