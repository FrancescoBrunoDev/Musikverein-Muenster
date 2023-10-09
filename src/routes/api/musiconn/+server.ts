import { json } from '@sveltejs/kit';
import { joinEventByYear } from '$lib/dataMusiconn';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const response = await joinEventByYear();
	return json(response);
};
