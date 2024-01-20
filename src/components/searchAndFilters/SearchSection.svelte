<script lang="ts">
	import ActiveFilters from '$components/searchAndFilters/ActiveFilters.svelte';
	import SearchBox from '$components/searchAndFilters/SearchBox.svelte';
	import {
		isSearchSectionInEventsList,
		isSearchSectionInEventsListOpen
	} from '$stores/storeSearchSection';
</script>

<div class="w-full">
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
