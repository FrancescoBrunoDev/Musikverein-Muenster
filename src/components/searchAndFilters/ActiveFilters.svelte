<script lang="ts">
	import { filters, isAFilterDragged } from '$stores/storeFilters';
	import FilterGroup from '$components/searchAndFilters/FilterGroup.svelte';
	import { slide } from 'svelte/transition';

	const filterMethods: Method[] = ['or', 'and', 'not'];
	const filterColors = { or: 'primary', and: 'primary', not: 'destructive' };
</script>

{#if $filters.or.length > 0 || $filters.and.length > 0 || $filters.not.length > 0}
	<div class="flex flex-col gap-y-3" transition:slide={{ duration: 600 }}>
		{#each filterMethods as method}
			<FilterGroup {method} color={filterColors[method]} />
		{/each}
	</div>
{/if}
