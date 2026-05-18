import type { APIRoute } from 'astro';

export const prerender = false;

/** Umami TRACKER_SCRIPT_NAME=magic is served at /magic (no .js suffix). */
const UPSTREAM_SCRIPT_URLS = [
	'https://stats.dhanwanth.com/magic',
	'https://stats.dhanwanth.com/magic.js',
	'https://stats.dhanwanth.com/script.js',
] as const;

export const GET: APIRoute = async () => {
	try {
		let js: string | null = null;

		for (const url of UPSTREAM_SCRIPT_URLS) {
			const response = await fetch(url);
			if (response.ok) {
				js = await response.text();
				break;
			}
		}

		if (!js) {
			return new Response('Not Found', { status: 404 });
		}

		return new Response(js, {
			headers: {
				'Content-Type': 'application/javascript; charset=utf-8',
				'Cache-Control': 'public, max-age=86400, s-maxage=86400',
			},
		});
	} catch (error) {
		console.error('Umami script proxy error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
