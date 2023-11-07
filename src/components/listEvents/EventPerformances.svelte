<script lang="ts">
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
		{:else if $filters.or.some((filter) => filter.entity === 'composer' && performance.composers && filter.id == performance.composers[0].person) || $filters.or.some((filter) => filter.entity === 'work' && filter.id == performance.work) || $filters.or.some((filter) => filter.entity === 'location' && filter.id == performance.location) || $filters.or.some((filter) => filter.entity === 'person' && performance.persons.some((person) => filter.id == person.person))}
			<div class="flex items-center gap-1">
				<div class="flex flex-col gap-1">
					{#each $filters.or as filter}
						{#if filter.entity === 'composer' && performance.composers && filter.id == performance.composers[0].person}
							<Circle class="flex-shrink-0" fill={filter.color} size={10} stroke-opacity={0} />
						{/if}
						{#if filter.entity === 'work' && filter.id == performance.work}
							<Circle class="flex-shrink-0" fill={filter.color} size={10} stroke-opacity={0} />
						{/if}
						{#if filter.entity === 'location' && filter.id == performance.location}
							<Circle class="flex-shrink-0" fill={filter.color} size={10} stroke-opacity={0} />
						{/if}
						{#if filter.entity === 'person'}
							{#each performance.persons as person}
								{#if filter.id == person.person}
									<Circle class="flex-shrink-0" fill={filter.color} size={10} stroke-opacity={0} />
								{/if}
							{/each}
						{/if}
					{/each}
				</div>
				<span>{title} <EventPerformancesPersons {performance} /></span>
			</div>
		{:else if isPerformanceOpen}
			<span>{title} <EventPerformancesPersons {performance} /></span>
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
