import { writable } from 'svelte/store';

import { filters, setFirstTimeFilter, filteredEvents } from '$stores/storeFilters';
import { fetchedEvents } from '$stores/storeEvents';

const filteredEventsForGraph = writable<FilteredEventsForGraph>([]);

const updateFilteredEventsAndUdateDataForGraph = async () => {
	setFirstTimeFilter();
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
	if (_filters.or.length === 0) {
		filteredEvents.set(_fetchedEvents);
	} else {
		filteredEvents.set({});
	}

	for (const key in _fetchedEvents) {
		const year = Number(key);
		const events = _fetchedEvents[key as keyof Events];
		const eventCount = events.length; // questo è da cambiare con la somma dei risultati dei filtri
		const yearObj: DataRecordCoordinates = {
			x: year,
			filters: {},
			eventCount: eventCount
		};

		if (_filters.or.length === 0) {
			for (const filter of _filters.not) {
				for (const event of events) {
					const hasMatchingPerformanceNOT = hasMatchingPerformances(event, filter);
					if (hasMatchingPerformanceNOT) {
						yearObj.eventCount--;
						filteredEvents.update((currentEvents) => {
							currentEvents[year] = currentEvents[year].filter((e) => e.uid !== event.uid);
							if (currentEvents[year].length === 0) {
								delete currentEvents[year];
							}
							return { ...currentEvents };
						});
					}
				}

				yearObj.filters[filter.name] = {
					// count: filterCount,
					color: filter.color
				};
			}
		}
		if (_filters.or.length > 0) {
			for (const filter of _filters.or) {
				let filterCount = 0;

				for (const event of events) {
					const hasMatchingPerformanceOR = hasMatchingPerformances(event, filter);

					if (hasMatchingPerformanceOR) {
						filterCount++;
						filteredEvents.update((currentEvents) => {
							currentEvents[year] = currentEvents[year] || [];
							currentEvents[year].push(event);
							return { ...currentEvents }; // Return a copy of the modified object
						});
					}
				}

				yearObj.filters[filter.name] = {
					count: filterCount,
					color: filter.color
				};
			}
		}

		filteredEventsForGraph.update((currentEvents) => {
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
	return false;
};

export { filteredEvents, filteredEventsForGraph, updateFilteredEventsAndUdateDataForGraph };
