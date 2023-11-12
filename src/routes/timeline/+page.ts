import type { PageLoad } from './$types';

const kindMapping: { [key in Entity]: { key: string; uid: string } } = {
	work: { key: 'performances', uid: 'work' },
	person: { key: 'persons', uid: 'person' },
	location: { key: 'locations', uid: 'location' },
	corporation: { key: 'corporations', uid: 'corporation' }
};

const getTitles = async (events: Events) => {
	const uidTypes: Entity[] = ['work', 'person', 'location', 'corporation'];
	try {
		let allTitles: allTitles = {
			work: [],
			person: [],
			location: [],
			corporation: []
		};
		await Promise.all(
			uidTypes.map(async (kind) => {
				const uids = await getUids(kind, events).then((res) => res.join('|'));
				const res = await fetch(
					`https://performance.musiconn.de/api?action=get&${kind}=${uids}&props=title&format=json`
				);
				const json = await res.json();
				const titles = json[kind];
				allTitles = { ...allTitles, [kind]: titles };
			})
		);
		return allTitles;
	} catch (error) {
		console.error(
			'An error occurred while fetching titles, I will try to use the stored Titles:',
			error
		);
	}
};

const getUids = async (kind: Entity, FetchedEvents: Events) => {
	const uids = new Set();

	for (const key in FetchedEvents) {
		const year = Number(key);
		const events = FetchedEvents[year as keyof Events];
		for (const event of events) {
			const kindKey = kindMapping[kind] ? (kindMapping[kind].key as KindKey) : undefined;
			const uidKey = kindMapping[kind] ? (kindMapping[kind]?.uid as Entity) : undefined;
			if (kindKey && uidKey && event[kindKey]) {
				event[kindKey].forEach((item) => {
					uids.add(item[uidKey]);
				});
			}
		}
	}

	return Array.from(uids);
};

export const load: PageLoad = async ({ fetch }) => {
	let events: Events = {};
	let allTitles;
	try {
		const res = await fetch(`/api/musiconn/joinEventByYear`);
		events = await res.json();
		allTitles = await getTitles(events);
	} catch (error) {
		console.error('An error occurred while fetching events:', error);
	}

	return {
		props: {
			events: events,
			allTitles: allTitles
		}
	};
};
