import { writable } from 'svelte/store';
import { filteredEvents } from '$stores/storeFilters';

const fetchedEvents = writable<Events>(undefined);
const allTitles = writable<allTitles>();

const getTitle = (uid: number, kind: KindType) => {
	let _allTitles: { [key in KindType]: { [key: number]: { title: string } } } = {
		work: {},
		person: {},
		location: {},
		corporation: {}
	};
	allTitles.subscribe((res) => {
		_allTitles = res;
	});

	const titles = _allTitles[kind];
	const titleObj = titles[uid];
	return titleObj ? titleObj.title : 'Title not found';
};

const fetchAndStoreEvents = async () => {
	let eventsByYear;
	try {
		if (eventsByYear === undefined) {
			eventsByYear = await fetch('/api/musiconn', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}).then((response) =>
				response
					.json()
					.then((data) => ({
						data: data,
						status: response.status
					}))
					.then((res) => {
						fetchedEvents.set(res.data);
						return res.status;
					})
			);
		}
	} catch (error) {
		console.log(error);
	}
};

const getTitles = async () => {
	const uidTypes: KindType[] = ['work', 'person', 'location', 'corporation'];
	try {
		await Promise.all(
			uidTypes.map(async (kind) => {
				const uids = await getUids(kind).then((res) => res.join('|'));
				const res = await fetch(
					`https://performance.musiconn.de/api?action=get&${kind}=${uids}&props=title&format=json`
				);
				const json = await res.json();
				const titles = json[kind];
				allTitles.update((current) => {
					return { ...current, [kind]: titles };
				});
			})
		);
	} catch (error) {
		console.log(error);
	}
};

const kindMapping: { [key in KindType]: { key: string; uid: string } } = {
	work: { key: 'performances', uid: 'work' },
	person: { key: 'persons', uid: 'person' },
	location: { key: 'locations', uid: 'location' },
	corporation: { key: 'corporations', uid: 'corporation' }
};

const getUids = async (kind: KindType) => {
	let _filteredEvents: Events;
	const uids = new Set();

	filteredEvents.subscribe((res) => {
		_filteredEvents = res;
	});

	for (const key in _filteredEvents) {
		const year = Number(key);
		const events = _filteredEvents[year as keyof Events];
		for (const event of events) {
			const kindKey = kindMapping[kind]?.key;
			const uidKey = kindMapping[kind]?.uid;
			if (kindKey && uidKey && event[kindKey]) {
				event[kindKey].forEach((item) => {
					uids.add(item[uidKey]);
				});
			}
		}
	}

	return Array.from(uids);
};

export { fetchedEvents, getTitle, fetchAndStoreEvents, getTitles };
