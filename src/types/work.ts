import type { ImageMetadata } from 'astro';

type ResponsiveImageMetadata = ImageMetadata & {
	srcSet?: string;
	sizes?: string;
};

export type WorkHighlight = {
	icon: string;
	title: string;
	description: string;
};

export type WorkProject = {
	slug: string;
	title: string;
	description: string;
	imageLight: ResponsiveImageMetadata;
	imageDark: ResponsiveImageMetadata;
	finalObjectLight?: ResponsiveImageMetadata;
	finalObjectDark?: ResponsiveImageMetadata;
	status?: string;
	href?: string;
	hrefLabel?: string;
	github?: string;
	appleStore?: string;
	playStore?: string;
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
