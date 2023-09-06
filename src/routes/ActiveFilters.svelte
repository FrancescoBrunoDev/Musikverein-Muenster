<script lang="ts">
	import { filters, removeFilterElement } from '../store';

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
		<div class="mt-2 grid">
			<h2 class="text-white">{entity}</h2>
			<div class="flex gap-2 flex-wrap">
				{#each groupedFilters[entity] as filter}
					<div
						id={filter.id}
						class="inline-block rounded-full px-3 py-1 text-sm font-semibold bg-slate-100"
					>
						<button on:click={() => removeFilterElement(filter.id)}>
							{filter.name}
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
