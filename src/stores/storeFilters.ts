import { writable } from 'svelte/store';
import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
import { fetchedEvents } from '$stores/storeEvents';

const filters = writable<Filters[]>([]);
const IsMethodFilterNOT = writable(false);
const colorFilters = writable([
	'#04c0c7',
	'#e7871a',
	'#da348f',
	'#9089fa',
	'#47e26f',
	'#2780eb',
	'#6f38b1',
	'#268d6c',
	'#d11d55',
	'#ffcc00',
	'#a0d6e5',
	'#f45a6d'
]);
const filteredEvents = writable([]);
const entitiesForSearchBox = writable<Entities[]>(['person', 'corporation', 'work']);

const setFirstTimeFilter = () => {
	let _filters;
	filters.subscribe((res) => {
		_filters = res;
	});
	if (_filters.or?.length > 0) {
		return;
	} else {
		filters.set({
			or: [],
			not: []
		});
	}
};

const pickColor = () => {
	let _colorFilters;
	colorFilters.subscribe((res) => {
		_colorFilters = res;
	});
	const color = _colorFilters[0];
	_colorFilters.splice(0, 1);
	colorFilters.set(_colorFilters);
	return color;
};

const addFilterElement = (selected: any) => {
	let method: string;
	let _isMethodFilterNOT;
	IsMethodFilterNOT.subscribe((res) => {
		_isMethodFilterNOT = res;
	});
	if (_isMethodFilterNOT == false) {
		method = 'or';
	} else if (_isMethodFilterNOT == true) {
		method = 'not';
	}
	const filter: Filter = {
		name: selected.suggestion[0],
		entity: selected.suggestion[1],
		id: selected.suggestion[2],
		color: pickColor()
	};

	if (filter.entity == 'person') {
		filter.entity = isMoreAPersonOrAComposer(filter.id);
	}

	filters.update((currentFilters) => {
		const filterExists = currentFilters[method]?.some(
			(f) => f.id === filter.id && f.entity === filter.entity
		);
		if (filterExists) {
			return currentFilters;
		} else {
			const updatedFilters = { ...currentFilters };
			updatedFilters[method].push(filter);
			return updatedFilters;
		}
	});

	updateFilteredEventsAndUdateDataForGraph();
};

const removeFilterElement = (selected: string, method: string) => {
	let _colorFilters;
	colorFilters.subscribe((res) => {
		_colorFilters = res;
	});
	filters.update((currentFilters) => {
		const filterToRemove = currentFilters[method].find((f) => f.id === selected);
		const index = currentFilters[method].indexOf(filterToRemove);
		currentFilters[method].splice(index, 1);
		_colorFilters.push(filterToRemove.color);
		return currentFilters;
	});
	updateFilteredEventsAndUdateDataForGraph();
};

const isMoreAPersonOrAComposer = (id: string) => {
	const personId = id.toString();
	let _fetchedEvents: Events[] = [];
	fetchedEvents.subscribe((res) => {
		_fetchedEvents = res;
	});
	let countPerson = 0;
	let countComposer = 0;
	for (const key in _fetchedEvents) {
		const events = _fetchedEvents[key];
		for (const event of events) {
			const persons = event.persons;
			if (persons.length > 0) {
				for (const person of persons) {
					if (person.person.toString() === personId) {
						countPerson++;
					}
				}
			}
			const performances = event.performances;
			if (performances) {
				for (const performance of performances) {
					const composers = performance.composers;
					if (composers) {
						for (const composer of composers) {
							if (composer.person.toString() === personId) {
								countComposer++;
							}
						}
					}
				}
			}
		}
	}
	if (countPerson > countComposer) {
		return 'person';
	} else {
		return 'composer';
	}
};

const updateEntitiesForSearchBox = (selected: string) => {
	entitiesForSearchBox.update((currentEntities) => {
		if (currentEntities.includes(selected)) {
			const index = currentEntities.indexOf(selected);
			currentEntities.splice(index, 1);
		} else {
			currentEntities.push(selected);
		}
		return currentEntities;
	});
};

export {
	IsMethodFilterNOT,
	colorFilters,
	filters,
	filteredEvents,
	entitiesForSearchBox,
	addFilterElement,
	removeFilterElement,
	setFirstTimeFilter,
	updateEntitiesForSearchBox
};
