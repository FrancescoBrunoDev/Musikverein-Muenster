<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { Circle, ChevronUp } from 'lucide-svelte';
	import { filters } from '$stores/storeFilters';
	import { getTitleString } from '$stores/storeEvents';
	import EventPerformancesPersons from '$components/listEvents/EventPerformancesPersons.svelte';
	import { fly } from 'svelte/transition';
	export let event: EventItem;

	let isPerformanceOpen = false;
	const methods: Array<keyof typeof $filters> = ['and', 'or', 'not'];

	const hasMatchingFilter = (performance: any) =>
		methods.some((method) =>
			$filters[method].some(
				(filter) =>
					(filter.entity === 'composer' &&
						performance.composers &&
						filter.id == performance.composers[0].person) ||
					(filter.entity === 'work' && filter.id == performance.work) ||
					(filter.entity === 'person' &&
						performance.persons &&
						performance.persons.some(
							(person: { person: typeof filter.id }) => filter.id == person.person
						))
			)
		);

	function handleClickAllPerformances() {
		isPerformanceOpen = !isPerformanceOpen;
	}
</script>

{#each event.performances as performance}
	{#await getTitleString(performance.work, 'work') then title}
		{#if $filters.or.length === 0 && $filters.and.length === 0 && $filters.not.length === 0}
			<span in:fly={{ y: 20, duration: 100, delay: 200 }}
				>{title} <EventPerformancesPersons {performance} /></span
			>
		{:else if hasMatchingFilter(performance)}
			<div in:fly={{ y: 20, duration: 100, delay: 200 }} class="flex items-center gap-1">
				<div class="flex flex-col gap-1">
					{#each Object.values($filters).flat() as filter}
						{#if filter.entity === 'composer' && performance.composers && filter.id == performance.composers[0].person}
							<Circle class="flex-shrink-0" fill={filter.color} size={10} stroke-opacity={0} />
						{/if}
						{#if filter.entity === 'work' && filter.id == performance.work}
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
				<span>{title}<EventPerformancesPersons {performance} /></span>
			</div>
		{:else if isPerformanceOpen}
			<span in:fly={{ y: 20, duration: 100, delay: 200 }}>{title}</span><span
				><EventPerformancesPersons {performance} /></span
			>
		{/if}
	{:catch error}
		<div>Error: {error.message}</div>
	{/await}
{/each}
{#if $filters.or.length > 0 || $filters.and.length > 0 || $filters.not.length > 0}
	<button on:click={() => handleClickAllPerformances()}>
		{#if isPerformanceOpen}
			<ChevronUp class="h-8 w-full items-center" />
		{:else}
			{$LL.events.showAllPerformances()}
		{/if}
	</button>
{/if}
