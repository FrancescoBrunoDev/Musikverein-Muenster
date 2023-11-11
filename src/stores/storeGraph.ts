import { writable } from 'svelte/store';

import { filters, filteredEvents } from '$stores/storeFilters';
import { fetchedEvents } from '$stores/storeEvents';
import { _ } from '$env/static/private';

const filteredEventsForGraph = writable<DataRecordCoordinates[]>([]);

const updateFilteredEventsAndUdateDataForGraph = async () => {
	let _filters: Filters = {
		and: [],
		or: [],
		not: []
	};
	filters.subscribe((res) => {
		_filters = res;
	});

	let _fetchedEvents: Events = {};
	fetchedEvents.subscribe((res) => {
		_fetchedEvents = res;
	});

	filteredEventsForGraph.set([]);

	filteredEvents.set({});

	// there should be an yearObj for each year from 1850 to 1900
	for (let year = 1840; year <= 1910; year++) {
		const events = _fetchedEvents[year as keyof Events] || [];
		let eventCount = 0;
		const yearObj: DataRecordCoordinates = {
			x: year,
			filters: {},
			eventCount: eventCount
		};

		if (_filters.or.length > 0 || _filters.not.length > 0 || _filters.and.length > 0) {
			for (const event of events) {
				let pushEventInFilteredEventsNOT = true;
				let pushEventInFilteredEvents = true;
				let pushEventInFilteredEventsAND = true;

				// filtro NOT
				for (const filter of _filters.not) {
					if (hasMatchingPerformances(event, filter)) {
						pushEventInFilteredEventsNOT = false;
					}
				}

				// filtro OR
				for (const filter of _filters.or) {
					if (hasMatchingPerformances(event, filter)) {
						pushEventInFilteredEvents = true;
						if (pushEventInFilteredEventsNOT) {
							yearObj.filters[filter.name] = {
								count: (yearObj.filters[filter.name]?.count || 0) + 1,
								color: filter.color
							};
						}
					} else {
						pushEventInFilteredEvents = false;
					}
				}

				// filtro AND
				for (const filter of _filters.and) {
					if (!hasMatchingPerformances(event, filter)) {
						pushEventInFilteredEventsAND = false;
						break;
					}
				}
				if (pushEventInFilteredEventsAND) {
					if (_filters.and.length > 0 && _filters.or.length > 0) {
						pushEventInFilteredEvents = true;
					}
					event.metchAnd = true;
					if (pushEventInFilteredEventsNOT) {
						yearObj.filters['and']?.count
							? yearObj.filters['and'].count++
							: (yearObj.filters['and'] = { count: 1 });
					}
				} else {
					event.metchAnd = false;
				}

				if (pushEventInFilteredEventsNOT && pushEventInFilteredEvents) {
					filteredEvents.update((currentEvents) => {
						currentEvents[year] = currentEvents[year] || [];
						currentEvents[year].push(event);
						yearObj.eventCount = currentEvents[year].length;
						return { ...currentEvents }; // Return a copy of the modified object
					});
				}
			}
		} else {
			filteredEvents.update((currentEvents) => {
				currentEvents[year] = events;
				// eliminate the year if there are no events
				if (events.length === 0) {
					delete currentEvents[year];
				}
				return { ...currentEvents }; // Return a copy of the modified object
			});
		}
		filteredEventsForGraph.update((currentEvents) => {
			if (_filters.or.length === 0 && _filters.not.length === 0 && _filters.and.length === 0) {
				yearObj.eventCount = events.length;
			}
			return [...currentEvents, yearObj];
		});
	}
};

const hasMatchingPerformances = (event: EventItem, filter: Filter) => {
	const performances = event.performances || [];
	// manage the case in witch event.performances does not exist

	if (event.performances) {
		for (const performance of performances) {
			// se composers esiste controlla se hasMatchingPerformance
			if (performance.composers) {
				for (const composer of performance.composers) {
					if (filter.entity === 'composer' && filter.id === composer.person) {
						return true;
					}
				}
			}

			// controlla se work hasMatchingPerformance
			if (filter.entity === 'work' && filter.id === performance.work) {
				return true;
			}

			if (performance.persons) {
				for (const person of event.persons) {
					if (filter.entity === 'person' && filter.id === person.person) {
						return true;
					}
				}
			}
		}
	}
	if (filter.entity === 'person') {
		for (const person of event.persons) {
			if (filter.id === person.person) {
				return true;
			}
		}
	}
	if (filter.entity === 'corporation') {
		for (const corporation of event.corporations) {
			if (filter.id === corporation.corporation) {
				return true;
			}
		}
	}

	if (filter.entity === 'location') {
		for (const location of event.locations) {
			if (filter.id === location.location) {
				return true;
			}
		}
	}
	return false;
};

export { filteredEvents, filteredEventsForGraph, updateFilteredEventsAndUdateDataForGraph };
