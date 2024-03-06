import { writable } from 'svelte/store';

import { filters, filteredEvents } from '$stores/storeFilters';
import { fetchedEvents, startYear, endYear } from '$stores/storeEvents';

const filteredEventsForGraph = writable<DataRecordCoordinates[]>([]);
const showLinesAsPerformances = writable<boolean>(true);

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

		let _startYear: number = 0;
	let _endYear: number = 3000;
	startYear.subscribe((res: number) => {
		_startYear = res;
	});
	endYear.subscribe((res: number) => {
		_endYear = res;
	});

	filteredEventsForGraph.set([]);

	filteredEvents.set({});

	// there should be an yearObj for each year from startYear to endYear
	for (let year = _startYear; year <= _endYear+10; year++) {
		const events = _fetchedEvents[year as keyof Events] || [];
		let eventCount = 0;
		const yearObj: DataRecordCoordinates = {
			x: year,
			filters: {},
			eventCount: eventCount
		};

		if (_filters.or.length > 0 || _filters.and.length > 0 || _filters.not.length > 0) {
			events.forEach((event) => {
				const andConditions =
					_filters.and.length > 0 &&
					_filters.and.every((filter) => hasMatchingPerformances(event, filter));
				const orConditions =
					_filters.or.length > 0 &&
					_filters.or.some((filter) => hasMatchingPerformances(event, filter));
				const notConditions = _filters.not.some((filter) => hasMatchingPerformances(event, filter));

				if (
					!notConditions &&
					_filters.not.length > 0 &&
					_filters.and.length === 0 &&
					_filters.or.length === 0
				) {
					filteredEvents.update((currentEvents) => {
						currentEvents[year] = currentEvents[year] || [];
						currentEvents[year].push(event);
						yearObj.eventCount = currentEvents[year].length;
						return { ...currentEvents }; // Return a copy of the modified object
					});
				} else if ((andConditions || orConditions) && !notConditions) {
					filteredEvents.update((currentEvents) => {
						currentEvents[year] = currentEvents[year] || [];
						currentEvents[year].push(event);
						yearObj.eventCount = currentEvents[year].length;

						// Update yearObj.filters with all the or filters
						_filters.or.forEach((filter) => {
							if (hasMatchingPerformances(event, filter)) {
								yearObj.filters[filter.id] = yearObj.filters[filter.id] || {
									count: 0,
									color: filter.color
								};
								yearObj.filters[filter.id].count++;
							}
						});

						// Update yearObj.filters with an additional and filter
						if (andConditions) {
							yearObj.filters['and'] = yearObj.filters['and'] || { count: 0 };
							yearObj.filters['and'].count++;
						}
						if (orConditions) {
							yearObj.filters['or'] = yearObj.filters['or'] || { count: 0 };
							yearObj.filters['or'].count++;
						}

						return { ...currentEvents }; // Return a copy of the modified object
					});
				}
			});
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

export {
	filteredEvents,
	filteredEventsForGraph,
	showLinesAsPerformances,
	updateFilteredEventsAndUdateDataForGraph
};
