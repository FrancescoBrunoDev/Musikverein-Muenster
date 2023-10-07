let MuensterID = 307; //307 is the ID of Muenster in the musiconn database
import { entitiesForSearchBox } from '$stores/storeGraph';

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
				`https://performance.musiconn.de/api?action=get&location=${childLocationIds}&props=events&format=json`
			);

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

function extractEventIds(obj: number | object) {
	const eventIds: any[] = [];

	function recursiveExtract(obj: number | object) {
		if (obj && typeof obj === 'object') {
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
		const batches = [];

		// Split the event IDs into batches of size batchSize
		for (let i = 0; i < allEventIds.length; i += batchSize) {
			const batch = allEventIds.slice(i, i + batchSize);
			batches.push(batch);
		}

		const fetchPromises = batches.map(async (batch) => {
			const joinedEventIds = batch.join('|');
			const url = `https://performance.musiconn.de/api?action=get&event=${joinedEventIds}&props=dates|corporations|performances|persons&format=json`;
			const res = await fetch(url);
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
	const eventsByYear = {};
	for (const batch of allEvents) {
		const allEvents = batch.event;
		for (const key in allEvents) {
			const event = allEvents[key];
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
	let _entitiesForSearchBox;
	entitiesForSearchBox.subscribe((res) => {
		_entitiesForSearchBox = res;
	});
	const entities = _entitiesForSearchBox.join('|');
	if (entities.length !== 0) {
		try {
			const res = await fetch(
				`https://performance.musiconn.de/api?action=autocomplete&title=${query}&entities=${entities}&project=26&format=json`
			);
			const results = await res.json();

			return results;
		} catch (error) {
			console.error('Error fetching all events:', error);
			return [];
		}
	}
};

export { autocomplete, joinEventByYear };
