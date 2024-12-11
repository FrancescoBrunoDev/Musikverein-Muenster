<script lang="ts">
	import { Position } from '@unovis/ts';
	import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/svelte';
	import { filteredEventsForGraph } from '$stores/storeGraph';
	import { filters } from '$stores/storeFilters';
	import { showLinesAsPerformances } from '$stores/storeGraph';
	import { startYear, endYear } from '$stores/storeEvents';
	import LL from '$lib/i18n/i18n-svelte';

	// Use $derived for reactive values that depend on other reactive state
	const x = $derived((dataSingleYear: DataRecordCoordinates) => dataSingleYear.x);
	const y = $derived((dataSingleYear: DataRecordCoordinates) => dataSingleYear.eventCount);

	// Use $state for mutable state that triggers updates
	let colorLine = $state('hsl(var(--text))');

	// Ensure reactivity by using $derived for domains
	const xDomain = $derived([$startYear, $endYear + 10] as [number, number]);
	const yDomain = $derived([0, 30] as [number, number]);
	$inspect($filteredEventsForGraph);
</script>

<div class="flex h-full justify-center">
	<div class="relative">
		<div
			class="absolute z-10 ml-8 h-full w-32 bg-gradient-to-r from-background from-10% to-transparent"
		></div>
		<div
			class="absolute right-0 z-10 mr-8 h-full w-32 bg-gradient-to-l from-background from-10% to-transparent"
		></div>
		<div class="z-10 w-screen max-w-5xl px-8">
			{#if $filteredEventsForGraph.length > 0}
				<VisXYContainer height={250} {xDomain} {yDomain}>
					<VisLine data={$filteredEventsForGraph} {x} {y} color={colorLine} fallbackValue={0} />
				</VisXYContainer>
			{/if}
		</div>
	</div>
</div>
