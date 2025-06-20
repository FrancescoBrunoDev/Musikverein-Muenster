import { joinEventByYear } from '$databaseMusiconn/lib/dataMusiconn.server';
import { mainLocationID } from '$databaseMusiconn/stores/storeEvents';
import type { PageServerLoad } from './$types';

let cachedEvents: Events;
let startYear: number;
let endYear: number;

export const load: PageServerLoad = async () => {
	mainLocationID.set(332); // Set the main location ID to Muenster
	if (!cachedEvents) {
		try {
			let res = await joinEventByYear();
			cachedEvents = res.event;
			startYear = res.startYear;
			endYear = res.endYear;
		} catch (error) {
			console.error('An error occurred while fetching events:', error);
			cachedEvents = {};
		}
	}

	return {
		props: {
			events: cachedEvents,
			startYear: startYear,
			endYear: endYear
		}
	};
};
