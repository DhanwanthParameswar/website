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
			data-umami-event="Tech Pill Click"
			data-umami-event-skill={tech}
			className={cn(
				'type-ui-xs flex items-center gap-2.5 rounded-full border border-foreground/[0.08] px-4 py-1.5 no-underline transition-colors duration-200 !cursor-none',
				"bg-foreground/[0.03] text-foreground/60 hover:text-foreground hover:border-foreground/20",
				"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30",
				className
			)}
		>
			{iconSlug && (
				tech === 'HISE' ? (
					<svg 
						viewBox="516 0 210 210" 
						className="h-3.5 w-3.5 fill-current shrink-0 opacity-70 transition-opacity" 
						aria-hidden="true"
					>
						<path 
							fill="currentColor"
							fillRule="evenodd" 
							fillOpacity="0.85" 
							d="M 621.507 17.511 C 669.587 17.511 708.621 56.546 708.621 104.625 C 708.621 152.705 669.587 191.739 621.507 191.739 C 573.427 191.739 534.393 152.705 534.393 104.625 C 534.393 56.546 573.427 17.511 621.507 17.511 Z M 646.891 87.624 C 643.47 84.603 639.081 83.406 634.515 83.406 C 626.582 83.406 619.114 87.909 619.114 96.522 C 619.114 109.989 638.055 105.995 638.055 113.413 C 638.055 116.267 634.801 117.636 631.889 117.636 C 628.92 117.636 625.955 116.209 624.131 113.813 L 617.802 120.771 C 621.623 124.305 626.183 125.844 631.375 125.844 C 639.708 125.844 646.948 121.569 646.948 112.557 C 646.948 98.405 628.349 103.141 628.349 95.78 C 628.349 92.756 631.832 91.614 634.344 91.614 C 636.514 91.614 639.366 92.47 640.791 94.296 L 646.891 87.624 Z M 560.638 124.817 L 569.531 124.817 L 569.531 107.36 L 586.824 107.36 L 586.824 124.817 L 595.717 124.817 L 595.717 84.433 L 586.824 84.433 L 586.824 99.494 L 569.531 99.494 L 569.531 84.433 L 560.638 84.433 L 560.638 124.817 Z M 603.825 124.817 L 612.718 124.817 L 612.718 84.433 L 603.825 84.433 L 603.825 124.817 Z M 653.915 124.817 L 682.376 124.817 L 682.376 116.609 L 662.808 116.609 L 662.808 108.33 L 680.322 108.33 L 680.322 100.122 L 662.808 100.122 L 662.808 92.641 L 681.349 92.641 L 681.349 84.433 L 653.915 84.433 L 653.915 124.817 Z" 
						/>
						<path 
							fill="currentColor"
							fillRule="evenodd" 
							fillOpacity="0.45" 
							d="M 621.507 0 C 679.251 0 726.132 46.881 726.132 104.625 C 726.132 162.369 679.251 209.25 621.507 209.25 C 563.763 209.25 516.882 162.369 516.882 104.625 C 516.882 46.881 563.763 0 621.507 0 Z M 621.507 7.324 C 675.209 7.324 718.808 50.923 718.808 104.625 C 718.808 158.327 675.209 201.927 621.507 201.927 C 567.805 201.927 524.206 158.327 524.206 104.625 C 524.206 50.923 567.805 7.324 621.507 7.324 Z" 
						/>
					</svg>
				) : (
					<div 
						className="h-3.5 w-3.5 bg-current opacity-70 transition-opacity"
						aria-hidden="true"
						style={{
							maskImage: `url(${iconSlug.startsWith('http') ? iconSlug : `https://cdn.simpleicons.org/${iconSlug}`})`,
							WebkitMaskImage: `url(${iconSlug.startsWith('http') ? iconSlug : `https://cdn.simpleicons.org/${iconSlug}`})`,
							maskSize: 'contain',
							WebkitMaskSize: 'contain',
							maskRepeat: 'no-repeat',
							WebkitMaskRepeat: 'no-repeat',
							maskPosition: 'center',
							WebkitMaskPosition: 'center',
						}}
					/>
				)
			)}
			<span>{tech}</span>
		</motion.a>
	);
}
