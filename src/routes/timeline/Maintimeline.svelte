<script lang="ts">
	import LineGraph from '$components/graph/LineGraph.svelte';
	import SearchSection from '$components/searchAndFilters/SearchSection.svelte';
	import { isSearchSectionInEventsList } from '$stores/storeSearchSection';

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

<div
	class="flex h-[60dvh] w-screen items-center justify-center pt-20 content-end transition-all duration-500"
	style={`opacity: ${opacitySearchSection};
                filter: blur(${blurSearchSection}px);
                transform: scale(${scaleSearchSection});`}
>
	<div
		id="searchSectionInTimeline"
		class="w-5/6 md:w-2/3 lg:w-1/2 {$isSearchSectionInEventsList ? 'invisible' : 'visible'}"
	>
		<SearchSection />
	</div>
</div>
<div
	on:mouseover={handleMouseOver}
	on:mouseout={handleMouseOut}
	on:blur={handleMouseOut}
	on:focus={handleMouseOver}
	style={`transform: scale(${scaleGraphSection}); bottom: ${bottomDistance}rem;`}
	role="presentation"
	class="flex h-[40dvh] items-center justify-center transition-all duration-500"
>
	<LineGraph />
</div>
