<script lang="ts">
	import { filters, removeFilterElement, changeFilterPersonOrComposer } from '../store';
	import { slide } from 'svelte/transition';

	// Create a function to group filters by their 'entity' property
	function groupFiltersByEntity(filters) {
		const groupedFilters = {};

		filters.forEach((filter) => {
			if (!groupedFilters[filter.entity]) {
				groupedFilters[filter.entity] = [];
			}

			groupedFilters[filter.entity].push(filter);
		});

		return groupedFilters;
	}

	// Get the grouped filters
	$: groupedFilters = groupFiltersByEntity($filters);
</script>

<div>
	{#each Object.keys(groupedFilters) as entity}
		<div class="mt-4 grid pl-2" transition:slide={{ axis: 'y', delay: 150 }}>
			<h2 class="mb-2 text-sm font-bold text-white">
				{entity === 'person' ? 'perfomer' : entity}
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each groupedFilters[entity] as filter}
					<div
						id={filter.id}
						class={'flex items-center gap-1 rounded-full border py-1 pl-1 text-sm text-white' +
							(filter.entity === 'person' || filter.entity === 'composer' ? ' pr-1' : ' pr-3')}
					>
						<div style={`background-color: ${filter.color}`} class="h-5 w-5 rounded-full px-2" />
						<button class="max-w-xs truncate" on:click={() => removeFilterElement(filter.id)}>
							{filter.name}
						</button>
						{#if filter.entity === 'person' || filter.entity === 'composer'}
							<button
								on:click={() => changeFilterPersonOrComposer(filter.id, filter.entity)}
								class="rounded-full bg-white px-2 text-black"
								>as a {#if filter.entity === 'person'}performer{:else if filter.entity === 'composer'}composer{/if}</button
							>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
