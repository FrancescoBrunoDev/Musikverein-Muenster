import { writable } from 'svelte/store';
import { filteredEvents } from '$stores/storeFilters';

const fetchedEvents = writable<Events[]>(undefined);
const workTitles = writable<workTitles[]>([]);
const personTitles = writable<personTitles[]>([]);
const locationTitles = writable<locationTitles[]>([]);

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
	const uids = await getUids("workUid").then((res) => res.join('|'));
	const uids2 = await getUids("personUid").then((res) => res.join('|'));
	const uid3 = await getUids("locationUid").then((res) => res.join('|'));

	try {
		const res = await fetch(
			`https://performance.musiconn.de/api?action=get&work=${uids}&props=title&format=json`
		);
		const { work } = await res.json();
		workTitles.set(work);
		const res2 = await fetch(
			`https://performance.musiconn.de/api?action=get&person=${uids2}&props=title&format=json`
		);
		const { person } = await res2.json();
		personTitles.set(person);
		const res3 = await fetch(
			`https://performance.musiconn.de/api?action=get&location=${uid3}&props=title&format=json`
		);
		const { location } = await res3.json();
		locationTitles.set(location);
	} catch (error) {
		console.log(error);
	}
};

const getUids = async (kind) => {
	let _filteredEvents;
	const uids = new Set();

	filteredEvents.subscribe((res) => {
		_filteredEvents = res;
	});

	for (const key in _filteredEvents) {
		const year = Number(key);
		const events = _filteredEvents[year];
		for (const event of events) {
			if (kind === 'workUid') {
				if (event.performances) {
					event.performances.forEach((performance) => {
						uids.add(performance.work);
					});
				}
			} else if (kind === 'personUid') {
				if (event.persons) {
					event.persons.forEach((person) => {
						uids.add(person.person);
					});
				}
			} else if (kind === 'locationUid') {
				if (event.locations) {
					event.locations.forEach((location) => {
						uids.add(location.location);
					});
				}
			}
		}
	}

	return Array.from(uids);
};

export { fetchedEvents, workTitles, personTitles, locationTitles, fetchAndStoreEvents, getTitles };
