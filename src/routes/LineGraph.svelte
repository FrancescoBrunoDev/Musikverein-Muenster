<script lang="ts">
	import { Position } from '@unovis/ts';
	import { fade } from 'svelte/transition';
	import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/svelte';
	import { onMount } from 'svelte';
	import {
		fetchAndStoreEvents,
		filters,
		filteredEventsForGraph,
		updateFilteredEventsAndUdateDataForGraph
	} from '../store';

	onMount(async () => {
		await fetchAndStoreEvents().then(() => {
			updateFilteredEventsAndUdateDataForGraph();
		});
	});

	let data: DataRecordChart[] = []; // Declare data as a variable outside of onMount

	const x = (d: DataRecordCoordinates) => d.x;
	let y;
	let colorLine: string[] = [];

	function getY(c: Filter): (d: DataRecord) => string {
		return (d: DataRecord) => d.filters[c.name].count;
	}

	function getArrayOfActiveFilterColors(filters: Filter[]): string[] {
		let array: string[] = [];
		filters.forEach((filter) => {
			array.push(filter.color);
		});
		return array;
	}

	function tooltipTemplate(d: DataRecordCoordinates): string {
		let arrayEventsPerFilter: [
			{
				text: string | undefined;
				color: string | undefined;
			}
		] = [];
		if ($filters.length === 0) {
			arrayEventsPerFilter.push({ text: d.eventCount, color: d.color });
		} else {
			$filters.forEach((filter) => {
				arrayEventsPerFilter.push({
					text: `${filter.name}: ${d.filters[filter.name].count}`,
					color: filter.color
				});
			});
		}
		return `
      <div class="w-fit">
        <div class="text-sm font-bold">${d.x}</div>
        <div class="text-sm">${arrayEventsPerFilter
					.map((filter) => {
						return `
              <div class="flex items-center gap-1">
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

	$: {
		async function updateGraph() {
			if ($filters.length === 0) {
				y = (d: DataRecordCoordinates) => d.eventCount;
				colorLine = (d: DataRecordCoordinates) => d.color;
			} else {
				y = $filters.map(getY);
				colorLine = getArrayOfActiveFilterColors($filters);
			}
			data = $filteredEventsForGraph;
		}
		updateGraph();
	}
</script>

<div class="relative">
	{#if data && data.length > 0}
		<div class="absolute z-50 h-full w-32 bg-gradient-to-r from-black to-transparent" />
		<div class="absolute right-0 z-50 h-full w-32 bg-gradient-to-l from-black to-transparent" />
		<div class="z-10 w-screen">
			<VisXYContainer
				{data}
				height={300}
				scaleByDomain={true}
				xDomain={[1850, 1910]}
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
