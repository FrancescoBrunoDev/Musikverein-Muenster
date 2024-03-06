import { entitiesForSearchBox, filters } from '$stores/storeFilters';
import { suggestions } from '$stores/storeSearchSection';
import { projectID, startYear, endYear, mainLocationID } from '$stores/storeEvents';

const API_URL = 'https://performance.musiconn.de/api';

const getLocationEventsAndChildLocation = async (locationId: number) => {
	try {
		const res = await fetch(
			`${API_URL}?action=get&location=${locationId}&props=childs|events&format=json`
		);
		const data = await res.json();
		let events = data.location[locationId].events || [];

		if (data.location[locationId].childs && data.location[locationId].childs.length > 0) {
			const childEventsPromises = data.location[locationId].childs.map((child: any) =>
				getLocationEventsAndChildLocation(child.location)
			);
			const childEvents = await Promise.all(childEventsPromises);
			events = events.concat(...childEvents);
		}
		console.log('events', events);
		return events;
	} catch (error) {
		console.error('Error fetching events and child locations:', error);
		return [];
	}
};

const getAllEvents = async () => {
	try {
		let _mainLocationID: number = 1;
		mainLocationID.subscribe((res: number) => {
			_mainLocationID = res;
		});
		const allEventIds = await getLocationEventsAndChildLocation(_mainLocationID);

		const batchSize = 300;

		// Split the event IDs into batches of size batchSize
		const batches = Array.from({ length: Math.ceil(allEventIds.length / batchSize) }, (_, i) =>
			allEventIds.slice(i * batchSize, i * batchSize + batchSize)
		);

		const fetchPromises = batches.map(async (batch: { event: string }[]) => {
			const joinedEventIds = batch.map((eventObj) => eventObj.event).join('|');
			const res = await fetch(
				`${API_URL}?action=get&event=${joinedEventIds}&props=uid|dates|locations|persons|performances|corporations|sources&format=json`
			);
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
			let startYearValue: number = 0;
			let endYearValue: number = 3000;
			startYear.subscribe((res: number) => { startYearValue = res });
			endYear.subscribe((res: number) => { endYearValue = res });
			// se la data è antecedente al 1850 o successiva la 1900 non la considero
			if (event.dates[0].date.split('-')[0] < startYearValue || event.dates[0].date.split('-')[0] > endYearValue) {
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
	let _entitiesForSearchBox: string[] = [];
	entitiesForSearchBox.subscribe((res: string[]) => {
		_entitiesForSearchBox = res;
	});
	console.log('entitiesForSearchBox', _entitiesForSearchBox);
	function setFilters(results: AutocompleteResult[]) {
		filters.subscribe((filter: any) => {
			const mapFilterItems = (items: Filter[]) =>
				items.map((item) => ({
					id: item.id,
					entity: item.entity === 'composer' ? 'person' : item.entity
				}));

			const notFilterItems = mapFilterItems(filter.not);
			const orFilterItems = mapFilterItems(filter.or);
			const andFilterItems = mapFilterItems(filter.and);

			const isFiltered = (result: any) => (item: any) =>
				item.id == result[2] && item.entity == result[1];

			const filteredResults = results.filter(
				(result: AutocompleteResult) =>
					![...notFilterItems, ...orFilterItems, ...andFilterItems].some(isFiltered(result))
			);

			suggestions.set(filteredResults);
		});
	}
	const entities = _entitiesForSearchBox.join('|');
	if (entities.length !== 0) {
		try {
			let _projectID: number = 1
			projectID.subscribe((res: number) => {
				_projectID = res;
			});

			const res = await fetch(
				`${API_URL}?action=autocomplete&title=${query}&entities=${entities}&max=20&project=${_projectID}&format=json`
			);
			const results = await res.json();
			setFilters(results);
		} catch (error) {
			console.error('Error fetching all events with the project id:', error, 'try without project id');
			try {
				const res = await fetch(
					`${API_URL}?action=autocomplete&title=${query}&entities=${entities}&max=20&format=json`
				);
				const results = await res.json();
				setFilters(results);
			} catch (error) {
				console.error('Error fetching all events with the project id:', error);
				return [];
			}
		}
	}
};

export { autocomplete, joinEventByYear };
