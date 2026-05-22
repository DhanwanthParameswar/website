import { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion, useTransform, useSpring, useMotionValue } from 'framer-motion';

import { cn } from '@/lib/utils';
import type { WorkProject } from '@/types/work';
import { useIsDarkMode } from '@/lib/useIsDarkMode';
import { registerWorkCardThemeImages } from '@/lib/work-card-theme-preload';
import { workCardGlowHover, workCardGlowHoverReduced } from '@/lib/motion-presets';

const cardShell =
	'flex w-full min-w-0 flex-col items-start justify-center gap-2.5 text-inherit no-underline outline-none !cursor-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black';

type Props = {
	project: WorkProject;
};

export function WorkProjectCard({ project }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();
	const isDark = useIsDarkMode();
	const [hovered, setHovered] = useState(false);

	const glowOutTransition = { duration: 0.4, ease: 'easeInOut' };

	/** Mouse tilt logic - made more subtle */
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const mouseRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
		stiffness: 120,
		damping: 25,
	});
	const mouseRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
		stiffness: 120,
		damping: 25,
	});

	/** Shimmer/Glow shift - more subtle at 5% */
	const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], ['-5%', '5%']), {
		stiffness: 80,
		damping: 30,
	});
	const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], ['-5%', '5%']), {
		stiffness: 80,
		damping: 30,
	});

	const glowTransition = reduceMotion ? workCardGlowHoverReduced : workCardGlowHover;
	/** Stronger than the last pass, still capped so hover doesn’t blow out the card. */
	const glowOpacity = 0.62;

	const glowVariants = {
		idle: { opacity: 0, transition: glowOutTransition },
		hover: { opacity: glowOpacity, transition: glowTransition },
	} as const;

	const activeImage = isDark ? project.imageDark : project.imageLight;

	useEffect(() => {
		return registerWorkCardThemeImages({
			light: {
				src: project.imageLight.src,
				srcSet: project.imageLight.srcSet,
				sizes: project.imageLight.sizes,
			},
			dark: {
				src: project.imageDark.src,
				srcSet: project.imageDark.srcSet,
				sizes: project.imageDark.sizes,
			},
		});
	}, [
		project.slug,
		project.imageLight.src,
		project.imageLight.srcSet,
		project.imageLight.sizes,
		project.imageDark.src,
		project.imageDark.srcSet,
		project.imageDark.sizes,
	]);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (reduceMotion || !ref.current) return;
		const rect = ref.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		mouseX.set(x);
		mouseY.set(y);
	};

	const handleMouseLeave = () => {
		setHovered(false);
		mouseX.set(0);
		mouseY.set(0);
	};

	const hoverHandlers = {
		onHoverStart: () => setHovered(true),
		onHoverEnd: handleMouseLeave,
		onMouseLeave: handleMouseLeave,
		onMouseMove: handleMouseMove,
	};

	/** Custom cursor: tooltip now; links / click handlers wired later per project. */
	const cursorChrome = {
		'data-cursor': '',
		'data-cursor-tooltip': 'View',
	} as const;


	const media = (
		<motion.div
			className="relative isolate w-full [will-change:transform]"
			style={{
				rotateX: reduceMotion ? 0 : mouseRotateX,
				rotateY: reduceMotion ? 0 : mouseRotateY,
				transformPerspective: 1500,
			}}
		>
			<motion.div
				className="pointer-events-none absolute inset-0 z-0 scale-[1.02] rounded-[20px] bg-cover bg-center blur-[56px] saturate-175 brightness-95"
				variants={glowVariants}
				initial="idle"
				animate={hovered ? 'hover' : 'idle'}
				style={{
					/* Keep URL during opacity exit so the glow can fade out (not snap off). */
					backgroundImage: `url('${activeImage.src}')`,
					x: reduceMotion ? 0 : glowX,
					y: reduceMotion ? 0 : glowY,
				}}
				aria-hidden
			/>

			<div className="relative z-[1] aspect-[295/240] w-full overflow-hidden rounded-[20px] border border-solid border-border-footer bg-black">
				<motion.img
					className="absolute inset-0 h-full w-full object-cover object-center"
					src={activeImage.src}
					srcSet={activeImage.srcSet}
					sizes={activeImage.sizes}
					alt={project.title}
					width={activeImage.width}
					height={activeImage.height}
					loading="lazy"
					decoding="async"
					initial={false}
				/>
			</div>
		</motion.div>
	);


	const copy = (
		<div className="flex w-full flex-col items-start justify-center gap-0.5">
			<div className="flex w-full min-w-0 flex-row flex-wrap items-center gap-2.5">
				<p className="type-heading-md min-w-0 break-words text-foreground">
					{project.title}
				</p>
				{project.status ? (
					<span
						className="type-work-status inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[13px] border border-solid border-black/20 dark:border-[rgb(245_245_245/0.4)] bg-transparent px-[10px] py-[5px] text-muted"
					>
						{project.status}
					</span>
				) : null}
			</div>
			<p className="type-subtitle w-full min-w-0 break-words text-muted">
				{project.description}
			</p>
		</div>
	);

	const targetHref = `/work/${project.slug}`;

	return (
		<motion.a
			ref={ref}
			href={targetHref}
			className={cn(cardShell)}
			data-umami-event="Project Card Click"
			data-umami-event-project={project.title}
			data-umami-event-slug={project.slug}
			{...cursorChrome}
			{...hoverHandlers}
		>
			{media}
			{copy}
		</motion.a>
	);
}

