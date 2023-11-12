<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { slide } from 'svelte/transition';
	import ActiveFilter from '$components/searchAndFilters/ActiveFilter.svelte';

	type GroupedFilters = { [key: string]: Filter[] };

	export let groupedFilters: GroupedFilters;
	export let method: Method;
	export let color = '';
</script>

{#if Object.keys(groupedFilters).length > 0}
	<div class="relative pb-2 text-{color}">
		<div
			class="absolute bottom-0 left-0 top-0 flex h-full -translate-x-5 items-center text-xs font-bold uppercase"
		>
			<span style="writing-mode: vertical-rl;" class="rotate-180">{$LL.filters.methods[method]()}</span>
		</div>
		<div class="absolute h-full w-1 rounded-full bg-{color}"></div>
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
{/if}
