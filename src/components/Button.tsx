import type { MouseEventHandler, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/use-theme';


export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
	variant?: ButtonVariant;
	href?: string;
	type?: 'button' | 'submit' | 'reset';
	className?: string;
	target?: string;
	rel?: string;
	disabled?: boolean;
	/** When set (e.g. `-1`), removes the control from sequential tab order until needed. */
	tabIndex?: number;
	onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
	children: ReactNode;
}

/**
 * Internal component to handle the actual rendering of a single button instance.
 * We use separate instances for light and dark modes to avoid Framer Motion "fighting"
 * with CSS variable changes during theme transitions.
 */
function ButtonInstance({
	theme,
	...props
}: ButtonProps & { theme: 'light' | 'dark' }) {
	const {
		variant = 'primary',
		href,
		type = 'button',
		className,
		target,
		rel: relProp,
		disabled = false,
		tabIndex,
		onClick,
		children,
	} = props;

	const reduceMotion = useReducedMotion();
	/** Spring (duration-based): 0.8s physical transition. */
	const transition = reduceMotion
		? { type: 'spring' as const, duration: 0.15, bounce: 0 }
		: { type: 'spring' as const, duration: 0.8, bounce: 0 };

	const relDefault =
		href && /^https?:\/\//.test(href) ? 'noopener noreferrer' : undefined;
	const rel = relProp ?? relDefault;

	const base = cn(
		'inline-flex w-min shrink-0 items-center justify-center gap-[var(--cta-gap)] rounded-[var(--cta-radius)] px-[var(--cta-padding-x)] py-[var(--cta-padding-y)] font-sans text-[length:var(--cta-label-size)] font-normal leading-[var(--cta-label-line-height)] whitespace-nowrap',
		'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
		// Light Mode Styles
		theme === 'light' && [
			variant === 'primary' && 'border-0 bg-black text-[#fafafa] focus-visible:outline-black/25',
			variant === 'secondary' && 'border border-solid border-black bg-transparent text-black focus-visible:outline-black/40',
			'dark:hidden',
		],
		// Dark Mode Styles
		theme === 'dark' && [
			variant === 'primary' && 'border-0 bg-white text-black focus-visible:outline-white/25',
			variant === 'secondary' && 'border border-solid border-white bg-transparent text-white focus-visible:outline-white/40',
			'hidden dark:inline-flex',
		],
		disabled && 'pointer-events-none opacity-50',
		className,
	);

	/**
	 * Completely separate hover colors for each theme instance.
	 * Using hardcoded rgba instead of CSS variables ensures Framer Motion
	 * never sees a value change mid-transition when the theme toggles.
	 */
	const hoverColor = theme === 'light'
		? (variant === 'primary' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)')
		: (variant === 'primary' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)');

	const motionProps = {
		className: base,
		'data-site-cta': variant,
		'data-theme-instance': theme,
		initial: false,
		whileHover: disabled ? undefined : { backgroundColor: hoverColor },
		transition,
	};

	if (href) {
		return (
			<motion.a
				href={href}
				target={target}
				rel={rel}
				tabIndex={tabIndex}
				onClick={onClick}
				{...motionProps}
			>
				{children}
			</motion.a>
		);
	}

	return (
		<motion.button type={type} disabled={disabled} tabIndex={tabIndex} onClick={onClick} {...motionProps}>
			{children}
		</motion.button>
	);
}

export function Button(props: ButtonProps) {
	const theme = useTheme();
	const isSSR = theme === null;

	return (
		<>
			{(isSSR || theme === 'light') && <ButtonInstance {...props} theme="light" key="light-btn" />}
			{(isSSR || theme === 'dark') && <ButtonInstance {...props} theme="dark" key="dark-btn" />}
		</>
	);
}




