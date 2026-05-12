import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import { menuToggleTransition } from '@/lib/motion-presets';

const ICON_SIZE = 22;
const STROKE = 2;

/**
 * Morph-like transition between hamburger and close using stacked Lucide icons
 * (crossfade + scale + rotate). Same timing as mobile drawer via {@link menuToggleTransition}.
 */
export function MenuMorphIcon({ open }: { open: boolean }) {
	const reduceMotion = useReducedMotion();
	const transition = reduceMotion ? { duration: 0.01 } : menuToggleTransition;

	return (
		<span
			className="relative inline-flex size-[22px] shrink-0 items-center justify-center"
			aria-hidden
		>
			<motion.span
				className="pointer-events-none absolute inset-0 flex items-center justify-center"
				initial={false}
				animate={{
					opacity: open ? 0 : 1,
					scale: open ? 0.65 : 1,
					rotate: open ? 90 : 0,
				}}
				transition={transition}
			>
				<Menu size={ICON_SIZE} strokeWidth={STROKE} />
			</motion.span>
			<motion.span
				className="pointer-events-none absolute inset-0 flex items-center justify-center"
				initial={false}
				animate={{
					opacity: open ? 1 : 0,
					scale: open ? 1 : 0.65,
					rotate: open ? 0 : -90,
				}}
				transition={transition}
			>
				<X size={ICON_SIZE} strokeWidth={STROKE} />
			</motion.span>
		</span>
	);
}
