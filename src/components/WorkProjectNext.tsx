import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { WorkProject } from '@/types/work';
import { scrollRevealItemMotionProps } from '@/lib/scroll-reveal-variants';
import { useIsDarkMode } from '@/lib/useIsDarkMode';

type Props = {
	nextProject: WorkProject;
};

export function WorkProjectNext({ nextProject }: Props) {
	const reduceMotion = useReducedMotion();
	const reveal = scrollRevealItemMotionProps(reduceMotion);
	const isDark = useIsDarkMode();

	if (!nextProject) return null;

	return (
		<section className="mx-auto box-border w-full max-w-[1440px] px-10 py-32 md:py-48">
			<div className="flex flex-col gap-20 lg:flex-row lg:items-center lg:justify-between">
				{/* Text Link */}
				<motion.div 
					className="flex flex-col gap-4 lg:w-[420px]"
					{...reveal}
				>
					<span className="type-overline text-muted/80">Next Project</span>
					<a 
						href={`/work/${nextProject.slug}`}
						className="group inline-flex flex-col gap-2 no-underline outline-none"
					>
						<h3 className="type-pagination-title text-foreground transition-opacity group-hover:opacity-70">
							{nextProject.title}
						</h3>
					</a>
				</motion.div>

				{/* Image Preview */}
				<motion.a
					href={`/work/${nextProject.slug}`}
					className="relative block aspect-[4/3] overflow-hidden rounded-xl border border-border/50 lg:w-[900px]"
					{...reveal}
					whileHover={{ scale: 0.98 }}
					transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				>
					<img 
						src={isDark ? nextProject.imageDark.src : nextProject.imageLight.src} 
						alt={nextProject.title}
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				</motion.a>
			</div>
		</section>
	);
}
