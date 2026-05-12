import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import type { WorkProject } from '@/lib/work-projects';
import { workProjectImageSrcset } from '@/lib/work-projects';
import { workCardGlowHover, workCardGlowHoverReduced } from '@/lib/motion-presets';

const cardShell =
	'flex w-full min-w-0 flex-col items-start justify-center gap-2.5 text-inherit no-underline outline-none !cursor-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black';

type Props = {
	project: WorkProject;
};

export function WorkProjectCard({ project }: Props) {
	const reduceMotion = useReducedMotion();
	const [hovered, setHovered] = useState(false);
	const { src, srcSet, sizes } = workProjectImageSrcset(project.imageFile);
	const glowTransition = reduceMotion ? workCardGlowHoverReduced : workCardGlowHover;
	/** Stronger than the last pass, still capped so hover doesn’t blow out the card. */
	const glowOpacity = 0.62;

	const hoverHandlers = {
		onHoverStart: () => setHovered(true),
		onHoverEnd: () => setHovered(false),
	};

	/** Custom cursor: tooltip now; links / click handlers wired later per project. */
	const cursorChrome = {
		'data-cursor': '',
		'data-cursor-tooltip': 'View',
	} as const;

	const media = (
		<div className="relative isolate w-full">
			<motion.div
				className="pointer-events-none absolute inset-0 z-0 scale-[1.02] rounded-[20px] bg-cover bg-center blur-[56px] saturate-175 brightness-95"
				style={{ backgroundImage: `url('${src}')` }}
				aria-hidden
				animate={{ opacity: hovered ? glowOpacity : 0 }}
				transition={glowTransition}
			/>
			<div className="relative z-[1] aspect-[295/240] w-full overflow-hidden rounded-[20px] border border-solid border-border-footer bg-black">
				<img
					className="h-full w-full object-cover object-center"
					src={src}
					srcSet={srcSet}
					sizes={sizes}
					alt={project.title}
					width={1920}
					height={1440}
					loading="lazy"
					decoding="async"
				/>
			</div>
		</div>
	);

	const copy = (
		<div className="flex w-full flex-col items-start justify-center gap-0.5">
			<div className="flex w-full min-w-0 flex-row flex-wrap items-center gap-2.5">
				<p className="min-w-0 font-sans text-[length:var(--text-heading-md)] leading-[1.2] font-normal break-words text-foreground [text-rendering:optimizeLegibility]">
					{project.title}
				</p>
				{project.status ? (
					<span
						className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[13px] border border-solid border-[rgb(245_245_245/0.4)] bg-transparent px-[10px] py-[5px] font-sans text-[length:var(--text-work-status)] leading-[var(--text-work-status--line-height)] font-normal text-muted [text-rendering:optimizeLegibility]"
					>
						{project.status}
					</span>
				) : null}
			</div>
			<p className="w-full min-w-0 font-sans text-[length:var(--text-subtitle)] leading-[var(--text-subtitle--line-height)] font-normal break-words text-muted [text-rendering:optimizeLegibility]">
				{project.description}
			</p>
		</div>
	);

	if (project.href) {
		return (
			<motion.a
				href={project.href}
				className={cn(cardShell)}
				target={project.href.startsWith('http') ? '_blank' : undefined}
				rel={project.href.startsWith('http') ? 'noopener noreferrer' : undefined}
				{...cursorChrome}
				{...hoverHandlers}
			>
				{media}
				{copy}
			</motion.a>
		);
	}

	return (
		<motion.article
			className={cn(cardShell)}
			aria-label={`${project.title}: ${project.description}`}
			{...cursorChrome}
			{...hoverHandlers}
		>
			{media}
			{copy}
		</motion.article>
	);
}
