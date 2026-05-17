import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { WorkProject } from '@/types/work';
import { scrollRevealItemMotionProps } from '@/lib/scroll-reveal-variants';

type Props = {
	project: WorkProject;
};

export function WorkProjectDetails({ project }: Props) {
	const reduceMotion = useReducedMotion();
	const reveal = scrollRevealItemMotionProps(reduceMotion);

	return (
		<section className="mx-auto box-border flex w-full max-w-[1440px] flex-col gap-10 px-10 py-20 lg:flex-row lg:justify-between">
			{/* Left Content: Informations Panel */}
			<motion.div 
				className="flex flex-col gap-12 lg:w-[420px]"
				{...reveal}
			>
				{/* Long Description */}
				<p className="font-sans text-[length:var(--text-subtitle)] leading-relaxed text-foreground/90">
					{project.details || project.description}
				</p>

				{/* Info Grid */}
				<div className="flex flex-col gap-8">
					{project.client && (
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-normal text-muted/60 uppercase tracking-wider">Client</span>
							<span className="font-sans text-lg font-normal text-foreground">{project.client}</span>
						</div>
					)}
					{project.year && (
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-normal text-muted/60 uppercase tracking-wider">Year</span>
							<span className="font-sans text-lg font-normal text-foreground">{project.year}</span>
						</div>
					)}
					{project.category && (
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-normal text-muted/60 uppercase tracking-wider">Category</span>
							<span className="font-sans text-lg font-normal text-foreground">{project.category}</span>
						</div>
					)}
				</div>
			</motion.div>

			{/* Right Content: Images (Placeholder for now as per "dont add more than i ask") */}
			<div className="flex flex-col gap-6 lg:w-[900px]">
				{project.images?.map((img, idx) => (
					<motion.div 
						key={idx} 
						className="overflow-hidden rounded-lg border border-border/50"
						{...reveal}
					>
						<img 
							src={img.src} 
							alt={`${project.title} detail ${idx + 1}`} 
							className="w-full object-cover"
						/>
					</motion.div>
				))}
			</div>
		</section>
	);
}
