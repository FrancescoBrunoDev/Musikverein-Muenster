import { writable } from 'svelte/store';

const fetchedEvents = writable<Events[]>(undefined);

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

export { fetchedEvents, fetchAndStoreEvents };
