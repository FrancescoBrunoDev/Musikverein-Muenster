import type { PageServerLoad } from './$types';
import { joinEventByYear } from '$lib/dataMusiconn';

export const load: PageServerLoad = async ({ params }) => {
	const filterfo = params.fo;
	const filterfa = params.fa;
	const filterfn = params.fn;
	let events: Events = {};
	try {
		events = await joinEventByYear();
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
			}
		}
	};
};
