import type { PageLoad } from './$types';
import { joinEventByYear } from '$lib/dataMusiconn';

export const load: PageLoad = async () => {
	let events: Events = {};
	try {
		events = await joinEventByYear();
	} catch (error) {
		console.error('An error occurred while fetching events:', error);
	}

	return {
		props: {
			events: events
		}
	};
};
