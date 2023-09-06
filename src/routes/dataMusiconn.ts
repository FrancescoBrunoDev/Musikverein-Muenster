import { filters } from '../store';

let MuensterID = 307;

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
		const joinedEventIds = allEventIds.join('|');

		const res = await fetch(
			`https://performance.musiconn.de/api?action=get&event=${joinedEventIds}&props=dates|corporations|performances|persons&format=json`
		);
		const allEvents = await res.json();
		console.log(allEvents, 'allEvents');
		return allEvents;
	} catch (error) {
		console.error('Error fetching all events:', error);
		return [];
	}
};

const joinEventByYear = async () => {
	const allEvents = await getAllEvents();
	const eventsByYear = {};

	for (const key in allEvents.event) {
		const event = allEvents.event[key];
		const year = event.dates[0].date.split('-')[0];

		if (eventsByYear[year]) {
			eventsByYear[year].push(event);
		} else {
			eventsByYear[year] = [event];
		}
	}

	return eventsByYear;
};

const dataForGraph = async () => {
	const eventsByYear = await joinEventByYear();
	const data: DataRecordCoordinates[] = [];
	const linea: DataRecordChart = [
		{
			name: 'main',
			data: data
		}
	];
	for (const key in eventsByYear) {
		const events = eventsByYear[key];
		const year = Number(key);
		const eventCount = events.length;
		data.push({
			x: year,
			y: eventCount
		});
	}

	return linea;
};

const autocomplete = async (query: string) => {
	try {
		const res = await fetch(
			`https://performance.musiconn.de/api?action=autocomplete&title=${query}&entities=corporation|person|work&project=26&format=json`
		);
		const results = await res.json();

		return results;
	} catch (error) {
		console.error('Error fetching all events:', error);
		return [];
	}
};

export { dataForGraph, autocomplete };
