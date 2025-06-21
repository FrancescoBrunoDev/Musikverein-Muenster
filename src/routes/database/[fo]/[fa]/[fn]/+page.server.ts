import { joinEventByYear } from '$databaseMusiconn/lib/dataMusiconn.server';
import type { PageServerLoad } from './$types';

let cachedEvents: Events;
let startYear: number;
let endYear: number;

export const load: PageServerLoad = async ({ params }) => {
	const filterfo = params.fo;
	const filterfa = params.fa;
	const filterfn = params.fn;
	let events: Events = {};
	try {
		const res = await joinEventByYear();
		cachedEvents = res.event;
		startYear = res.startYear;
		endYear = res.endYear;
	} catch (error) {
		console.error('An error occurred while fetching events:', error);
	}

	return {
		props: {
			events: events,
			filters: {
				fo: filterfo,
				fa: filterfa,
				fn: filterfn
			},
			startYear: startYear,
			endYear: endYear
		}
	};
};
