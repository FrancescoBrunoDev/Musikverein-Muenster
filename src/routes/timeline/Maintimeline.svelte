<script lang="ts">
	import LineGraphD3 from '$components/graphs/line/LineGraphD3.svelte';
	import SearchSection from '$components/searchAndFilters/SearchSection.svelte';
	import { isSearchSectionInEventsList } from '$stores/storeSearchSection';
	import { slide } from 'svelte/transition';
	import { selectedGraphType, fetchOverpassData, dataForLineGraph } from '$stores/storeGraph';
	import GraphSelector from '$components/graphs/GraphSelector.svelte';
	import Map from '$components/graphs/map/Maps.svelte';
	import { filteredEvents } from '$stores/storeFilters';
	import { getGeometries, getTitle, getTitleString } from '$stores/storeEvents';
	import { onMount } from 'svelte';

	let isOver = $state(false);
	let opacitySearchSection = $derived(isOver ? 0.3 : 1);
	let blurSearchSection = $derived(isOver ? 4 : 0);
	let scaleSearchSection = $derived(isOver ? 0.99 : 1);
	let scaleGraphSection = $derived(isOver ? 1.05 : 1);
	let bottomDistance = $derived(isOver ? 1 : 0);

	let allLocations: { name: string; id: number; geometries: any; amount: number }[] = $state([]);

	type EventWithLocations = {
		locations: { location: number }[];
	};

	async function updateLocations(_filteredEvents: any) {
		let locations: { name: string; id: number; geometries: any; amount: number }[] = [];

		for (const [years, events] of Object.entries(_filteredEvents)) {
			for (const event of events as EventWithLocations[]) {
				if (typeof event !== 'string' && event.locations) {
					for (const location of event.locations) {
						const existingLocation = locations.find((l) => l.id === Number(location.location));
						if (!existingLocation) {
							const arrayId = [String(location.location)];
							await getTitle(arrayId, 'location');
							const name = await getTitleString(Number(location.location), 'location');
							const geometries = await getGeometries(Number(location.location));

							locations.push({
								name: name,
								id: location.location,
								geometries: geometries,
								amount: 1
							});
						} else {
							existingLocation.amount++;
						}
					}
				}
			}
		}

		allLocations = locations;
	}

	$effect(() => {
		updateLocations($filteredEvents);
	});

	onMount(() => {
		fetchOverpassData({ lat: 51.96245420666666, lng: 7.627307654999999 });
	});
</script>

<div class="flex h-[95dvh] flex-col overflow-hidden pb-12">
	<div
		transition:slide
		class="flex flex-grow content-end items-center justify-center transition-all duration-500"
		style={`opacity: ${opacitySearchSection};
                filter: blur(${blurSearchSection}px);
                transform: scale(${scaleSearchSection});`}
	>
		<div
			id="searchSectionInTimeline"
			class="md:w-[500px] lg:w-[600px] {$isSearchSectionInEventsList ? 'invisible' : 'visible'}"
		>
			<SearchSection />
		</div>
	</div>
	<div
		onmouseover={() => {
			isOver = true;
		}}
		onmouseout={() => {
			isOver = false;
		}}
		onblur={() => {
			isOver = true;
		}}
		onfocus={() => {
			isOver = false;
		}}
		style={`transform: scale(${scaleGraphSection}); bottom: ${bottomDistance}rem;`}
		role="presentation"
		class="relative flex h-fit items-center justify-center transition-all duration-500"
	>
		{#if $selectedGraphType === 'Line'}
			<LineGraphD3 data={$dataForLineGraph} />
		{:else if $selectedGraphType === 'Map'}
			{#if allLocations.length > 0}
				<Map data={allLocations} />
			{:else}
				<div
					class="flex h-[300px] w-11/12 max-w-3xl animate-pulse items-center justify-center rounded-xl bg-border"
				></div>
			{/if}
		{/if}
	</div>
	<div class="mt-4 flex w-full justify-center">
		<GraphSelector />
	</div>
</div>
