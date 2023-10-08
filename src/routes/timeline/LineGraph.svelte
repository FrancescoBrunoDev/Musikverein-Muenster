<script lang="ts">
	import { Position } from '@unovis/ts';
	import { fade } from 'svelte/transition';
	import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/svelte';
	import { onMount } from 'svelte';
	import {
		fetchAndStoreEvents,
		filteredEventsForGraph,
		updateFilteredEventsAndUdateDataForGraph
	} from '$stores/storeGraph';
	import {filters} from "$stores/storeFilters"

	onMount(async () => {
		await fetchAndStoreEvents().then(() => {
			updateFilteredEventsAndUdateDataForGraph();
		});
	});

	let data: DataRecordChart[] = []; // Declare data as a variable outside of onMount

	const x = (d: DataRecordCoordinates) => d.x;
	let y;
	let colorLine: string[] | string = [] || '';

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

		return `
      <div class="w-fit">
        <div class="text-sm font-bold">${d.x}</div>
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

	$: {
		async function updateGraph() {
			if ($filters.or) {
				if ($filters.or.length === 0) {
					y = (d: DataRecordCoordinates) => d.eventCount;
					colorLine = 'hsl(var(--primary)';
				} else {
					y = $filters.or.map(getY);
					colorLine = getArrayOfActiveFilterColors($filters.or);
				}
			}
			data = $filteredEventsForGraph;
		}
		updateGraph();
	}
</script>

<div class="relative">
	{#if data && data.length > 0}
		<div class="from-background absolute z-10 ml-16 h-full w-32 bg-gradient-to-r to-transparent" />
		<div
			class="from-background absolute right-0 z-10 mr-16 h-full w-32 bg-gradient-to-l to-transparent"
		/>
		<div class="z-10 w-screen px-16">
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
