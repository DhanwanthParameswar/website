/**
 * Work grid — content and Framer CDN image bases (same assets as published site).
 * Optional `href` when a card should navigate somewhere; otherwise cards are static tiles.
 */
export type WorkProject = {
	slug: string;
	title: string;
	description: string;
	/** Framer asset path segment: `https://framerusercontent.com/images/{imageFile}.png` */
	imageFile: string;
	status?: string;
	href?: string;
};

const IMAGE_BASE = 'https://framerusercontent.com/images';

/** Responsive srcset matching Framer breakpoints (sizes simplified). */
export function workProjectImageSrcset(imageFile: string) {
	const base = `${IMAGE_BASE}/${imageFile}.png`;
	return {
		src: `${base}?width=1920&height=1440`,
		srcSet: [
			`${base}?scale-down-to=512&width=1920&height=1440 512w`,
			`${base}?scale-down-to=1024&width=1920&height=1440 1024w`,
			`${base}?width=1920&height=1440 1920w`,
		].join(', '),
		sizes:
			'(min-width: 1200px) max((min(100vw, 1440px) * 0.8 - 25px) / 2, 50px), (min-width: 810px) max((min(100vw, 1440px) * 0.8 - 25px) / 2, 50px), calc((min(100vw, 1440px) - 30px) * 0.8)',
	};
}

export const WORK_PROJECTS: WorkProject[] = [
	{
		slug: 'nest-canvas',
		title: 'NEST Canvas',
		description: 'VST Audio Plugin Development',
		status: 'Building',
		imageFile: 'u5uZzFw1h0dQO3cEJlLZtn895c',
	},
	{
		slug: 'whim',
		title: 'Whim',
		description: 'Event Discovery Mobile App',
		status: 'Building',
		imageFile: '62z3xVtRmnEihAFi8p6KNY4AdbE',
	},
	{
		slug: 'iris',
		title: 'Iris',
		description: 'AI Interview Coach',
		imageFile: '82TsbmwBt0arcb9gqnEyUZBTV6o',
	},
	{
		slug: 'ai-image-classifier',
		title: 'AI Image Classifier',
		description: 'In-Browser Machine Learning',
		imageFile: 'WZBi5S0WQ9jSPcjV8HWUrKOT7A',
	},
	{
		slug: 'droppua',
		title: 'Droppua',
		description: 'Real-Time Text & File Sharing',
		imageFile: 'eU0pncqENq36ecb1Cvm0iRpFT4',
	},
	{
		slug: 'library-management-system',
		title: 'Library Management System',
		description: 'Full-Stack Web Development',
		imageFile: 'uu3r6szaFaI8YZtyAVdCQNhvi6s',
	},
	{
		slug: 'gramny-website',
		title: 'GramNY Website',
		description: 'Non-Profit WordPress Development',
		imageFile: 'InqpzHgS5t6E5pAOLmIUeDkLkXs',
	},
];
