import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/work" }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		imageLight: image(),
		imageDark: image(),
		finalObjectLight: image().optional(),
		finalObjectDark: image().optional(),
		status: z.string().optional(),
		href: z.string().optional(),
		hrefLabel: z.string().optional(),
		github: z.string().optional(),
		comingSoon: z.boolean().optional(),
		client: z.string().optional(),
		year: z.string().optional(),
		category: z.string().optional(),
		color1: z.string().default("#FF5373"),
		color2: z.string().default("#FFC858"),
		order: z.number().default(0), // For controlling grid order
		techStack: z.array(z.string()).optional(),
		highlights: z.array(z.object({
			icon: z.string(),
			title: z.string(),
			description: z.string(),
		})).optional(),
		details: z.string().optional(),
	}),
});

export const collections = { work };
