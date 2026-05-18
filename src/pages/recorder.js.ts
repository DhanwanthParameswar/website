import type { APIRoute } from 'astro';

export const prerender = false;

const UPSTREAM_RECORDER_URL = 'https://stats.dhanwanth.com/recorder.js';

export const GET: APIRoute = async () => {
	try {
		const response = await fetch(UPSTREAM_RECORDER_URL);
		if (!response.ok) {
			return new Response('Not Found', { status: 404 });
		}

		const js = await response.text();
		return new Response(js, {
			headers: {
				'Content-Type': 'application/javascript; charset=utf-8',
				'Cache-Control': 'public, max-age=86400, s-maxage=86400',
			},
		});
	} catch (error) {
		console.error('Umami recorder proxy error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
