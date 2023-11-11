<script lang="ts">
	import { Position } from '@unovis/ts';
	import { fade } from 'svelte/transition';
	import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/svelte';
	import { filteredEventsForGraph } from '$stores/storeGraph';
	import { filters } from '$stores/storeFilters';

	let data: DataRecordCoordinates[] = []; // Declare data as a variable outside of onMount

	const x = (dataSingleYear: DataRecordCoordinates) => dataSingleYear.x;
	let y:
		| ((dataSingleYear: DataRecordCoordinates) => number | undefined)
		| ((dataSingleYear: DataRecordCoordinates) => number | undefined)[];
	let colorLine: string[] | string = [] || '';
	let yearForZoom: number | null = null;

	function getY(filter: Filter): (dataSingleYear: DataRecordCoordinates) => number | undefined {
		return (dataSingleYear: DataRecordCoordinates) => dataSingleYear.filters[filter.name]?.count;
	}

	function getArrayOfActiveFilterColors(filters: Filter[]): string[] {
		let array: string[] = [];
		filters.forEach((filter) => {
			array.push(filter.color);
		});
		return array;
	}

	function tooltipTemplate(dataSingleYear: DataRecordCoordinates): string {
		let arrayEventsPerFilter: {
			text: string | undefined | number;
			color: string | undefined;
		}[] = [];
		if ($filters.or && $filters.or.length === 0 && $filters.and && $filters.and.length === 0) {
			arrayEventsPerFilter.push({
				text: `All Events: ${dataSingleYear.eventCount}`,
				color: 'hsl(var(--primary)'
			});
		} else {
			if ($filters.or.length > 0) {
				$filters.or.forEach((filter) => {
					arrayEventsPerFilter.push({
						text: `${filter.name}: ${dataSingleYear.filters[filter.name].count}`,
						color: filter.color
					});
				});
			}
			if ($filters.and.length > 0) {
				arrayEventsPerFilter.push({
					text: `And Filter: ${dataSingleYear.filters['and'].count}`,
					color: 'hsl(var(--primary)'
				});
			}
		}
		yearForZoom = dataSingleYear.x;

		return `
      <div class="w-fit">
        <div class="text-sm font-bold"><span>${dataSingleYear.x}</span></div>
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
			if ($filters.or.length > 0 || $filters.and.length > 0) {
				// subscribe to the store, and make a const with it and push a filter in it with name "and"
				let _filters = [...$filters.or];
				if ($filters.and.length > 0) {
					const andFilter = {
						name: 'and',
						color: 'hsl(var(--primary)',
						id: 0,
						entity: 'and'
					};
					_filters.push(andFilter);
				}
				y = _filters.map(getY);
				colorLine = getArrayOfActiveFilterColors(_filters);
			} else {
				y = (dataSingleYear: DataRecordCoordinates) => dataSingleYear.eventCount;
				colorLine = 'hsl(var(--primary)';
			}

			data = $filteredEventsForGraph;
		}
		updateGraph();
	}
</script>

<div class="relative">
	{#if data && data.length > 0}
		<div
			class="absolute z-10 ml-8 h-full w-32 bg-gradient-to-r from-background from-10% to-transparent"
		/>
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
