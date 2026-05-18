import type { APIRoute } from 'astro';

import { buildUmamiProxyHeaders, UMAMI_CORS_HEADERS } from '@/lib/umami-proxy';

export const prerender = false;

const UPSTREAM_RECORD_URL = 'https://stats.dhanwanth.com/api/record';

export const POST: APIRoute = async ({ request }) => {
	try {
		const response = await fetch(UPSTREAM_RECORD_URL, {
			method: 'POST',
			headers: buildUmamiProxyHeaders(request),
			body: await request.arrayBuffer(),
		});

		return new Response(await response.text(), {
			status: response.status,
			headers: {
				'Content-Type': response.headers.get('content-type') || 'application/json',
				...UMAMI_CORS_HEADERS,
			},
		});
	} catch (error) {
		console.error('Umami replay proxy error:', error);
		return new Response(JSON.stringify({ error: 'Proxy error' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...UMAMI_CORS_HEADERS,
			},
		});
	}
};

export const OPTIONS: APIRoute = () => {
	return new Response(null, {
		status: 204,
		headers: {
			...UMAMI_CORS_HEADERS,
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, User-Agent',
			'Access-Control-Max-Age': '86400',
		},
	});
};
