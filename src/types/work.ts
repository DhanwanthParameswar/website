import type { ImageMetadata } from 'astro';

export type WorkHighlight = {
	icon: string;
	title: string;
	description: string;
};

export type WorkProject = {
	slug: string;
	title: string;
	description: string;
	imageLight: ImageMetadata;
	imageDark: ImageMetadata;
	finalObjectLight?: ImageMetadata;
	finalObjectDark?: ImageMetadata;
	status?: string;
	href?: string;
	hrefLabel?: string;
	github?: string;
	comingSoon?: boolean;
	client?: string;
	year?: string;
	category?: string;
	color1?: string;
	color2?: string;
	details?: string;
	images?: ImageMetadata[];
	techStack?: string[];
	highlights?: WorkHighlight[];
};
