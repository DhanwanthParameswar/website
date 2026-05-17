import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type TechPillProps = {
	tech: string;
	url: string;
	iconSlug?: string | null;
	className?: string;
};

export function TechPill({ 
	tech, 
	url, 
	iconSlug, 
	className 
}: TechPillProps) {
	const reduceMotion = useReducedMotion();
	
	const springTransition = reduceMotion 
		? { type: 'spring', duration: 0.15, bounce: 0 } 
		: { type: 'spring', duration: 0.8, bounce: 0 };

	return (
		<motion.a 
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			initial={false}
			whileHover={{ 
				backgroundColor: "var(--color-foreground-hover, rgba(var(--foreground-rgb, 0,0,0), 0.08))" 
			}}
			transition={springTransition}
			data-cursor-tooltip="Go"
			className={cn(
				"flex items-center gap-2.5 rounded-full border border-foreground/[0.08] px-4 py-1.5 text-[0.75rem] font-medium no-underline transition-colors duration-200 !cursor-none",
				"bg-foreground/[0.03] text-foreground/60 hover:text-foreground hover:border-foreground/20",
				className
			)}
		>
			{iconSlug && (
				<div 
					className="h-3.5 w-3.5 bg-current opacity-70 transition-opacity"
					style={{
						maskImage: `url(https://cdn.simpleicons.org/${iconSlug})`,
						WebkitMaskImage: `url(https://cdn.simpleicons.org/${iconSlug})`,
						maskSize: 'contain',
						WebkitMaskSize: 'contain',
						maskRepeat: 'no-repeat',
						WebkitMaskRepeat: 'no-repeat',
					}}
				>
					<span className="sr-only">{tech} icon</span>
				</div>
			)}
			<span>{tech}</span>
		</motion.a>
	);
}
