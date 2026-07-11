import { joinEventByYear } from '$databaseMusiconn/lib/dataMusiconn.server';
import { getLocationMeta } from '$databaseMusiconn/lib/musiconnApi';
import { mainLocationID } from '$databaseMusiconn/stores/storeEvents';
import type { PageServerLoad } from './$types';

// In-memory cache (per server process). The detailed event list is expensive to
// fetch (~20s cold); once cached it is returned synchronously so {#await} in the
// page resolves immediately.
let cachedEvents: Events | undefined;
let cachedTimeline: { [year: string]: number } = {};
let startYear = 1850;
let endYear = 1900;

export const load: PageServerLoad = async () => {
	mainLocationID.set(332); // Set the main location ID to Muenster

	// 1) Fast metadata (~0.1s): ships the per-year timeline so the line graph can
	//    render immediately, before the detailed event list streams in.
	if (!cachedTimeline || Object.keys(cachedTimeline).length === 0) {
		try {
			const meta = await getLocationMeta(332);
			cachedTimeline = meta.timeline;
			startYear = meta.firstYear || startYear;
			endYear = meta.lastYear || endYear;
		} catch (error) {
			console.error('Error fetching location meta:', error);
			cachedTimeline = {};
		}
	}

	// 2) Detailed events. On a cache hit return the plain object (resolves
	//    instantly in {#await}); otherwise return an UN-awaited promise so
	//    SvelteKit streams it and the page shell renders right away.
	let events: Events | Promise<Events>;
	if (cachedEvents) {
		events = cachedEvents;
	} else {
		events = joinEventByYear()
			.then((res) => {
				cachedEvents = res.event;
				return res.event;
			})
			.catch((error) => {
				console.error('An error occurred while fetching events:', error);
				return {} as Events;
			});
	}

	return {
		props: {
			events,
			timeline: cachedTimeline,
			startYear,
			endYear
		}
	};
};