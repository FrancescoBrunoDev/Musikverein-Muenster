import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { updateFilteredEventsAndUdateDataForGraph } from '$stores/storeGraph';
import { getTitleString, getTitle, fetchedEvents } from '$stores/storeEvents';

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
const isAFilterDragged = writable<boolean>(false);

const UpdateSelectedMethodFilter = (method: Method) => {
	SelectedMethodFilter.set(method);
};

const urlifyerFilters = () => {
	filters.subscribe((res) => {
		const filtersOr = res.or
			.map((filter) => `${filter.entity.substring(0, 3)}:${filter.id}`)
			.join(',');
		const filtersAnd = res.and
			.map((filter) => `${filter.entity.substring(0, 3)}:${filter.id}`)
			.join(',');
		const filtersNot = res.not
			.map((filter) => `${filter.entity.substring(0, 3)}:${filter.id}`)
			.join(',');
		const filtersString = `${filtersOr || '_'}/${filtersAnd || '_'}/${filtersNot || '_'}`;
		filtersUrlified.set(filtersString);
	});
};

const deUrlifyerFilters = async (filtersUrl: FiltersForUrl) => {
	const filtersOr =
		filtersUrl.fo && filtersUrl.fo !== '_'
			? filtersUrl.fo
					.split(',')
					.map((filter) => ({ entity: filter.split(':')[0], id: filter.split(':')[1] }))
			: [];
	const filtersAnd =
		filtersUrl.fa && filtersUrl.fa !== '_'
			? filtersUrl.fa
					.split(',')
					.map((filter) => ({ entity: filter.split(':')[0], id: filter.split(':')[1] }))
			: [];
	const filtersNot =
		filtersUrl.fn && filtersUrl.fn !== '_'
			? filtersUrl.fn
					.split(',')
					.map((filter) => ({ entity: filter.split(':')[0], id: filter.split(':')[1] }))
			: [];

	function whichEntityIs(entity: string) {
		switch (entity) {
			case 'per':
				return 'person' as Entity;
			case 'com':
				return 'composer' as Entity;
			case 'loc':
				return 'location' as Entity;
			case 'wor':
				return 'work' as Entity;
			case 'cor':
				return 'corporation' as Entity;
			default:
				return 'person';
		}
	}
	const newFilters: Filters = {
		or: await Promise.all(
			filtersOr
				.filter((filter) => filter.id)
				.map(async (filter) => ({
					id: Number(filter.id),
					entity: whichEntityIs(filter.entity),
					name: `${await getTitle([filter.id], whichEntityIs(filter.entity)).then(() =>
						getTitleString(Number(filter.id), whichEntityIs(filter.entity))
					)}`,
					color: pickColor()
				}))
		),
		and: await Promise.all(
			filtersAnd
				.filter((filter) => filter.id)
				.map(async (filter) => ({
					id: Number(filter.id),
					entity: whichEntityIs(filter.entity),
					name: `${await getTitle([filter.id], whichEntityIs(filter.entity)).then(() =>
						getTitleString(Number(filter.id), whichEntityIs(filter.entity))
					)}`,
					color: pickColor()
				}))
		),
		not: await Promise.all(
			filtersNot
				.filter((filter) => filter.id)
				.map(async (filter) => ({
					id: Number(filter.id),
					entity: whichEntityIs(filter.entity),
					name: `${await getTitle([filter.id], whichEntityIs(filter.entity)).then(() =>
						getTitleString(Number(filter.id), whichEntityIs(filter.entity))
					)}`
				}))
		)
	};
	console.log(newFilters, 'prova');
	filters.set(newFilters);
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
		color: typeof pickColor === 'function' ? pickColor() : undefined
	};

	if (filter.entity == 'person') {
		filter.entity = await isMoreAPersonOrAComposer(filter.id);
	}

	filters.update((currentFilters) => {
		const filterExistsInMethod = currentFilters[method as keyof Filters]?.some(
			(f) => f.id === filter.id && f.entity === filter.entity
		);
		const filterExistsInNot = currentFilters['not'].some(
			(f) => f.id === filter.id && f.entity === filter.entity
		);
		if (filterExistsInMethod || filterExistsInNot) {
			return currentFilters;
		} else {
			const updatedFilters = { ...currentFilters };
			updatedFilters[method as keyof Filters].push(filter);
			return updatedFilters;
		}
	});

	updateFilteredEventsAndUdateDataForGraph();
};

const moveFilterElement = (selected: Filter, method: Method, moveTo: Method) => {
	filters.update((currentFilters) => {
		const index = currentFilters[method].findIndex(
			(f) => f.id === selected.id && f.entity === selected.entity
		);
		if (index === -1) {
			return currentFilters;
		}
		const filterToMove = currentFilters[method][index];
		currentFilters[method].splice(index, 1);
		currentFilters[moveTo].push(filterToMove);
		return currentFilters;
	});
	updateFilteredEventsAndUdateDataForGraph();
};

const removeFilterElement = (selected: Filter, method: Method) => {
	let _colorFilters;
	colorFilters.subscribe((res) => {
		_colorFilters = res;
	});
	filters.update((currentFilters) => {
		const index = currentFilters[method].findIndex(
			(f) => f.id === selected.id && f.entity === selected.entity
		);
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

const changeFilterPersonOrComposer = (selected: Filter, method: Method) => {
	filters.update((currentFilters) => {
		const methodFilters = currentFilters[method];
		if (!methodFilters) return currentFilters;

		const newMethodFilters: Filter[] = methodFilters.map((f) => {
			if (f.id === selected.id && f.entity === selected.entity) {
				const newState = f.entity === 'person' ? 'composer' : 'person';
				return { ...f, entity: newState };
			}
			return f;
		});

		currentFilters[method] = newMethodFilters;
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
	isAFilterDragged,
	UpdateSelectedMethodFilter,
	addFilterElement,
	removeFilterElement,
	updateEntitiesForSearchBox,
	changeFilterPersonOrComposer,
	urlifyerFilters,
	deUrlifyerFilters,
	moveFilterElement
};
