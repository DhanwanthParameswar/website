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
	'aria-hidden'?: boolean;
	'aria-label'?: string;
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
		'aria-hidden': ariaHidden,
		'aria-label': ariaLabel,
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
			'opacity-100 dark:opacity-0 pointer-events-auto dark:pointer-events-none',
		],
		// Dark Mode Styles
		theme === 'dark' && [
			variant === 'primary' && 'border-0 bg-white text-black focus-visible:outline-white/25',
			variant === 'secondary' && 'border border-solid border-white bg-transparent text-white focus-visible:outline-white/40',
			'opacity-0 dark:opacity-100 pointer-events-none dark:pointer-events-auto',
		],
		className,
	);

	/**
	 * Completely separate hover colors for each theme instance.
	 * Using hardcoded rgba instead of CSS variables ensures Framer Motion
	 * never sees a value change mid-transition when the theme toggles.
	 */
	const hoverColor = theme === 'light'
		? (variant === 'primary' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.2)')
		: (variant === 'primary' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)');

	const motionProps = {
		className: base,
		'data-site-cta': variant,
		'data-theme-instance': theme,
		initial: false,
		whileHover: disabled ? undefined : { backgroundColor: hoverColor },
		transition,
		'aria-hidden': ariaHidden,
		'aria-label': ariaLabel,
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

export function Button({ className, disabled, ...props }: ButtonProps) {
	const theme = useTheme();
	const isSSR = theme === null;

	// Extract classes that affect external layout so the wrapper takes the correct shape
	const layoutClasses = className?.split(' ').filter(c => 
		c.startsWith('w-') || c.startsWith('max-w-') || c.startsWith('min-w-') ||
		c.startsWith('h-') || c.startsWith('max-h-') || c.startsWith('min-h-') ||
		c.startsWith('flex-') || c.startsWith('basis-') || c === 'shrink-0' || c === 'grow'
	).join(' ') || '';

	return (
		<div className={cn("relative inline-flex shrink-0", disabled && "pointer-events-none opacity-50", layoutClasses)}>
			<ButtonInstance 
				{...props} 
				disabled={disabled}
				theme="light" 
				className={cn(className, "w-full h-full")} 
				tabIndex={theme === 'dark' ? -1 : props.tabIndex}
				aria-hidden={theme === 'dark' ? true : undefined}
			/>
			<ButtonInstance 
				{...props} 
				disabled={disabled}
				theme="dark" 
				className={cn("absolute top-0 left-0", className, "w-full h-full")} 
				tabIndex={(isSSR || theme === 'light') ? -1 : props.tabIndex}
				aria-hidden={(isSSR || theme === 'light') ? true : undefined}
			/>
		</div>
	);
}
