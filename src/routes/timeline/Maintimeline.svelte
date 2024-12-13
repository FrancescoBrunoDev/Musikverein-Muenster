<script lang="ts">
	import LineGraphD3 from '$components/graph/LineGraphD3.svelte';
	import SearchSection from '$components/searchAndFilters/SearchSection.svelte';
	import { isSearchSectionInEventsList } from '$stores/storeSearchSection';
	import { slide } from 'svelte/transition';
	import { filteredEventsForGraph } from '$stores/storeGraph';
	import { filters } from '$stores/storeFilters';

	let opacitySearchSection = $state(1);
	let blurSearchSection = $state(0);
	let scaleSearchSection = $state(1);
	let scaleGraphSection = $state(1);
	let bottomDistance = $state(7);

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

	let data = $derived.by(() => {
		let series = [];
		let hasFiltersOr = $filters.or ? Object.keys($filters.or).length > 0 : false;
		let hasOnlyFiltersAnd =
			$filters.and && Object.keys($filters.and).length > 0 && !hasFiltersOr ? true : false;

		series.push({
			name: 'Main',
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
			series = series.filter((s) => s.name !== 'Main');
		}

		return series;
	});
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
		onmouseover={handleMouseOver}
		onmouseout={handleMouseOut}
		onblur={handleMouseOut}
		onfocus={handleMouseOver}
		style={`transform: scale(${scaleGraphSection}); bottom: ${bottomDistance}rem;`}
		role="presentation"
		class="flex h-fit items-center justify-center transition-all duration-500"
	>
		<LineGraphD3 {data} />
	</div>
</div>
