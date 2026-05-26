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
	'React Native': 'react',
	'Expo': 'expo',
	'Supabase': 'supabase',
	'PostgreSQL': 'postgresql',
	'TensorFlow.js': 'tensorflow',
	'TensorFlow': 'tensorflow',
	'Flask': 'flask',
	'Docker': 'docker',
	'MySQL': 'mysql',
	'Bootstrap': 'bootstrap',
	'WordPress': 'wordpress',
	'PHP': 'php',
	'Oracle Cloud': 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/oracle-cloud.svg',
	'Ubuntu': 'ubuntu',
	'HISE': 'https://gistcdn.githack.com/DhanwanthParameswar/6a7f493765fdad67d95cd44299162679/raw/c1948a913aed9b6efb5f199d9116f6ea7860227a/hise.svg',
	'C++': 'cplusplus',
	'Gemini API': 'googlegemini',
	'Firestore': 'firebase',
	'Auth0': 'auth0',
	'Workers': 'cloudflare',
	'JavaScript': 'javascript',
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
	'React Native': 'https://reactnative.dev',
	'Expo': 'https://expo.dev',
	'Supabase': 'https://supabase.com',
	'PostgreSQL': 'https://postgresql.org',
	'TensorFlow.js': 'https://tensorflow.org/js',
	'TensorFlow': 'https://tensorflow.org',
	'Flask': 'https://flask.palletsprojects.com',
	'Docker': 'https://docker.com',
	'MySQL': 'https://mysql.com',
	'Bootstrap': 'https://getbootstrap.com',
	'WordPress': 'https://wordpress.org',
	'PHP': 'https://php.net',
	'Oracle Cloud': 'https://oracle.com/cloud',
	'Ubuntu': 'https://ubuntu.com',
	'HISE': 'https://hise.audio',
	'HiseScript': 'https://hise.audio',
	'C++': 'https://isocpp.org',
	'Gemini API': 'https://ai.google.dev',
	'Firestore': 'https://firebase.google.com/docs/firestore',
	'Auth0': 'https://auth0.com',
	'Workers': 'https://workers.cloudflare.com',
	'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
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
		<section className="relative z-30 mx-auto w-full max-w-5xl px-6 pb-12 pt-8 max-sm:px-4 max-sm:pb-10 max-sm:pt-6 md:pb-16 md:pt-12">
			<div className="flex flex-col items-center text-center">
				{/* 1. Context Metadata - Top Labeling */}
				<motion.div
					className="mb-10 flex w-full flex-nowrap items-center justify-center max-sm:mb-6 max-sm:grid max-sm:grid-cols-3 max-sm:flex-wrap max-sm:gap-x-1 max-sm:gap-y-3"
					{...rowReveal(0)}
				>
					{metadata.map((item, idx) => (
						<div key={item.label} className="flex items-center max-sm:contents">
							<div className="flex flex-col items-center px-6 md:px-8 max-sm:px-1">
								<span className="type-overline-xs text-muted/30">
									{item.label}
								</span>
								<span className="type-work-brief-meta mt-1 text-foreground/80 max-sm:mt-0.5">
									{item.value}
								</span>
							</div>
							{idx < metadata.length - 1 && (
								<div className="hidden h-4 w-px bg-foreground/10 sm:block max-sm:hidden" />
							)}
						</div>
					))}
				</motion.div>

				{/* 2. Headline - The Heart of the Section */}
				<motion.h2
					className="type-work-brief-headline max-w-4xl text-foreground max-sm:max-w-[min(100%,24rem)]"
					{...rowReveal(1)}
				>
					{project.description}
				</motion.h2>

				{/* Tech Stack Chips (placed directly under the headline/tagline) */}
				{project.techStack && project.techStack.length > 0 && (
					<motion.div
						className="mt-6 flex flex-wrap justify-center gap-2 max-sm:mt-4 max-sm:gap-1.5"
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
									className="max-sm:gap-2 max-sm:px-3 max-sm:py-1"
								/>
							);
						})}
					</motion.div>
				)}

				{/* 3. Narrative Intro - Deep Dive */}
				<motion.p
					className="type-work-brief-body mt-8 max-w-3xl text-muted/70 max-sm:mt-5 max-sm:max-w-[min(100%,22rem)]"
					{...rowReveal(2)}
				>
					{project.details || "Developing innovative solutions with a focus on performance and user experience."}
				</motion.p>

				{/* 4. Technical Summary - The "Specs" Footer */}
				<motion.div
					className="mt-12 flex w-full flex-col items-center gap-8 max-sm:mt-8 max-sm:gap-6"
					{...rowReveal(3)}
				>
					{/* Divider Line */}
					<div className="h-px w-24 bg-foreground/10 max-sm:w-16" />

					{(project.href || project.github || project.appleStore || project.playStore || project.comingSoon) && (
						<div className="flex flex-row flex-nowrap items-center justify-center gap-3 max-sm:gap-2.5">
							{project.comingSoon && (
								<Button
									variant="secondary"
									disabled={true}
									className="group !cursor-none"
								>
									{project.status || "Coming Soon"}
								</Button>
							)}
							{project.href && (
								<Button
									variant="primary"
									href={project.href}
									target="_blank"
									className="group !cursor-none"
									data-umami-event="Project Live Demo"
									data-umami-event-project={project.title}
									data-umami-event-url={project.href}
								>
									{project.hrefLabel || "Launch Live Demo"}
									<ArrowUpRight strokeWidth={2.5} className="h-[15px] w-[15px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</Button>
							)}
							{project.github && (
								<Button
									variant="secondary"
									href={project.github}
									target="_blank"
									aria-label="View Source Code on GitHub"
									className="group !cursor-none flex h-[42px] w-[42px] items-center justify-center !rounded-full !p-0 max-sm:h-11 max-sm:w-11"
									data-umami-event="Project GitHub Repo"
									data-umami-event-project={project.title}
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
							{project.appleStore && (
								<Button
									variant="secondary"
									href={project.appleStore}
									target="_blank"
									aria-label="Download on the App Store"
									className="group !cursor-none flex h-[42px] w-[42px] items-center justify-center !rounded-full !p-0 max-sm:h-11 max-sm:w-11"
									data-umami-event="Project App Store"
									data-umami-event-project={project.title}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="h-[20px] w-[20px]"
										aria-hidden="true"
									>
										<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
									</svg>
								</Button>
							)}
							{project.playStore && (
								<Button
									variant="secondary"
									href={project.playStore}
									target="_blank"
									aria-label="Get it on Google Play"
									className="group !cursor-none flex h-[42px] w-[42px] items-center justify-center !rounded-full !p-0 max-sm:h-11 max-sm:w-11"
									data-umami-event="Project Play Store"
									data-umami-event-project={project.title}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="h-[20px] w-[20px]"
										aria-hidden="true"
									>
										<path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
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
