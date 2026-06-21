import { CONTACT_SOCIALS } from '@/lib/contact-info';

export const SITE_URL = 'https://dhanwanth.com';
export const SITE_NAME = 'Dhanwanth Parameswar';
export const SITE_LOCALE = 'en_US';
export const TWITTER_HANDLE = '@dhanwanthp';

/** Default OG image (1200×630). */
export const DEFAULT_OG_IMAGE = '/social-preview.webp';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const WIKIDATA_URL = 'https://www.wikidata.org/wiki/Q140305476';

export const PERSON_SAME_AS = [
	...CONTACT_SOCIALS.map((s) => s.href),
	WIKIDATA_URL,
];

/** Truncate to ~155 chars on a word boundary for meta descriptions. */
export function metaDescription(text: string, maxLength = 155): string {
	const trimmed = text.trim();
	if (trimmed.length <= maxLength) return trimmed;
	const slice = trimmed.slice(0, maxLength);
	const lastSpace = slice.lastIndexOf(' ');
	return (lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trimEnd() + '…';
}

export function absoluteUrl(path: string, site = SITE_URL): string {
	return new URL(path, site).href;
}

export function personJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: SITE_NAME,
		url: SITE_URL,
		jobTitle: 'Computer Engineering Student',
		alumniOf: {
			'@type': 'CollegeOrUniversity',
			name: 'University at Buffalo',
		},
		sameAs: PERSON_SAME_AS,
	};
}

export function websiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: SITE_URL,
		publisher: {
			'@type': 'Person',
			name: SITE_NAME,
			url: SITE_URL,
		},
	};
}

export type CreativeWorkInput = {
	title: string;
	description: string;
	details?: string;
	year?: string;
	category?: string;
	href?: string;
	slug: string;
};

export function creativeWorkJsonLd(project: CreativeWorkInput) {
	const description = metaDescription(project.details || project.description);
	const pageUrl = absoluteUrl(`/work/${project.slug}`);

	return {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.title,
		description,
		url: pageUrl,
		...(project.year ? { dateCreated: project.year } : {}),
		...(project.category ? { genre: project.category } : {}),
		...(project.href ? { mainEntityOfPage: project.href } : {}),
		author: {
			'@type': 'Person',
			name: SITE_NAME,
			url: SITE_URL,
		},
	};
}
