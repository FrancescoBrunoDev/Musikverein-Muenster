<script lang="ts">
	import { filters } from '$stores/storeFilters';
	import { slide } from 'svelte/transition';
	import ActiveFilter from '$components/searchAndFilters/ActiveFilter.svelte';

	type GroupedFilters = { [key: string]: Filter[] };

	let groupedFiltersOR: GroupedFilters = {};
	let groupedFiltersNOT: GroupedFilters = {};

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
	}
</script>

<div class="mt-4 grid grid-cols-1 gap-y-8">
	{#if groupedFiltersOR && Object.keys(groupedFiltersOR).length > 0}
		<div class="relative pb-2 text-primary">
			<div
				class="absolute flex h-full w-10 -translate-x-7 items-center text-end text-xs font-bold uppercase"
			>
				<span class="w-10 -rotate-90 text-center">or</span>
			</div>
			<div class="absolute h-full w-1 rounded-full bg-primary"></div>
			{#each Object.keys(groupedFiltersOR) as entity}
				<div class="grid pl-3" transition:slide={{ axis: 'y', delay: 150 }}>
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
		<div class="relative pb-2 text-destructive">
			<div
				class="absolute flex h-full w-10 -translate-x-7 items-center text-end text-xs font-bold uppercase"
			>
				<span class="w-10 -rotate-90 text-center">not</span>
			</div>
			<div class="absolute h-full w-1 rounded-full bg-destructive"></div>
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
