<script lang="ts">
	import ActiveFilters from '$components/searchAndFilters/ActiveFilters.svelte';
	import SearchBox from '$components/searchAndFilters/SearchBox.svelte';
	import {
		isSearchSectionInEventsList,
		heightSearchSection,
		isSearchSectionInEventsListOpen
	} from '$stores/storeSearchSection';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<div class="w-full" bind:clientHeight={$heightSearchSection}>
	{#if $isSearchSectionInEventsList}
		<ActiveFilters />
	{/if}
	{#if $isSearchSectionInEventsListOpen || !$isSearchSectionInEventsList}
		<SearchBox />
	{/if}
	{#if !$isSearchSectionInEventsList}
		<ActiveFilters />
	{/if}
</div>
