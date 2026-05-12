import { motion, useReducedMotion } from 'framer-motion';

import { WorkProjectCard } from '@/components/WorkProjectCard';
import { scrollRevealItemMotionProps } from '@/lib/scroll-reveal-variants';
import { WORK_PROJECTS } from '@/lib/work-projects';

export function WorkSection() {
	const reduceMotion = useReducedMotion();
	const reveal = scrollRevealItemMotionProps(reduceMotion);

	return (
		<section id="work" aria-labelledby="work-heading">
			<div className="mx-auto box-border grid w-full max-w-[1440px] grid-cols-1 gap-[25px] px-10 py-24 md:grid-cols-2 md:py-[150px] md:mx-auto md:w-[80%]">
				<motion.h2
					id="work-heading"
					className="col-span-full mb-[100px] w-full text-center font-sans font-normal text-[length:var(--text-work-section-title)] leading-[var(--text-work-section-title--line-height)] tracking-[-0.04em] text-foreground [text-rendering:optimizeLegibility]"
					{...reveal}
				>
					Work
				</motion.h2>
				{WORK_PROJECTS.map((project) => (
					<motion.div key={project.slug} className="min-w-0" {...reveal}>
						<WorkProjectCard project={project} />
					</motion.div>
				))}
			</div>
		</section>
	);
}
