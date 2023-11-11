import { entitiesForSearchBox } from '$stores/storeFilters';

const MuensterID = 307; //307 is the ID of Muenster in the musiconn database
const API_URL = 'https://performance.musiconn.de/api';

const getMuensterEventsAndChildLocation = async () => {
	try {
		const res = await fetch(
			`https://performance.musiconn.de/api?action=get&location=${MuensterID}&props=childs|events&format=json`
		);
		const eventsAndChildsLocations = await res.json();
		return eventsAndChildsLocations;
	} catch (error) {
		console.error('Error fetching events and child locations:', error);
		return {};
	}
};

const getMuensterChildEvents = async (
	muensterEventsAndChildLocation: MuensterEventsAndChildLocation
) => {
	try {
		const eventsAndChildsLocations = muensterEventsAndChildLocation.location[MuensterID];

		if (eventsAndChildsLocations && eventsAndChildsLocations.childs) {
			const childLocationIds = eventsAndChildsLocations.childs
				.map((child) => child.location)
				.join('|');

			const res = await fetch(
				`${API_URL}?action=get&location=${childLocationIds}&props=events&format=json`
			);

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const childEvents = await res.json();
			return childEvents;
		} else {
			console.error('No child events found in the events object.');
		}
	} catch (error) {
		console.error('Error fetching child events:', error);
		return [];
	}
};

const joinMuensterEventAndChildEvents = async () => {
	try {
		const muensterEventsAndChildLocation = await getMuensterEventsAndChildLocation();
		const muensterChildEvents = await getMuensterChildEvents(muensterEventsAndChildLocation);

		if (muensterEventsAndChildLocation && muensterChildEvents) {
			muensterEventsAndChildLocation.location[MuensterID].childs = muensterChildEvents;
		}
		return muensterEventsAndChildLocation;
	} catch (error) {
		console.error('Error joining events and child events:', error);
		return [];
	}
};

interface LocationObj {
	event: number;
	[key: string]: number | LocationObj;
}

function extractEventIds(obj: number | LocationObj) {
	const eventIds: number[] = [];

	function recursiveExtract(obj: number | LocationObj) {
		if (obj instanceof Object) {
			if (obj.event) {
				eventIds.push(obj.event);
			}
			for (const key in obj) {
				recursiveExtract(obj[key]);
			}
		}
	}

	recursiveExtract(obj);
	return eventIds;
}

const getAllEvents = async () => {
	try {
		const muensterWithAllEventAndAllChildsEvent = await joinMuensterEventAndChildEvents();
		const allEventIds = extractEventIds(muensterWithAllEventAndAllChildsEvent.location[MuensterID]);

		const batchSize = 1000;

		// Split the event IDs into batches of size batchSize
		const batches = Array.from({ length: Math.ceil(allEventIds.length / batchSize) }, (_, i) =>
			allEventIds.slice(i * batchSize, i * batchSize + batchSize)
		);

		const fetchPromises = batches.map(async (batch) => {
			const joinedEventIds = batch.join('|');
			const url = `${API_URL}?action=get&event=${joinedEventIds}&props=uid|dates|corporations|performances|persons|locations&format=json`;
			const res = await fetch(url);

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			return res.json();
		});

		const eventsArrays = await Promise.all(fetchPromises);
		return eventsArrays;
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
			console.log('results', results);
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
