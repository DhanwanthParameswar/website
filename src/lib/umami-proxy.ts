/** Shared headers for first-party Umami collect/replay proxies. */
export function buildUmamiProxyHeaders(request: Request): Headers {
	const headers = new Headers();

	for (const name of ['content-type', 'user-agent', 'referer', 'accept-language'] as const) {
		const value = request.headers.get(name);
		if (value) headers.set(name, value);
	}

	const clientIP = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
	if (clientIP) headers.set('x-forwarded-for', clientIP);

	return headers;
}

export const UMAMI_CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
} as const;
