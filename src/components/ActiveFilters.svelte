<script lang="ts">
	import { filters } from '$stores/storeFilters';
	import { slide } from 'svelte/transition';
	import ActiveFilter from '$components/ActiveFilter.svelte';

	let groupedFiltersOR = {};
	let groupedFiltersNOT = {};

	// Create a function to group filters by their 'entity' property
	function groupFiltersByEntity(filters, method: string) {
		const groupedFilters = {};
		filters[method]?.forEach((filter: Filter) => {
			console.log('jasndasj');
			if (!groupedFilters[filter.entity]) {
				groupedFilters[filter.entity] = [];
			}

			groupedFilters[filter.entity].push(filter);
		});

		return groupedFilters;
	}
	$: {
		groupedFiltersOR = groupFiltersByEntity($filters, 'or');
		groupedFiltersNOT = groupFiltersByEntity($filters, 'not');
		console.log(groupedFiltersOR, 'groupedFitersOR');
		console.log(groupedFiltersNOT, 'groupedFiltersNOT');
	}
</script>

<div>
	{#each Object.keys(groupedFiltersOR) as entity}
		<div class="mt-4 grid pl-2" transition:slide={{ axis: 'y', delay: 150 }}>
			<h2 class="text-primary mb-2 text-sm font-bold">
				{entity === 'person' ? 'perfomer' : entity}
			</h2>

			<div class="flex flex-wrap gap-2">
				{#each groupedFiltersOR[entity] as filter}
					<ActiveFilter {filter} method="or" />
				{/each}
			</div>
		</div>
	{/each}

	{#each Object.keys(groupedFiltersOR) as entity}
		{#if groupedFiltersNOT[entity]}
			<div class="mt-4 ml-10 border-2 border-primary w-fit px-3 border-b-0 rounded-t-xl font-bold">NOT FILTER</div>
			<div
				class=" border-primary grid rounded-xl border-2 pb-2 pl-2 pt-1"
				transition:slide={{ axis: 'y', delay: 150 }}
			>
				<h2 class="text-primary mb-2 text-sm font-bold">
					{entity === 'person' ? 'perfomer' : entity}
				</h2>

				<div class="flex flex-wrap gap-2">
					{#each groupedFiltersNOT[entity] as filter}
						<ActiveFilter {filter} method="or" />
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
