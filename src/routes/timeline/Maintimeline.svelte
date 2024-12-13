<script lang="ts">
	import LineGraphD3 from '$components/graphs/line/LineGraphD3.svelte';
	import SearchSection from '$components/searchAndFilters/SearchSection.svelte';
	import { isSearchSectionInEventsList } from '$stores/storeSearchSection';
	import { slide } from 'svelte/transition';
	import { filteredEventsForGraph, selectedGraphType } from '$stores/storeGraph';
	import { filters } from '$stores/storeFilters';
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
	let bottomDistance = $derived(isOver ? 8 : 7);

	let dataForLines = $derived.by(() => {
		let series = [];
		let hasFiltersOr = $filters.or ? Object.keys($filters.or).length > 0 : false;
		let hasOnlyFiltersAnd =
			$filters.and && Object.keys($filters.and).length > 0 && !hasFiltersOr ? true : false;

		series.push({
			name: 'All',
			color: 'hsl(var(--text))',
			data: $filteredEventsForGraph.map((event: { x: number; eventCount: any }) => ({
				year: event.x,
				value: event.eventCount
			}))
		});

		if (hasOnlyFiltersAnd) return series;

		for (let item of $filteredEventsForGraph) {
			for (let filterName in item.filters) {
				let filter = item.filters[filterName];
				let existingSeries:
					| { name: string; color: string; data: { year: number; value: any }[] }
					| undefined = series.find((s) => s.name === filterName);
				if (!existingSeries) {
					existingSeries = {
						name: filterName,
						color: filter.color || 'hsl(var(--border))',
						data: []
					};
					if (filter.color) {
						series.push(existingSeries);
					} else {
						series.unshift(existingSeries);
					}
				}
				existingSeries.data.push({
					year: item.x,
					value: filter.count
				});
			}
		}

		if (hasFiltersOr) {
			series = series.filter((s) => s.name !== 'All');
		}

		return series;
	});

	let allLocations: { name: string; id: number; geometries: any; amount: number }[] = $state([]);

	async function updateLocations() {
		let locations: { name: string; id: number; geometries: any; amount: number }[] = [];

		for (const [years, events] of Object.entries($filteredEvents)) {
			for (const event of events) {
				if (event.locations) {
					for (const location of event.locations) {
						const existingLocation = locations.find((l) => l.id === Number(location.location));
						if (!existingLocation) {
							const arrayId = [location.location];
							await getTitle(arrayId, 'location');
							const name = await getTitleString(Number(location.location), 'location');

							locations.push({
								name: name,
								id: location.location,
								geometries: location.location,
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
		updateLocations();
	});

	$inspect(allLocations);
</script>

<div class="flex h-dvh flex-col py-12 overflow-hidden">
	<div
		transition:slide
		class="flex flex-grow content-end items-center justify-center transition-all duration-500"
		style={`opacity: ${opacitySearchSection};
                filter: blur(${blurSearchSection}px);
                transform: scale(${scaleSearchSection});`}
	>
		<div
			id="searchSectionInTimeline"
			class="lg:w-[600px] md:w-[500px] w-5/6 {$isSearchSectionInEventsList
				? 'invisible'
				: 'visible'}"
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
		class="flex h-fit items-center justify-center transition-all duration-500"
	>
		{#if $selectedGraphType === 'Line'}
			<LineGraphD3 data={dataForLines} />
		{:else if $selectedGraphType === 'Map'}
			<Map />
		{/if}
	</div>
	<div class="w-full flex justify-center mt-4">
		<GraphSelector />
	</div>
</div>
