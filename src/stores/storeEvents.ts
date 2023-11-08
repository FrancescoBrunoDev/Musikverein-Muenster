import { writable } from 'svelte/store';
import { filteredEvents } from '$stores/storeFilters';

const fetchedEvents = writable<Events[]>(undefined);
const workTitles = writable<workTitles[]>([]);
const personTitles = writable<personTitles[]>([]);
const locationTitles = writable<locationTitles[]>([]);
const corporationTitles = writable<corporationTitles[]>([]);

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
	const uidTypes = [
		{ type: 'workUid', api: 'work' },
		{ type: 'personUid', api: 'person' },
		{ type: 'locationUid', api: 'location' },
		{ type: 'corporationUid', api: 'corporation' }
	];
	console.log(uidTypes);
	try {
		await Promise.all(
			uidTypes.map(async ({ type, api }) => {
				const uids = await getUids(type).then((res) => res.join('|'));
				const res = await fetch(
					`https://performance.musiconn.de/api?action=get&${api}=${uids}&props=title&format=json`
				);
				const json = await res.json();
				if (type === 'workUid') {
					const { work } = json;
					workTitles.set(work);
				} else if (type === 'personUid') {
					const { person } = json;
					personTitles.set(person);
				} else if (type === 'locationUid') {
					const { location } = json;
					locationTitles.set(location);
				} else if (type === 'corporationUid') {
					const { corporation } = json;
					corporationTitles.set(corporation);
				}
			})
		);
	} catch (error) {
		console.log(error);
	}
};

const getUids = async (kind) => {
    let _filteredEvents;
    const uids = new Set();
    const kindMapping = {
        'workUid': { key: 'performances', uid: 'work' },
        'personUid': { key: 'persons', uid: 'person' },
        'locationUid': { key: 'locations', uid: 'location' },
        'corporationUid': { key: 'corporations', uid: 'corporation' }
    };

    filteredEvents.subscribe((res) => {
        _filteredEvents = res;
    });

    for (const key in _filteredEvents) {
        const year = Number(key);
        const events = _filteredEvents[year];
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

export {
	fetchedEvents,
	workTitles,
	personTitles,
	locationTitles,
	corporationTitles,
	fetchAndStoreEvents,
	getTitles
};
