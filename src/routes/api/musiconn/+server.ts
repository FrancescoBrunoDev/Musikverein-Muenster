import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Server-side proxy to the musiconn GraphQL API.
 *
 * The new endpoint (edit.performance.musiconn.de/musiconn/api) does not return
 * `Access-Control-Allow-Headers` on the CORS preflight response, so browsers
 * block client-side `Content-Type: application/json` POSTs directly to it
 * (the old host had proper CORS). Routing client-side lookups (titles, counts,
 * autocomplete) through this relative endpoint avoids the cross-origin request
 * entirely — the browser talks same-origin to SvelteKit, which forwards the
 * POST server-side where CORS does not apply.
 */
const MUSICONN_API_URL = 'https://edit.performance.musiconn.de/musiconn/api';

export const POST: RequestHandler = async ({ request }) => {
	let body: { query?: string; variables?: Record<string, unknown> };
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	if (!body.query) {
		throw error(400, 'Missing GraphQL query');
	}

	try {
		const res = await fetch(MUSICONN_API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: body.query, variables: body.variables })
		});

		// Forward the GraphQL payload status, but normalize errors so they don't
		// get swallowed as 200 + JSON (which the client expects to read).
		const text = await res.text();
		return new Response(text, {
			status: res.status,
			headers: { 'content-type': 'application/json' }
		});
	} catch (err) {
		console.error('musiconn proxy error:', err);
		throw error(502, 'Failed to reach musiconn API');
	}
};