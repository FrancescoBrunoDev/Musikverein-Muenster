import { writable } from 'svelte/store';
import { entitiesForSearchBox, filters } from '$stores/storeFilters';
import { urlBaseAPIMusiconn } from '$stores/storeGeneral';
import { projectID } from '$stores/storeEvents';

const suggestions = writable<AutocompleteResult[]>([]);
const inputValue = writable<string>('');
const isSearchSectionInEventsList = writable<boolean>(false);
const isSearchSectionInEventsListOpen = writable<boolean>(false);

const autocomplete = async (query: string) => {
	let _entitiesForSearchBox: string[] = [];
	entitiesForSearchBox.subscribe((res: string[]) => {
		_entitiesForSearchBox = res;
	});

	function removeFormSuggestionIfInFilters(results: AutocompleteResult[]) {
		let _results: AutocompleteResult[] = results;
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
			_results = filteredResults;
		});
		return _results;
	}
	const entities = _entitiesForSearchBox.join('|');
	if (entities.length !== 0) {
		try {
			let _projectID: number = 1;
			projectID.subscribe((res: number) => {
				_projectID = res;
			});

			const res = await fetch(
				`${urlBaseAPIMusiconn}?action=autocomplete&title=${query}&entities=${entities}&max=20${projectID ? `&project=${_projectID}` : ''}&format=json`
			);
			const results = await res.json();
			const filteredSuggestions = removeFormSuggestionIfInFilters(results);
			suggestions.set(filteredSuggestions);
		} catch (error) {
			console.error(
				'Error fetching all events with the project id:',
				error,
				'try without project id'
			);
			try {
				const res = await fetch(
					`${urlBaseAPIMusiconn}?action=autocomplete&title=${query}&entities=${entities}&max=20&format=json`
				);
				const results = await res.json();
				const filteredSuggestions = removeFormSuggestionIfInFilters(results);
				suggestions.set(filteredSuggestions);
			} catch (error) {
				console.error('Error fetching all events with the project id:', error);
				return [];
			}
		}
	}
};

export {
	suggestions,
	inputValue,
	isSearchSectionInEventsList,
	isSearchSectionInEventsListOpen,
	autocomplete
};
