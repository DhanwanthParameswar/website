import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
	return (
		<section
			id="work-pagination"
			className="relative w-full overflow-hidden px-6 py-24 md:py-32 [background:linear-gradient(180deg,var(--surface-page)_0%,var(--surface-elevated)_100%)]"
		>
			<div className="mx-auto max-w-6xl">
				<div
					className={cn(
						'grid gap-8 md:gap-12',
						prevProject && nextProject ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1',
					)}
				>
					{prevProject && (
						<a
							href={`/work/${prevProject.slug}`}
							data-cursor
							data-cursor-tooltip="View"
							className={cn(
								'group relative flex flex-col items-start gap-4 rounded-3xl border border-border-footer p-8 transition-all duration-500 md:p-12',
								'hover:border-transparent',
								prevProject && !nextProject && 'md:col-start-1',
							)}
						>
							<div
								className="absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								style={{
									background: `linear-gradient(135deg, ${prevProject.color1}22, ${prevProject.color2}22)`,
								}}
							/>

							<div className="type-overline flex items-center gap-2 text-muted">
								<ArrowLeft
									size={16}
									className="transition-transform duration-300 group-hover:-translate-x-1"
								/>
								<span>Previous Project</span>
							</div>

							<h3 className="type-pagination-title text-foreground">{prevProject.title}</h3>

							<div className="mt-auto h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
						</a>
					)}

					{nextProject && (
						<a
							href={`/work/${nextProject.slug}`}
							data-cursor
							data-cursor-tooltip="View"
							className={cn(
								'group relative flex flex-col items-end gap-4 rounded-3xl border border-border-footer p-8 text-right transition-all duration-500 md:p-12',
								'hover:border-transparent',
								nextProject && !prevProject && 'md:col-start-1',
							)}
						>
							<div
								className="absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								style={{
									background: `linear-gradient(135deg, ${nextProject.color1}22, ${nextProject.color2}22)`,
								}}
							/>

							<div className="type-overline flex items-center gap-2 text-muted">
								<span>Next Project</span>
								<ArrowRight
									size={16}
									className="transition-transform duration-300 group-hover:translate-x-1"
								/>
							</div>

							<h3 className="type-pagination-title text-foreground">{nextProject.title}</h3>

							<div className="mt-auto h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
						</a>
					)}
				</div>
			</div>
		</section>
	);
}
