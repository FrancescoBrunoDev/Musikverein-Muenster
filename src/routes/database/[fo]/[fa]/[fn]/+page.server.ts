import { streamEventsForLocation } from '$databaseMusiconn/lib/dataMusiconn.server';
import { mainLocationID } from '$databaseMusiconn/stores/storeEvents';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const filterfo = params.fo;
	const filterfa = params.fa;
	const filterfn = params.fn;

	// Default to Muenster for the shared-filter view; the filter route does not
	// carry a location id, so we reuse the configured main location.
	mainLocationID.set(332);

	const streamed = await streamEventsForLocation(332);

	return {
		props: {
			eventPages: streamed.eventPages,
			timeline: streamed.timeline,
			firstYear: streamed.firstYear,
			lastYear: streamed.lastYear,
			totalPages: streamed.totalPages,
			filters: {
				fo: filterfo,
				fa: filterfa,
				fn: filterfn
			}
		}
	};
};