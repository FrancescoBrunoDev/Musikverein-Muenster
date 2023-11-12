<script lang="ts">
	import LineGraph from '$components/graph/LineGraph.svelte';
	import SearchSection from '$components/searchAndFilters/SearchSection.svelte';
	import CheckBox from '$components/CheckBox.svelte';
	import { isSearchSectionInEventsList, suggestions } from '$stores/storeSearchSection';
	import { showLinesAsPerformances } from '$stores/storeGraph';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	function handleCheckboxChange() {
		$showLinesAsPerformances = !$showLinesAsPerformances;
	}

	let opacitySearchSection = 1;
	let blurSearchSection = 0;
	let scaleSearchSection = 1;
	let scaleGraphSection = 1;
	let bottomDistance = 7;

	function handleMouseOver() {
		opacitySearchSection = 0.3;
		blurSearchSection = 4;
		scaleSearchSection = 0.99;
		scaleGraphSection = 1.05;
		bottomDistance = 8;
	}

	function handleMouseOut() {
		opacitySearchSection = 1;
		blurSearchSection = 0;
		scaleSearchSection = 1;
		scaleGraphSection = 1;
		bottomDistance = 7;
	}
</script>

<div class="relative h-screen w-screen">
	<div
		class="grid h-1/2 place-items-center {$suggestions.length > 0
			? 'pb-0'
			: 'pb-20'} content-end transition-all duration-500"
		style={`opacity: ${opacitySearchSection};
                filter: blur(${blurSearchSection}px);
                transform: scale(${scaleSearchSection});`}
	>
		{#if !$isSearchSectionInEventsList}
			<div
				transition:fly={{ y: -200, duration: 500, easing: cubicOut }}
				class="w-5/6 md:w-2/3 lg:w-1/2"
			>
				<SearchSection />
			</div>
		{/if}
	</div>
	{#if !$isSearchSectionInEventsList}
		<div
			transition:fade={{ duration: 1000, delay: 1000, easing: cubicOut }}
			class="container absolute left-0 right-0 z-20 flex w-screen max-w-5xl justify-end"
		>
			<CheckBox title="or filter per performance" on:change={handleCheckboxChange} />
		</div>
		<div
			on:mouseover={handleMouseOver}
			on:mouseout={handleMouseOut}
			on:blur={handleMouseOut}
			on:focus={handleMouseOver}
			style={`transform: scale(${scaleGraphSection}); bottom: ${bottomDistance}rem;`}
			role="presentation"
			class="flex h-1/2 items-center justify-center transition-all duration-500"
		>
			<LineGraph />
		</div>
	{/if}
</div>
