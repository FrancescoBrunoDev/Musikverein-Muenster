<script lang="ts">
	import ActiveFilters from '$components/searchAndFilters/ActiveFilters.svelte';
	import SearchBox from '$components/searchAndFilters/SearchBox.svelte';
	import {
		isSearchSectionInEventsList,
		isSearchSectionInEventsListOpen
	} from '$stores/storeSearchSection';
	import FiltersShareButton from '$components/searchAndFilters/FiltersShareButton.svelte';
</script>

<div class="flex w-full flex-col gap-y-2">
	{#if $isSearchSectionInEventsList}
		<ActiveFilters />
	{/if}
	{#if $isSearchSectionInEventsListOpen || !$isSearchSectionInEventsList}
		<SearchBox />
	{/if}
	{#if !$isSearchSectionInEventsList}
		<ActiveFilters />
		<div class="place-self-end">
			<FiltersShareButton />
		</div>
	{/if}
</div>
