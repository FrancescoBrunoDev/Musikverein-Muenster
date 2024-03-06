<script lang="ts">
	import { Position } from '@unovis/ts';
	import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/svelte';
	import { filteredEventsForGraph } from '$stores/storeGraph';
	import { filters } from '$stores/storeFilters';
	import { showLinesAsPerformances } from '$stores/storeGraph';
	import { startYear, endYear } from '$stores/storeEvents';

	let data: DataRecordCoordinates[] = []; // Declare data as a variable outside of onMount

	const x = (dataSingleYear: DataRecordCoordinates) => dataSingleYear.x;
	let y:
		| ((dataSingleYear: DataRecordCoordinates) => number | undefined)
		| ((dataSingleYear: DataRecordCoordinates) => number | undefined)[];
	let colorLine: string[] | string = [] || '';

	function getY(filter: Filter): (dataSingleYear: DataRecordCoordinates) => number | undefined {
		return (dataSingleYear: DataRecordCoordinates) => dataSingleYear.filters[filter.name]?.count;
	}

	function getArrayOfActiveFilterColors(filters: Filter[]): string[] {
		let array: string[] = [];
		filters.forEach((filter) => {
			array.push(filter.color ?? '');
		});
		return array;
	}

	// ricordati di guardare se puoi fare questo https://unovis.dev/docs/auxiliary/Tooltip#components
	function tooltipTemplate(dataSingleYear: DataRecordCoordinates): string {
		let arrayEventsPerFilter: {
			text: string | undefined | number;
			color: string | undefined;
		}[] = [];
		if ($filters.or && $filters.or.length === 0 && $filters.and && $filters.and.length === 0) {
			arrayEventsPerFilter.push({
				text: `All Events: ${dataSingleYear.eventCount}`,
				color: 'hsl(var(--text)'
			});
		} else {
			if ($filters.or.length > 0) {
				$filters.or.forEach((filter: Filter) => {
					let filterName = filter.name;
					// if filter name is an object
					if (typeof filterName === 'object') {
						if (filter.entity === 'person' || filter.entity === 'composer') {
							filterName = filter.name.lastName + ', ' + filter.name.abbreviatedFirstName;
						} else if (filter.entity === 'work') {
							filterName = filter.name.title + ', ' + filter.name.composer.lastName;
						}
					} else {
						filterName = filterName;
					}

					arrayEventsPerFilter.push({
						text: `${filterName}: ${dataSingleYear.filters[filter.name].count}`,
						color: filter.color
					});
				});
				arrayEventsPerFilter.push({
					text: `Or Filter: ${dataSingleYear.filters['or'].count}`,
					color: 'hsl(var(--text)'
				});
			}
			if ($filters.and.length > 0) {
				arrayEventsPerFilter.push({
					text: `And Filter: ${dataSingleYear.filters['and'].count}`,
					color: 'hsl(var(--text)'
				});
			}
		}

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
				if ($showLinesAsPerformances) {
					let _filters = [...$filters.or];
					if ($filters.and.length > 0) {
						const andFilter = {
							name: 'and',
							color: 'hsl(var(--text)',
							id: 0,
							entity: 'and' as Entity
						};
						_filters.push(andFilter);
					}
					y = _filters.map(getY);
					colorLine = getArrayOfActiveFilterColors(_filters);
				} else {
					let _filters = [];
					if ($filters.or.length > 0) {
						const orFilter = {
							name: 'or',
							color: 'hsl(var(--text)',
							id: 0,
							entity: 'or'
						};
						_filters.push(orFilter);
					}
					if ($filters.and.length > 0) {
						const andFilter = {
							name: 'and',
							color: 'hsl(var(--text)',
							id: 0,
							entity: 'and'
						};
						_filters.push(andFilter);
					}
					y = _filters.map(getY);
					colorLine = getArrayOfActiveFilterColors(_filters as Filter[]);
				}
			} else {
				y = (dataSingleYear: DataRecordCoordinates) => dataSingleYear.eventCount;
				colorLine = 'hsl(var(--text)';
			}

			data = $filteredEventsForGraph;
		}
		updateGraph();
	}
</script>

<div class="flex h-full justify-center">
	<div class="relative">
		<div
			class="absolute z-10 ml-8 h-full w-32 bg-gradient-to-r from-background from-10% to-transparent"
		/>
		<div
			class="absolute right-0 z-10 mr-8 h-full w-32 bg-gradient-to-l from-background from-10% to-transparent"
		/>
		<div class="z-10 w-screen max-w-5xl px-8">
			<VisXYContainer
				{data}
				height={250}
				scaleByDomain={true}
				xDomain={[$startYear, $endYear + 10]}
				yDomain={[0, 30]}
			>
				<VisLine {x} {y} color={colorLine} fallbackValue={0} />
				<VisCrosshair color={colorLine} template={tooltipTemplate} />
				<VisTooltip verticalShift={300} horizontalPlacement={Position.Right} />
				<VisAxis gridLine={false} domainLine={false} tickLine={undefined} type="x" />
			</VisXYContainer>
		</div>
	</div>
</div>
