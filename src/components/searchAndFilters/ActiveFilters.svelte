<script lang="ts">
	import { filters } from '$stores/storeFilters';
	import FilterGroup from '$components/searchAndFilters/FilterGroup.svelte';
	type GroupedFilters = { [key: string]: Filter[] };

	let groupedFiltersOR: GroupedFilters;
	let groupedFiltersNOT: GroupedFilters;
	let groupedFiltersAND: GroupedFilters;

	// Create a function to group filters by their 'entity' property
	function groupFiltersByEntity(filters: Filters, method: Method): GroupedFilters {
		const groupedFilters: GroupedFilters = {};
		filters[method]?.forEach((filter: Filter) => {
			if (!groupedFilters[filter.entity]) {
				groupedFilters[filter.entity] = [];
			}

			groupedFilters[filter.entity].push(filter);
		});

		return groupedFilters;
	}
	$: {
		groupedFiltersNOT = groupFiltersByEntity($filters, 'not');
		groupedFiltersOR = groupFiltersByEntity($filters, 'or');
		groupedFiltersAND = groupFiltersByEntity($filters, 'and');
	}
</script>

<div class="flex flex-col gap-y-2">
	<FilterGroup groupedFilters={groupedFiltersOR} method="or" color="primary" />
	<FilterGroup groupedFilters={groupedFiltersAND} method="and" color="primary" />
	<FilterGroup groupedFilters={groupedFiltersNOT} method="not" color="destructive" />
</div>
