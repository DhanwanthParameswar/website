import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const response = await fetch('https://stats.dhanwanth.com/magic.js');
		if (!response.ok) {
			return new Response('Not Found', { status: 404 });
		}
		const js = await response.text();
		return new Response(js, {
			headers: {
				'Content-Type': 'application/javascript; charset=utf-8',
				'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for a day on CDN and browser
			},
		});
	} catch (error) {
		console.error('Umami script proxy error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
