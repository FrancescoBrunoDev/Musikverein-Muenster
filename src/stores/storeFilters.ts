import { writable } from 'svelte/store';
import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
import { fetchedEvents } from '$stores/storeEvents';

const filtersUrlified = writable<string>('');
const filters = writable<Filters>({
	and: [],
	or: [],
	not: []
});

const SelectedMethodFilter = writable<Method>('or');
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
const filteredEvents = writable<Events>({});
const entitiesForSearchBox = writable<Entity[]>(['person', 'corporation', 'work', 'location']);

const UpdateSelectedMethodFilter = (method: Method) => {
	SelectedMethodFilter.set(method);
};



const pickColor = () => {
	let _colorFilters: string[] = [];
	colorFilters.subscribe((res) => {
		_colorFilters = res;
	});
	const color = _colorFilters[0];
	_colorFilters.splice(0, 1);
	colorFilters.set(_colorFilters);
	return color;
};

const addFilterElement = async (selected: any) => {
	let method: string;
	SelectedMethodFilter.subscribe((res) => {
		method = res;
	});
	const filter: Filter = {
		name: selected.suggestion[0],
		entity: selected.suggestion[1],
		id: Number(selected.suggestion[2]),
		color: pickColor()
	};

	if (filter.entity == 'person') {
		filter.entity = await isMoreAPersonOrAComposer(filter.id);
	}

	filters.update((currentFilters) => {
		const filterExists = currentFilters[method as keyof Filters]?.some(
			(f) => f.id === filter.id && f.entity === filter.entity
		);
		if (filterExists) {
			return currentFilters;
		} else {
			const updatedFilters = { ...currentFilters };
			updatedFilters[method as keyof Filters].push(filter);
			return updatedFilters;
		}
	});

	updateFilteredEventsAndUdateDataForGraph();
};

const removeFilterElement = (selected: number, method: Method) => {
	let _colorFilters;
	colorFilters.subscribe((res) => {
		_colorFilters = res;
	});
	filters.update((currentFilters) => {
		const index = currentFilters[method].findIndex((f) => f.id === selected);
		if (index === -1) {
			return currentFilters;
		}
		const filterToRemove = currentFilters[method][index];
		currentFilters[method].splice(index, 1);
		_colorFilters.push(filterToRemove.color);
		return currentFilters;
	});
	updateFilteredEventsAndUdateDataForGraph();
};

const changeFilterPersonOrComposer = (selectedId: any, selectedEntity: any, method: Method) => {
	filters.update((currentFilters) => {
		const methodFilters = currentFilters[method];
		if (!methodFilters) return currentFilters;

		const filterToChange = methodFilters.find(
			(f) => f.id === selectedId && f.entity === selectedEntity
		);
		if (!filterToChange) return currentFilters;

		const newState = filterToChange.entity === 'person' ? 'composer' : 'person';
		filterToChange.entity = newState;

		if (methodFilters.some((f) => f.id === selectedId && f.entity === newState)) {
			const index = methodFilters.findIndex(
				(f) => f.id === selectedId && f.entity === selectedEntity
			);
			if (index !== -1) methodFilters.splice(index, 1);
		}

		return currentFilters;
	});
	updateFilteredEventsAndUdateDataForGraph();
};

const isMoreAPersonOrAComposer = async (id: number) => {
	const personId = id;
	let _fetchedEvents: Events = await new Promise((resolve) => {
		fetchedEvents.subscribe((res) => {
			resolve(res);
		});
	});
	let countPerson = 0;
	let countComposer = 0;
	for (const key in _fetchedEvents) {
		const events = _fetchedEvents[key];
		for (const event of events) {
			const persons = event.persons;
			try {
				if (persons.length > 0) {
					for (const person of persons) {
						if (person.person === personId) {
							countPerson++;
						}
					}
				}
			} catch (error) {
				console.error('Si è verificato un errore:', error);
			}
			const performances = event.performances;
			if (performances) {
				for (const performance of performances) {
					const composers = performance.composers;
					if (composers) {
						for (const composer of composers) {
							if (composer.person === personId) {
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

const updateEntitiesForSearchBox = (selected: Entity) => {
	entitiesForSearchBox.update((currentEntities: Entity[]) => {
		if (currentEntities.includes(selected) && currentEntities.length > 1) {
			const index = currentEntities.indexOf(selected);
			currentEntities.splice(index, 1);
		} else {
			currentEntities.push(selected);
		}
		return currentEntities;
	});
};

export {
	colorFilters,
	filters,
	filteredEvents,
	entitiesForSearchBox,
	filtersUrlified,
	UpdateSelectedMethodFilter,
	addFilterElement,
	removeFilterElement,
	updateEntitiesForSearchBox,
	changeFilterPersonOrComposer
};
