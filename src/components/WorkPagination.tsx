import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsDarkMode } from '@/lib/useIsDarkMode';

type ProjectNav = {
	title: string;
	slug: string;
	color1: string;
	color2: string;
};

type Props = {
	prevProject?: ProjectNav;
	nextProject?: ProjectNav;
};

export function WorkPagination({ prevProject, nextProject }: Props) {
	const isDark = useIsDarkMode();

	return (
		<section className="relative w-full border-t border-border-footer bg-surface-page px-6 py-24 md:py-32">
			<div className="mx-auto max-w-6xl">
				<div className={cn(
					"grid gap-8 md:gap-12",
					prevProject && nextProject ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
				)}>
					{/* Previous Project (Order + 1) - Older */}
					{prevProject && (
						<a 
							href={`/work/${prevProject.slug}`}
							data-cursor
							data-cursor-tooltip="View"
							className={cn(
								"group relative flex flex-col items-start gap-4 rounded-3xl border border-border-footer p-8 transition-all duration-500 md:p-12",
								"hover:border-transparent",
								prevProject && !nextProject && "md:col-start-1"
							)}
						>
							{/* Hover Gradient Background */}
							<div 
								className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl"
								style={{
									background: `linear-gradient(135deg, ${prevProject.color1}22, ${prevProject.color2}22)`
								}}
							/>
							
							<div 
								className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase"
								style={{ color: isDark ? '#666666' : '#474747' }}
							>
								<ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
								<span>Previous Project</span>
							</div>
							
							<h3 className="font-sans text-3xl font-normal tracking-tight text-foreground md:text-5xl">
								{prevProject.title}
							</h3>

							{/* Animated Underline */}
							<div className="mt-auto h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
						</a>
					)}

					{/* Next Project (Order - 1) - Newer */}
					{nextProject && (
						<a 
							href={`/work/${nextProject.slug}`}
							data-cursor
							data-cursor-tooltip="View"
							className={cn(
								"group relative flex flex-col items-end text-right gap-4 rounded-3xl border border-border-footer p-8 transition-all duration-500 md:p-12",
								"hover:border-transparent",
								nextProject && !prevProject && "md:col-start-1"
							)}
						>
							{/* Hover Gradient Background */}
							<div 
								className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl"
								style={{
									background: `linear-gradient(135deg, ${nextProject.color1}22, ${nextProject.color2}22)`
								}}
							/>

							<div 
								className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase"
								style={{ color: isDark ? '#666666' : '#474747' }}
							>
								<span>Next Project</span>
								<ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
							</div>
							
							<h3 className="font-sans text-3xl font-normal tracking-tight text-foreground md:text-5xl">
								{nextProject.title}
							</h3>

							{/* Animated Underline */}
							<div className="mt-auto h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
						</a>
					)}
				</div>
			</div>
		</section>
	);
}
