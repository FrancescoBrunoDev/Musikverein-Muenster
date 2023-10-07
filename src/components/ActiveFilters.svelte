<script lang="ts">
	import { filters, removeFilterElement, changeFilterPersonOrComposer } from '$stores/storeGraph';
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
			<h2 class="text-primary mb-2 text-sm font-bold">
				{entity === 'person' ? 'perfomer' : entity}
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each groupedFilters[entity] as filter}
					<div
						id={filter.id}
						class={'text-primary flex items-center gap-1 rounded-full border py-1 pl-1 text-xs' +
							(filter.entity === 'person' || filter.entity === 'composer' ? ' pr-1' : ' pr-3')}
					>
						<div style={`background-color: ${filter.color}`} class="ml-1 h-2 w-2 rounded-full" />
						<button
							class="max-w-xs truncate hover:line-through"
							on:click={() => removeFilterElement(filter.id)}
						>
							{filter.name}
						</button>
						{#if filter.entity === 'person' || filter.entity === 'composer'}
							<button
								on:click={() => changeFilterPersonOrComposer(filter.id, filter.entity)}
								class="bg-foreground text-secondary rounded-full px-2 hover:animate-pulse"
								>as a {#if filter.entity === 'person'}performer{:else if filter.entity === 'composer'}composer{/if}</button
							>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
