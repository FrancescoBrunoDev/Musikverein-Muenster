import { writable } from 'svelte/store';

export interface Filter {
	name: string;
	entity: string;
	id: string;
}

const filters = writable<Filter[]>([]);

const addFilterElement = (selected: any) => {
	const filter: Filter = {
		name: selected.suggestion[0],
		entity: selected.suggestion[1],
		id: selected.suggestion[2]
	};

	filters.update((currentFilters) => {
		const filterExists = currentFilters.some((f) => f.id === filter.id);
		if (filterExists) {
			return currentFilters;
		} else {
			return [...currentFilters, filter];
		}
	});
};

const removeFilterElement = (selected: string) => {
	filters.update((currentFilters) => {
		const filterToRemove = currentFilters.find((f) => f.id === selected);
		const index = currentFilters.indexOf(filterToRemove);
		currentFilters.splice(index, 1);
		return currentFilters;
	});
};

export { filters, addFilterElement, removeFilterElement };
