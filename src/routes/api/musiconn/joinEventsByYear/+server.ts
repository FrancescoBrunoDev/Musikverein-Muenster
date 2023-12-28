import { json } from '@sveltejs/kit';
import { joinEventByYear } from '$lib/dataMusiconn';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	let response;
	try {
		response = await joinEventByYear();
		return json(response);
	} catch (error: any) {
		console.error(error);
		return json({ error: error.message });
	}
};
