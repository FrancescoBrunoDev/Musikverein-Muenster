import type { PageLoad } from './$types';
import { joinEventByYear } from '$lib/dataMusiconn';

let cachedEvents: Events = null;

export const load: PageLoad = async () => {
	if (!cachedEvents) {
		try {
			cachedEvents = await joinEventByYear();
		} catch (error) {
			console.error('An error occurred while fetching events:', error);
			cachedEvents = {};
		}
	}

	return {
		props: {
			events: cachedEvents
		}
	};
};