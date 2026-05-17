import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { WorkProject } from '@/types/work';
import { scrollRevealItemMotionProps } from '@/lib/scroll-reveal-variants';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { useIsDarkMode } from '@/lib/useIsDarkMode';
import { TechPill } from './TechPill';

type Props = {
	project: WorkProject;
};

// Simple Icons Mapping
const TECH_ICON_MAP: Record<string, string> = {
	'Next.js': 'nextdotjs',
	'OpenAI': 'openai',
	'Tailwind CSS': 'tailwindcss',
	'Framer Motion': 'framer',
	'React': 'react',
	'WebRTC': 'webrtc',
	'Socket.io': 'socketdotio',
	'TypeScript': 'typescript',
	'Node.js': 'nodedotjs',
	'Astro': 'astro',
	'Vercel': 'vercel',
	'Three.js': 'threedotjs',
	'Python': 'python',
	'Whisper': 'openai',
};

// Tech URL Mapping
const TECH_URL_MAP: Record<string, string> = {
	'Next.js': 'https://nextjs.org',
	'OpenAI': 'https://openai.com',
	'Tailwind CSS': 'https://tailwindcss.com',
	'Framer Motion': 'https://framer.com/motion',
	'React': 'https://react.dev',
	'WebRTC': 'https://webrtc.org',
	'Socket.io': 'https://socket.io',
	'TypeScript': 'https://typescriptlang.org',
	'Node.js': 'https://nodejs.org',
	'Astro': 'https://astro.build',
	'Vercel': 'https://vercel.com',
	'Three.js': 'https://threejs.org',
	'Python': 'https://python.org',
	'Whisper': 'https://openai.com/research/whisper',
};

export function WorkProjectBrief({ project }: Props) {
	const reduceMotion = useReducedMotion();
	const isDark = useIsDarkMode();
	const reveal = scrollRevealItemMotionProps(reduceMotion);

	const metadata = [
		{ label: 'Year', value: project.year },
		{ label: 'Role', value: project.client },
		{ label: 'Category', value: project.category },
	].filter(item => item.value);

	const rowReveal = (idx: number) => ({
		...reveal,
		transition: {
			...reveal.transition,
			delay: reduceMotion ? 0 : idx * 0.08
		}
	});

	return (
		<section className="relative z-30 mx-auto w-full max-w-5xl px-6 pb-12 pt-8 md:pb-16 md:pt-12">
			<div className="flex flex-col items-center text-center">
				{/* 1. Context Metadata - Top Labeling */}
				<motion.div 
					className="mb-10 flex flex-wrap items-center justify-center gap-y-4"
					{...rowReveal(0)}
				>
					{metadata.map((item, idx) => (
						<div key={idx} className="flex items-center">
							<div className="flex flex-col items-center px-6 md:px-8">
								<span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-muted/30">
									{item.label}
								</span>
								<span className="mt-1 text-body-sm font-medium text-foreground/80">
									{item.value}
								</span>
							</div>
							{idx < metadata.length - 1 && (
								<div className="hidden sm:block h-4 w-px bg-foreground/10" />
							)}
						</div>
					))}
				</motion.div>

				{/* 2. Headline - The Heart of the Section */}
				<motion.h2 
					className="max-w-4xl text-display-lg font-normal tracking-[var(--tracking-display)] text-foreground md:text-[4.5rem] lg:text-[5.5rem] leading-[0.95]"
					{...rowReveal(1)}
				>
					{project.description}
				</motion.h2>

				{/* Tech Stack Chips (placed directly under the headline/tagline) */}
				{project.techStack && project.techStack.length > 0 && (
					<motion.div 
						className="mt-6 flex flex-wrap justify-center gap-2"
						{...rowReveal(1.5)}
					>
						{project.techStack.map((tech, idx) => {
							const iconSlug = TECH_ICON_MAP[tech];
							const url = TECH_URL_MAP[tech] || '#';

							return (
								<TechPill 
									key={idx}
									tech={tech}
									url={url}
									iconSlug={iconSlug}
								/>
							);
						})}
					</motion.div>
				)}

				{/* 3. Narrative Intro - Deep Dive */}
				<motion.p 
					className="mt-8 max-w-3xl text-body-md font-normal leading-[1.5] text-muted/70 md:text-[1.6rem] lg:text-[1.8rem] [text-wrap:balance]"
					{...rowReveal(2)}
				>
					{project.details || "Developing innovative solutions with a focus on performance and user experience."}
				</motion.p>

				{/* 4. Technical Summary - The "Specs" Footer */}
				<motion.div 
					className="mt-12 flex flex-col items-center gap-8 w-full"
					{...rowReveal(3)}
				>
					{/* Divider Line */}
					<div className="h-px w-24 bg-foreground/10" />

					{/* 5. Launch & GitHub CTAs */}
					{(project.href || project.github) && (
						<div className="flex flex-row flex-wrap items-center justify-center gap-3">
							{project.href && (
								<Button 
									variant="primary" 
									href={project.href} 
									target="_blank"
									className="group !cursor-none"
								>
									Launch Live Demo
									<ArrowUpRight strokeWidth={2.5} className="h-[15px] w-[15px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</Button>
							)}
							{project.github && (
								<Button 
									variant="secondary" 
									href={project.github} 
									target="_blank"
									aria-label="View Source Code on GitHub"
									className="group !cursor-none !rounded-full w-[42px] h-[42px] !p-0 flex items-center justify-center"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="h-[20px] w-[20px]"
										aria-hidden="true"
									>
										<path
											d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
										/>
									</svg>
								</Button>
							)}
						</div>
					)}
				</motion.div>
			</div>
		</section>
	);
}
