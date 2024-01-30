<script lang="ts">
	import ActiveFilters from '$components/searchAndFilters/ActiveFilters.svelte';
	import SearchBox from '$components/searchAndFilters/SearchBox.svelte';
	import {
		isSearchSectionInEventsList,
		isSearchSectionInEventsListOpen
	} from '$stores/storeSearchSection';
	import FiltersShareButton from '$components/searchAndFilters/FiltersShareButton.svelte';
	import { slide, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<div
	class="flex w-full flex-col {$isSearchSectionInEventsListOpen || !$isSearchSectionInEventsList
		? 'gap-y-2'
		: ''} "
>
	{#if $isSearchSectionInEventsList}
		<ActiveFilters />
	{/if}
	{#if $isSearchSectionInEventsListOpen}
		<div transition:slide={{ duration: 500, easing: cubicOut }}>
			<SearchBox />
		</div>
	{:else if !$isSearchSectionInEventsList}
		<div transition:fly={{ y: -10, opacity: 0, duration: 500, easing: cubicOut, delay: 250 }}>
			<SearchBox />
		</div>
	{/if}
	{#if !$isSearchSectionInEventsList}
		<ActiveFilters />
		<div class="place-self-end">
			<FiltersShareButton />
		</div>
	{/if}
</div>
