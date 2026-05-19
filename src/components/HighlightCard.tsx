import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/use-theme';
import React, { lazy, Suspense } from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports.mjs';

type HighlightCardProps = {
	title: string;
	description: string;
	icon: string;
	className?: string;
};

type DynamicIconProps = {
	name: string;
	className?: string;
	strokeWidth?: number;
};

function DynamicIcon({ name, className, strokeWidth = 1.5 }: DynamicIconProps) {
	const iconKey = (name in dynamicIconImports)
		? (name as keyof typeof dynamicIconImports)
		: 'zap';
	
	const LucideIcon = lazy(dynamicIconImports[iconKey]);

	return (
		<Suspense fallback={<div className="h-6 w-6 animate-pulse bg-white/5 rounded" />}>
			<LucideIcon className={className} strokeWidth={strokeWidth} />
		</Suspense>
	);
}

function HighlightCardInstance({ 
	title, 
	description, 
	icon, 
	theme, 
	className 
}: HighlightCardProps & { theme: 'light' | 'dark' }) {
	const reduceMotion = useReducedMotion();
	const isLight = theme === 'light';

	const springTransition = reduceMotion 
		? { type: 'spring', duration: 0.15, bounce: 0 } 
		: { type: 'spring', duration: 0.6, bounce: 0 };

	return (
		<motion.div 
			initial={false}
			whileHover="hover"
			transition={springTransition}
			data-cursor-static
			className={cn(
				"group relative flex flex-col gap-6 rounded-[18px] border-[0.5px] border-solid border-border-footer p-8 md:p-10 !cursor-none",
				isLight 
					? "bg-white shadow-black/[0.02] opacity-100 dark:opacity-0 pointer-events-auto dark:pointer-events-none" 
					: "bg-[#111] shadow-white/[0.02] opacity-0 dark:opacity-100 pointer-events-none dark:pointer-events-auto",
				className
			)}
		>
			{/* Card Border Animation */}
			<motion.div 
				className="absolute inset-0 rounded-[18px] border-[0.5px] border-transparent pointer-events-none"
				variants={{
					hover: { borderColor: isLight ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.3)" }
				}}
				transition={springTransition}
			/>

			{/* Icon Container */}
			<motion.div 
				className={cn(
					"flex h-12 w-12 items-center justify-center rounded-xl",
					isLight ? "bg-black/5 text-black" : "bg-white/5 text-white"
				)}
				variants={{
					hover: { 
						backgroundColor: isLight ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)",
						color: isLight ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)"
					}
				}}
				transition={springTransition}
			>
				<DynamicIcon name={icon} className="h-6 w-6" strokeWidth={1.5} />
			</motion.div>

			<div className="flex flex-col gap-3 text-left">
				<h3 className={cn('type-body-lg font-medium', isLight ? 'text-black' : 'text-white')}>
					{title}
				</h3>
				<p className={cn('type-body-sm', isLight ? 'text-black/60' : 'text-white/60')}>
					{description}
				</p>
			</div>
		</motion.div>
	);
}

export function HighlightCard(props: HighlightCardProps) {
	const theme = useTheme();
	const isSSR = theme === null;

	return (
		<div className={cn("relative w-full h-full", props.className)}>
			<HighlightCardInstance 
				{...props} 
				theme="light" 
				className="w-full h-full" 
			/>
			<HighlightCardInstance 
				{...props} 
				theme="dark" 
				className="absolute top-0 left-0 w-full h-full" 
			/>
		</div>
	);
}
