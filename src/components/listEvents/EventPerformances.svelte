<script>
	import { Circle, ChevronUp } from 'lucide-svelte';
	import { filters } from '$stores/storeFilters';
	import { workTitles } from '$stores/storeEvents';
	import EventPerformancesPersons from '$components/listEvents/EventPerformancesPersons.svelte';
	export let event;

	async function getTitleComposition(uid) {
		const { title } = $workTitles[uid];
		return title;
	}

	let isPerformanceOpen = false;

	function handleClickAllPerformances() {
		isPerformanceOpen = !isPerformanceOpen;
	}
</script>

{#each event.performances as performance}
	{#await getTitleComposition(performance.work) then title}
		{#if $filters.or.length === 0}
			<span key={performance.work}>{title} <EventPerformancesPersons {performance} /></span>
		{:else}
			{#each $filters.or as filter}
				{#if filter.entity === 'composer' && filter.id == performance.composers[0].person}
					<span class="flex flex-row items-center gap-1">
						<Circle class="flex-shrink-0" fill={filter.color} size={10} stroke-opacity={0} />
						<span>{title} <EventPerformancesPersons {performance} /></span>
					</span>
				{:else if filter.entity === 'work' && filter.id == performance.work}
					<span class="flex flex-row items-center gap-1">
						<Circle class="flex-shrink-0" fill={filter.color} size={10} stroke-opacity={0} />
						<span>{title}</span>
					</span>{:else if isPerformanceOpen}
					<span>{title} <EventPerformancesPersons {performance} /></span>
				{/if}
			{/each}
		{/if}
	{:catch error}
		<div>Error: {error.message}</div>
	{/await}
{/each}
{#if $filters.or.length > 0}
	<button on:click={() => handleClickAllPerformances()}>
		{#if isPerformanceOpen}
			<ChevronUp class="h-8 w-full items-center" />
		{:else}
			Show all performances
		{/if}
	</button>
{/if}
