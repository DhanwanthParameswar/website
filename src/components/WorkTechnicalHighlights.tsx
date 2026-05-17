import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { WorkProject } from '@/types/work';
import { scrollRevealItemMotionProps } from '@/lib/scroll-reveal-variants';
import { HighlightCard } from './HighlightCard';

type Props = {
	project: WorkProject;
};

export function WorkTechnicalHighlights({ project }: Props) {
	const reduceMotion = useReducedMotion();
	const reveal = scrollRevealItemMotionProps(reduceMotion);

	if (!project.highlights || project.highlights.length === 0) return null;

	return (
		<section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:pb-32 md:pt-16">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{project.highlights.map((highlight, idx) => {
					// Add a subtle stagger delay based on the card's column index
					const cardReveal = {
						...reveal,
						transition: {
							...reveal.transition,
							delay: reduceMotion ? 0 : idx * 0.08
						}
					};

					return (
						<motion.div
							key={idx}
							className="relative w-full h-full"
							{...cardReveal}
						>
							<HighlightCard 
								title={highlight.title}
								description={highlight.description}
								icon={highlight.icon}
							/>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
