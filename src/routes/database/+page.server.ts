import { streamEventsForLocation } from '$databaseMusiconn/lib/dataMusiconn.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// streamEventsForLocation returns fast metadata (~0.15s) plus one promise
	// per event page (100 events each). SvelteKit streams each promise to the
	// browser individually so the page shell + line graph render instantly and
	// the event list fills in with a real progress bar.
	const streamed = await streamEventsForLocation(332);

	return {
		props: {
			timeline: streamed.timeline,
			firstYear: streamed.firstYear,
			lastYear: streamed.lastYear,
			totalPages: streamed.totalPages,
			eventPages: streamed.eventPages
		}
	};
};
