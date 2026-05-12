import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { framerSpringTime } from '@/lib/motion-presets';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
	variant?: ButtonVariant;
	href?: string;
	type?: 'button' | 'submit' | 'reset';
	className?: string;
	target?: string;
	rel?: string;
	disabled?: boolean;
	children: ReactNode;
}

const primaryHoverBg = 'rgba(255, 255, 255, 0.6)';
const secondaryHoverBg = 'rgba(255, 255, 255, 0.4)';

export function Button({
	variant = 'primary',
	href,
	type = 'button',
	className,
	target,
	rel: relProp,
	disabled = false,
	children,
}: ButtonProps) {
	const reduceMotion = useReducedMotion();
	const transition = reduceMotion
		? { type: 'tween' as const, duration: 0.15, ease: 'easeOut' as const }
		: framerSpringTime;

	const relDefault =
		href && /^https?:\/\//.test(href) ? 'noopener noreferrer' : undefined;
	const rel = relProp ?? relDefault;

	const base = cn(
		'inline-flex w-min shrink-0 items-center justify-center gap-[var(--cta-gap)] rounded-[var(--cta-radius)] border border-solid px-[var(--cta-padding-x)] py-[var(--cta-padding-y)] font-sans text-[length:var(--cta-label-size)] font-normal leading-[var(--cta-label-line-height)] whitespace-nowrap',
		'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
		variant === 'primary' &&
			'border-[color:var(--cta-primary-border)] bg-[color:var(--cta-primary-bg)] text-[color:var(--cta-primary-fg)] focus-visible:outline-[color:var(--cta-primary-fg)]/25',
		variant === 'secondary' &&
			'border-[color:var(--cta-secondary-border)] bg-[color:var(--cta-secondary-bg)] text-[color:var(--cta-secondary-fg)] focus-visible:outline-white/40',
		disabled && 'pointer-events-none opacity-50',
		className,
	);

	const hoverBg = variant === 'primary' ? primaryHoverBg : secondaryHoverBg;

	const motionProps = {
		className: base,
		initial: false,
		whileHover: disabled ? undefined : { backgroundColor: hoverBg },
		transition,
	};

	if (href) {
		return (
			<motion.a href={href} target={target} rel={rel} {...motionProps}>
				{children}
			</motion.a>
		);
	}

	return (
		<motion.button type={type} disabled={disabled} {...motionProps}>
			{children}
		</motion.button>
	);
}
