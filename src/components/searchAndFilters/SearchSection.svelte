<script lang="ts">
	import ActiveFilters from '$components/searchAndFilters/ActiveFilters.svelte';
	import SearchBox from '$components/searchAndFilters/SearchBox.svelte';
	import { isSearchSectionInEventsList, heightSearchSection } from '$stores/storeSearchSection';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let y = $isSearchSectionInEventsList ? 200 : -200;

	$: console.log($heightSearchSection);
</script>

<div
	bind:clientHeight={$heightSearchSection}
	transition:fly={{ y: y, duration: 500, easing: cubicOut }}
	class="w-5/6 md:w-2/3 lg:w-1/2"
>
	{#if $isSearchSectionInEventsList}
		<ActiveFilters />
	{/if}
	<SearchBox />
	{#if !$isSearchSectionInEventsList}
		<ActiveFilters />
	{/if}
</div>
