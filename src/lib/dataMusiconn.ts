import { entitiesForSearchBox } from '$stores/storeFilters';

const MuensterID = 332; //307 (new 332) is the ID of Muenster in the musiconn database
const API_URL = 'https://performance.musiconn.de/api';

const getMuensterEventsAndChildLocation = async (locationId: number) => {
	try {
		const res = await fetch(
			`${API_URL}?action=get&location=${locationId}&props=childs|events&format=json`
		);
		const data = await res.json();
		let events = data.location[locationId].events || [];

		if (data.location[locationId].childs && data.location[locationId].childs.length > 0) {
			const childEventsPromises = data.location[locationId].childs.map((child: any) =>
				getMuensterEventsAndChildLocation(child.location)
			);
			const childEvents = await Promise.all(childEventsPromises);
			events = events.concat(...childEvents);
		}

		return events;
	} catch (error) {
		console.error('Error fetching events and child locations:', error);
		return [];
	}
};

const getAllEvents = async () => {
	try {
		const allEventIds = await getMuensterEventsAndChildLocation(MuensterID);

		const batchSize = 300;

		// Split the event IDs into batches of size batchSize
		const batches = Array.from({ length: Math.ceil(allEventIds.length / batchSize) }, (_, i) =>
			allEventIds.slice(i * batchSize, i * batchSize + batchSize)
		);

		const fetchPromises = batches.map(async (batch: { event: string }[]) => {
			const joinedEventIds = batch.map((eventObj) => eventObj.event).join('|');
			const res = await fetch(`${API_URL}?action=get&event=${joinedEventIds}&format=json`);
			return res.json();
		});

		const jsons = await Promise.all(fetchPromises);
		return jsons;
	} catch (error) {
		console.error('Error fetching all events:', error);
		return [];
	}
};

const joinEventByYear = async () => {
	const allEvents = await getAllEvents();
	const eventsByYear: Events = {};
	for (const batch of allEvents) {
		const allEvents = batch.event;
		for (const key in allEvents) {
			const event = allEvents[key];
			// se la data è antecedente al 1850 o successiva la 1900 non la considero
			if (event.dates[0].date.split('-')[0] < 1850 || event.dates[0].date.split('-')[0] > 1900) {
				continue;
			}
			const year = event.dates[0].date.split('-')[0];

			if (eventsByYear[year]) {
				eventsByYear[year].push(event);
			} else {
				eventsByYear[year] = [event];
			}
		}
	}
	return eventsByYear;
};

const autocomplete = async (query: string) => {
	let _entitiesForSearchBox: string[] = await new Promise<string[]>((resolve) => {
		entitiesForSearchBox.subscribe((res: string[]) => {
			resolve(res);
		});
	});
	const entities = _entitiesForSearchBox.join('|');
	if (entities.length !== 0) {
		try {
			const res = await fetch(
				`https://performance.musiconn.de/api?action=autocomplete&title=${query}&entities=${entities}&max=20&project=26&format=json`
			);
			const results = await res.json();
			return results;
		} catch (error) {
			console.error('Error fetching all events with the project id:', error);
			try {
				const res = await fetch(
					`https://performance.musiconn.de/api?action=autocomplete&title=${query}&entities=${entities}&max=20&format=json`
				);
				const results = await res.json();
				console.log('results', results);
				return results;
			} catch (error) {
				console.error('Error fetching all events with the project id:', error);
				return [];
			}
		}
	}
};

export { autocomplete, joinEventByYear };
