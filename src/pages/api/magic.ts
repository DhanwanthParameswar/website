import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const headers = new Headers();
		
		const headersToForward = [
			'content-type',
			'user-agent',
			'referer',
			'accept-language',
		];

		for (const header of headersToForward) {
			const val = request.headers.get(header);
			if (val) {
				headers.set(header, val);
			}
		}

		// Inject visitor's real IP address into X-Forwarded-For so Umami gets correct geolocations
		const clientIP = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
		if (clientIP) {
			headers.set('x-forwarded-for', clientIP);
		}

		// Read request body as arrayBuffer
		const body = await request.arrayBuffer();

		const response = await fetch('https://stats.dhanwanth.com/api/magic', {
			method: 'POST',
			headers,
			body,
		});

		const responseData = await response.text();

		return new Response(responseData, {
			status: response.status,
			headers: {
				'Content-Type': response.headers.get('content-type') || 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		});
	} catch (error) {
		console.error('Umami telemetry proxy error:', error);
		return new Response(JSON.stringify({ error: 'Proxy error' }), {
			status: 500,
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		});
	}
};

export const OPTIONS: APIRoute = () => {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, User-Agent',
			'Access-Control-Max-Age': '86400',
		},
	});
};
