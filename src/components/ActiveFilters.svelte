<script lang="ts">
	import { filters } from '$stores/storeFilters';
	import { slide } from 'svelte/transition';
	import ActiveFilter from '$components/ActiveFilter.svelte';

	$: groupedFiltersOR = {};
	$: groupedFiltersNOT = {};

	// Create a function to group filters by their 'entity' property
	function groupFiltersByEntity(filters, method: string) {
		const groupedFilters = {};
		filters[method]?.forEach((filter: Filter) => {
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
		console.log(groupedFiltersOR, groupedFiltersNOT, 'filters');
	}
</script>

<div class="mt-4 grid grid-cols-1 gap-y-8">
	{#if groupedFiltersOR && Object.keys(groupedFiltersOR).length > 0}
		<div class="border-l-4 border-primary pb-2 text-primary">
			<span
				class="absolute h-fit w-9 -translate-x-7 -rotate-90 pb-1 pr-2 text-end text-xs font-bold uppercase"
				>or</span
			>
			{#each Object.keys(groupedFiltersOR) as entity}
				<div class="grid pl-2" transition:slide={{ axis: 'y', delay: 150 }}>
					<h2 class="mb-2 text-sm font-bold text-primary">
						{entity === 'person' ? 'perfomer' : entity}
					</h2>

					<div class="flex flex-wrap gap-2">
						{#each groupedFiltersOR[entity] as filter}
							<ActiveFilter {filter} method="or" />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if groupedFiltersNOT && Object.keys(groupedFiltersNOT).length > 0}
		<div class="border-l-4 border-destructive pb-2 text-destructive">
			<span
				class="absolute h-fit w-9 -translate-x-7 -rotate-90 pb-1 pr-2 text-end text-xs font-bold uppercase"
				>not</span
			>
			{#each Object.keys(groupedFiltersNOT) as entity}
				{#if groupedFiltersNOT[entity]}
					<div class="grid pl-2" transition:slide={{ axis: 'y', delay: 150 }}>
						<h2 class="mb-2 text-sm font-bold text-primary">
							{entity === 'person' ? 'perfomer' : entity}
						</h2>

						<div class="flex flex-wrap gap-2">
							{#each groupedFiltersNOT[entity] as filter}
								<ActiveFilter {filter} method="not" />
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
