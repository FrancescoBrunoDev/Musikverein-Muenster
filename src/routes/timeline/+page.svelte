<script>
	import LineGraph from './LineGraph.svelte';
	import SearchSection from './SearchSection.svelte';
	import { onMount } from 'svelte';
	import {
		fetchAndStoreEvents,
		updateFilteredEventsAndUdateDataForGraph
	} from '$stores/storeGraph';

	let opacitySearchSection = 1;
	let blurSearchSection = 0;
	let scaleSearchSection = 1;
	let scaleGraphSection = 1;
	let bottomDistance = 7;
	let fromGradient = 'transparent';

	function handleMouseOver() {
		opacitySearchSection = 0.3;
		blurSearchSection = 4;
		scaleSearchSection = 0.99;
		scaleGraphSection = 1.05;
		bottomDistance = 8;
		fromGradient = 'hsl(var(--primary))';
	}

	function handleMouseOut() {
		opacitySearchSection = 1;
		blurSearchSection = 0;
		scaleSearchSection = 1;
		scaleGraphSection = 1;
		bottomDistance = 7;
		fromGradient = 'transparent';
	}

	onMount(async () => {
		await fetchAndStoreEvents().then(() => {
			updateFilteredEventsAndUdateDataForGraph();
		});
	});

</script>

<div class="relative h-screen w-screen">
	<div
		class="grid h-2/3 place-items-center content-center transition-all duration-500"
		style={`opacity: ${opacitySearchSection};
                filter: blur(${blurSearchSection}px);
                transform: scale(${scaleSearchSection});`}
	>
		<SearchSection />
	</div>

	<div
		on:mouseover={handleMouseOver}
		on:mouseout={handleMouseOut}
		on:blur={handleMouseOut}
		on:focus={handleMouseOver}
		style={`transform: scale(${scaleGraphSection}); bottom: ${bottomDistance}rem;`}
		role="presentation"
		class="absolute transition-all duration-500"
	>
		<LineGraph />
	</div>
</div>
