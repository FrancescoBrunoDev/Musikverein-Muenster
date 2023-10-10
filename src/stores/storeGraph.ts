import { writable } from 'svelte/store';

import {
	filters,
	setFirstTimeFilter,
	filteredEvents,
} from '$stores/storeFilters';
import { fetchedEvents } from '$stores/storeEvents';

const filteredEventsForGraph = writable([]);

const changeFilterPersonOrComposer = (selectedId: any, selectedEntity: any) => {
	filters.update((currentFilters) => {
		const filterToChange = currentFilters.or?.find(
			(f) => f.id === selectedId && f.entity === selectedEntity
		);
		const actualState = filterToChange.entity;
		const newState = actualState === 'person' ? 'composer' : 'person';
		const thereIsAnotherFilterWithSameIdAndEntity = currentFilters.or?.some(
			(f) => f.id === selectedId && f.entity === newState
		);
		if (thereIsAnotherFilterWithSameIdAndEntity) {
			const filterToRemove = currentFilters.or?.find(
				(f) => f.id === selectedId && f.entity === actualState
			);
			const index = currentFilters.or?.indexOf(filterToRemove);
			currentFilters.or?.splice(index, 1);
		}

		filterToChange.entity = newState;
		return currentFilters;
	});
	updateFilteredEventsAndUdateDataForGraph();
};

const updateFilteredEventsAndUdateDataForGraph = async () => {
	setFirstTimeFilter();
	let _filters;
	filters.subscribe((res) => {
		_filters = res;
	});

	let _fetchedEvents: Events[] = [];
	fetchedEvents.subscribe((res) => {
		_fetchedEvents = res;
	});

	filteredEventsForGraph.set([]);
	filteredEvents.set([]);

	for (const key in _fetchedEvents) {
		const year = Number(key);
		const events = _fetchedEvents[key];
		const eventCount = events.length; // questo è da cambiare con la somma dei risultati dei filtri
		const yearObj: DataRecordCoordinates = {
			x: year,
			filters: {},
			eventCount: eventCount
		};

		for (const filter of _filters.or) {
			let filterCount = 0;

			for (const event of events) {
				const hasMatchingPerformanceOR = hasMatchingPerformancesOR(event, filter);
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
		// console.log(yearObj);
		filteredEventsForGraph.update((currentEvents) => {
			return [...currentEvents, yearObj];
		});
	}
};

const hasMatchingPerformancesOR = (event: Performance[], filter: Filter) => {
	const performances = event.performances || [];
	if (performances.length > 0) {
		for (const performance of performances) {
			// se composers esiste controlla se hasMatchingPerformance
			if (performance.composers) {
				for (const composer of performance.composers) {
					if (filter.entity === 'composer' && filter.id === composer.person.toString()) {
						return true;
					}
				}
			}

			// controlla se work hasMatchingPerformance
			if (filter.entity === 'work' && filter.id === performance.work.toString()) {
				return true;
			}

			// controlla se corporations esiste e controlla se hasMatchingPerformance
			if (performance.corporations) {
				for (const corporation of performance.corporations) {
					if (filter.entity === 'corporation' && filter.id === corporation.corporation.toString()) {
						return true;
					}
				}
			}
		}

		for (const person of event.persons) {
			if (filter.entity === 'person' && filter.id === person.person.toString()) {
				return true;
			}
		}
	}
	return false;
};

const hasMatchingPerformancesNOT = (event: Performance[], filter: Filter) => {
	const performances = event.performances || [];
	for (const performance of performances) {
		// se composers esiste controlla se hasMatchingPerformance
		if (performance.composers) {
			for (const composer of performance.composers) {
				if (filter.entity === 'composer' && filter.id === composer.person.toString()) {
					return false;
				}
			}
		}

		// controlla se work hasMatchingPerformance
		if (filter.entity === 'work' && filter.id === performance.work.toString()) {
			return false;
		}

		// controlla se corporations esiste e controlla se hasMatchingPerformance
		if (performance.corporations) {
			for (const corporation of performance.corporations) {
				if (filter.entity === 'corporation' && filter.id === corporation.corporation.toString()) {
					return false;
				}
			}
		}
	}

	for (const person of event.persons) {
		if (filter.entity === 'person' && filter.id === person.person.toString()) {
			return false;
		}
	}
	return true;
};

export {
	filteredEventsForGraph,
	changeFilterPersonOrComposer,
	updateFilteredEventsAndUdateDataForGraph
};
