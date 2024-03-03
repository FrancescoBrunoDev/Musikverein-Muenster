<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { slide, fade } from 'svelte/transition';
	import ActiveFilter from '$components/searchAndFilters/ActiveFilter.svelte';
	import { filters, moveFilterElement, isAFilterDragged } from '$stores/storeFilters';

	type GroupedFilters = { [key: string]: Filter[] };
	export let method: Method;
	export let color = '';
	let groupedFilters: GroupedFilters = {};

	$: {
		groupedFilters = $filters[method]?.reduce((grouped: GroupedFilters, filter: Filter) => {
			if (!grouped[filter.entity]) {
				grouped[filter.entity] = [];
			}

			grouped[filter.entity].push(filter);
			return grouped;
		}, {});
	}

	function handleDrop(event: DragEvent) {
		isAFilterDragged.set(false);
		event.preventDefault();
		const { filter, thisMethod } = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
		moveFilterElement(filter, thisMethod, method);
	}
</script>

<div
	transition:fade={{ duration: 300 }}
	class="relative text-{color} transition-opacity duration-300 {Object.keys(groupedFilters).length >
		0 || $isAFilterDragged
		? 'opacity-100'
		: 'opacity-10'}"
	on:drop={handleDrop}
	on:dragover={(event) => event.preventDefault()}
	role="listbox"
	aria-dropeffect="move"
	tabindex="0"
>
	<div
		class="absolute bottom-0 left-0 top-0 flex h-full -translate-x-5 items-center text-xs font-bold uppercase"
	>
		<span style="writing-mode: vertical-rl;" class="rotate-180"
			>{$LL.filters.methods[method]()}</span
		>
	</div>
	<div class="absolute h-full w-1 rounded-full bg-{color}"></div>
	<div
		class="ml-2 min-h-8 border-spacing-4 border-2 pb-2 {$isAFilterDragged
			? 'rounded border-dotted'
			: 'border-background'}"
	>
		{#each Object.keys(groupedFilters) as entity}
			<div class="grid pl-3" transition:slide={{ axis: 'y', delay: 150 }}>
				<h2 class="mb-2 text-sm font-bold">
					{entity === 'person' ? 'perfomer' : entity}
				</h2>

				<div class="flex flex-wrap gap-2">
					{#each groupedFilters[entity] as filter}
						<ActiveFilter {filter} {method} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
