import { writable } from 'svelte/store';

const suggestions = writable<AutocompleteResult[]>([]);
const inputValue = writable<string>('');
const isSearchSectionInEventsList = writable<boolean>(false);
const heightSearchSection = writable<number>(0);
const isSearchSectionInEventsListOpen = writable<boolean>(false);

export {
	suggestions,
	inputValue,
	isSearchSectionInEventsList,
	heightSearchSection,
	isSearchSectionInEventsListOpen
};
