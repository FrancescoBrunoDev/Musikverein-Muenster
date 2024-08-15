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
		? 'gap-y-4'
		: ''} "
>
	{#if $isSearchSectionInEventsList}
		<div class={!$isSearchSectionInEventsListOpen ? 'pb-2' : ''}>
			<ActiveFilters />
		</div>
	{/if}
	{#if $isSearchSectionInEventsListOpen}
		<div transition:slide={{ duration: 200, easing: cubicOut }}>
			<SearchBox />
		</div>
	{:else if !$isSearchSectionInEventsList}
		<div in:fly={{ y: -10, opacity: 0, duration: 400, easing: cubicOut, delay: 600 }}>
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
