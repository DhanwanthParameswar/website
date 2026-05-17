import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const SPRING = { type: 'spring', stiffness: 500, damping: 60, mass: 1 } as const;

function isInteractive(el: Element | null) {
	if (!el || el.closest('[data-cursor-static]')) return false;
	// Do not treat code blocks or scrollable pre elements with tabindex as interactive for custom cursor
	if (el.closest('pre') || el.closest('code')) return false;
	return Boolean(
		el.closest(
			[
				'a[href]',
				'button',
				'input',
				'textarea',
				'select',
				'[role="button"]',
				'[role="link"]',
				'[tabindex]:not([tabindex="-1"])',
				'[data-cursor]',
			].join(','),
		),
	);
}

function getTooltip(el: Element | null): string | null {
	if (!el) return null;
	const node = el.closest('[data-cursor-tooltip]');
	if (!node) return null;
	const value = node.getAttribute('data-cursor-tooltip');
	return value && value.trim().length ? value : null;
}

export function CustomCursor() {
	const reduceMotion = useReducedMotion();
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const [visible, setVisible] = useState(false);
	const [pressed, setPressed] = useState(false);
	const [hoveringInteractive, setHoveringInteractive] = useState(false);
	const [tooltip, setTooltip] = useState<string | null>(null);

	const [isStatic, setIsStatic] = useState(false);

	const isBig = useMemo(() => !isStatic && (Boolean(tooltip) || hoveringInteractive), [hoveringInteractive, tooltip, isStatic]);
	const baseSize = isBig ? 29 : 20;
	const pressedSize = isBig ? 24 : 16;

	useEffect(() => {
		if (reduceMotion) return;

		const applyCustomCursor = () => {
			document.documentElement.classList.add('has-custom-cursor');
		};

		applyCustomCursor();

		document.addEventListener('astro:after-swap', applyCustomCursor);

		return () => {
			document.documentElement.classList.remove('has-custom-cursor');
			document.removeEventListener('astro:after-swap', applyCustomCursor);
		};
	}, [reduceMotion]);

	useEffect(() => {
		if (reduceMotion) return;

		const onPointerMove = (e: PointerEvent) => {
			if (e.pointerType !== 'mouse') return;
			if (!visible) setVisible(true);
			x.set(e.clientX);
			y.set(e.clientY);
		};

		const onPointerDown = (e: PointerEvent) => {
			if (e.pointerType !== 'mouse') return;
			setPressed(true);
		};

		const onPointerUp = (e: PointerEvent) => {
			if (e.pointerType !== 'mouse') return;
			setPressed(false);
			setHoveringInteractive(isInteractive(e.target as Element));
		};

		const onMouseOver = (e: MouseEvent) => {
			const target = e.target as Element | null;
			const interactive = isInteractive(target);
			setHoveringInteractive(interactive);
			setTooltip(getTooltip(target));
			setIsStatic(Boolean(target?.closest('[data-cursor-static]')));
		};

		const onMouseOut = (e: MouseEvent) => {
			const related = e.relatedTarget as Element | null;
			setHoveringInteractive(isInteractive(related));
			setTooltip(getTooltip(related));
			setIsStatic(Boolean(related?.closest('[data-cursor-static]')));
		};

		const onMouseLeaveWindow = () => setVisible(false);

		window.addEventListener('pointermove', onPointerMove, { passive: true });
		window.addEventListener('pointerdown', onPointerDown, { passive: true });
		window.addEventListener('pointerup', onPointerUp, { passive: true });
		document.addEventListener('mouseover', onMouseOver, { passive: true });
		document.addEventListener('mouseout', onMouseOut, { passive: true });
		window.addEventListener('blur', onMouseLeaveWindow);

		return () => {
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('pointerup', onPointerUp);
			document.removeEventListener('mouseover', onMouseOver);
			document.removeEventListener('mouseout', onMouseOut);
			window.removeEventListener('blur', onMouseLeaveWindow);
		};
	}, [reduceMotion, visible, x, y]);

	const targetSize = pressed ? pressedSize : baseSize;

	return (
		<div className="pointer-events-none fixed inset-0 z-[9999] hidden [@media(pointer:fine)]:block mix-blend-difference">
			<motion.div
				aria-hidden
				className="pointer-events-none fixed left-0 top-0 rounded-full"
				style={{
					x,
					y,
					backgroundColor: '#ffffff',
					mixBlendMode: 'difference',
					backfaceVisibility: 'hidden',
					WebkitBackfaceVisibility: 'hidden',
				}}
				transformTemplate={({ x, y }) =>
					`translate3d(${x}, ${y}, 0) translate3d(-50%, -50%, 0)`
				}
				animate={{
					width: visible ? targetSize : 0,
					height: visible ? targetSize : 0,
					opacity: visible ? 1 : 0,
				}}
				transition={reduceMotion ? { duration: 0.01 } : SPRING}
			>
				<AnimatePresence>
					{tooltip ? (
						<motion.div
							key="tooltip"
							className="absolute left-[35px] top-1/2 flex min-h-[29px] -translate-y-1/2 items-center justify-center rounded-[19px] bg-white/20 px-3 py-[5px] text-center text-[0.9rem] font-medium leading-[1] tracking-[-0.01em] text-white mix-blend-normal backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)] shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
							style={{ mixBlendMode: 'normal', textShadow: '0 1px 10px rgba(0,0,0,0.35)' }}
							initial={{ opacity: 0, filter: 'blur(8px)', x: -4 }}
							animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
							exit={{ opacity: 0, filter: 'blur(8px)', x: -4 }}
							transition={reduceMotion ? { duration: 0.01 } : SPRING}
						>
							{tooltip}
						</motion.div>
					) : null}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}

