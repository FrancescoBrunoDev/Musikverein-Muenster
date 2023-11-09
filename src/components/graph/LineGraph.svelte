<script lang="ts">
	import { Position } from '@unovis/ts';
	import { fade } from 'svelte/transition';
	import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/svelte';
	import { filteredEventsForGraph } from '$stores/storeGraph';
	import { filters } from '$stores/storeFilters';

	let data: FilteredEventsForGraph = []; // Declare data as a variable outside of onMount

	const x = (d: DataRecordCoordinates) => d.x;
	let y: ItemFilterForGraph;
	let colorLine: string[] | string = [] || '';
	let yearForZoom: number | null = null;

	function getY(c: Filter): (d: DataRecord) => string {
		return (d: DataRecord) => d.filters[c.name].count;
	}

	function getArrayOfActiveFilterColors(filters: Filter[]): string[] {
		// console.log(filters, "filter in color")
		let array: string[] = [];
		filters.forEach((filter) => {
			array.push(filter.color);
		});
		return array;
	}

	function tooltipTemplate(d: DataRecordCoordinates): string {
		let arrayEventsPerFilter: [
			{
				text: string | undefined | number;
				color: string | undefined;
			}
		] = [];
		if ($filters.or && $filters.or.length === 0) {
			arrayEventsPerFilter.push({ text: d.eventCount, color: d.color });
		} else {
			$filters.or.forEach((filter) => {
				arrayEventsPerFilter.push({
					text: `${filter.name}: ${d.filters[filter.name].count}`,
					color: filter.color
				});
			});
		}
		yearForZoom = d.x;

		return `
      <div class="w-fit">
        <div class="text-sm font-bold"><span>${
					d.x
				}</span></div>
        <div class="text-sm">${arrayEventsPerFilter
					.map((filter) => {
						return `
              <div class="flex items-center gap-1 text-xs">
                <div
                  style="background-color: ${filter.color}"
                  class="h-2 w-2 rounded-full"
                ></div>
                <div>${filter.text}</div>
              </div>`;
					})
					.join('')}
        </div>
      </div>
    `;
	}
	//$: console.log($filteredEventsForGraph, 'filteredEvents');
	$: {
		async function updateGraph() {
			if ($filters.or || $filters.not) {
				if ($filters.or.length === 0) {
					y = (d: DataRecordCoordinates) => d.eventCount;
					colorLine = 'hsl(var(--primary)';
				} else if ($filters.or.length > 0) {
					y = $filters.or.map(getY);
					colorLine = getArrayOfActiveFilterColors($filters.or);
				} else {
					y = (d: DataRecordCoordinates) => d.eventCount;
					colorLine = 'hsl(var(--primary)';
				}
			}
			data = $filteredEventsForGraph;
		}
		updateGraph();
	}

</script>

<div class="relative">
	{#if data && data.length > 0}
		<div class="absolute z-10 ml-8 h-full w-32 bg-gradient-to-r from-background from-10% to-transparent" />
		<div
			class="absolute right-0 z-10 mr-8 h-full w-32 bg-gradient-to-l from-background from-10% to-transparent"
		/>
		<div class="z-10 w-screen px-8">
			<VisXYContainer
				{data}
				height={300}
				scaleByDomain={true}
				xDomain={[1840, 1910]}
				yDomain={[0, 30]}
			>
				<VisLine {x} {y} color={colorLine} fallbackValue={0} />
				<VisCrosshair color={colorLine} template={tooltipTemplate} />
				<VisTooltip verticalShift={300} horizontalPlacement={Position.Right} />
				<VisAxis gridLine={false} domainLine={false} tickLine={undefined} type="x" />
			</VisXYContainer>
		</div>
	{:else}
		<div
			transition:fade={{ delay: 250, duration: 300 }}
			class="flex h-full w-screen items-center justify-center"
		>
			<div class="text-xl text-gray-400">Loading the data</div>
		</div>
	{/if}
</div>
