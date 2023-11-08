<script lang="ts">
	import EventPerformances from './EventPerformances.svelte';
	import { locationTitles, corporationTitles } from '$stores/storeEvents';
	import { filters } from '$stores/storeFilters';
	import { Circle } from 'lucide-svelte';
	export let event: EventItem;
	let isEventOpen = false;
	$: console.log(event, 'event');
	$: console.log($locationTitles, 'locationTitles');
	async function getTitleLocation(uid) {
		const { title } = $locationTitles[uid];
		return title;
	}

	async function getTitleCorporation(uid) {
		const { title } = $corporationTitles[uid];
		return title;
	}

	function handleClickEvent() {
		isEventOpen = !isEventOpen;
	}

	let date = event.dates[0].date.slice(5).replaceAll('-', '.');
	if (date.slice(0, 5) === '00.00') {
		date = date.replaceAll('00.00', '?');
	}

	function countFilters() {
		const filtersArrayWithCounter: {
			[key: string]: {
				counter: number;
				color: string;
			};
		} = {};

		$filters.or.forEach((filter) => {
			if (!filtersArrayWithCounter.hasOwnProperty(filter.id)) {
				filtersArrayWithCounter[filter.id] = {
					counter: 0,
					color: filter.color
				};
			}
			if (!event.performances) return;
			if (filter.entity === 'composer') {
				event.performances.forEach((performance) => {
					if (performance.composers && filter.id == performance.composers[0].person) {
						filtersArrayWithCounter[filter.id].counter++;
					}
				});
			} else if (filter.entity === 'work') {
				event.performances.forEach((performance) => {
					if (performance.work && filter.id == performance.work) {
						filtersArrayWithCounter[filter.id].counter++;
					}
				});
			} else if (event.corporations && filter.entity === 'corporation') {
				event.corporations.forEach((corporation) => {
					if (filter.id == corporation.corporation) {
						filtersArrayWithCounter[filter.id].counter++;
					}
				});
			} else if (filter.entity === 'person') {
				event.performances.forEach((performance) => {
					if (performance.persons) {
						performance.persons.forEach((person) => {
							if (filter.id == person.person) {
								filtersArrayWithCounter[filter.id].counter++;
							}
						});
					}
				});
			}
		});

		return filtersArrayWithCounter;
	}
	$: filtersArrayWithCounter = countFilters();
</script>

<div
	class={`w-fit ${
		isEventOpen
			? 'flex h-fit flex-shrink-0 flex-col border-2 border-primary dark:border-secondary'
			: 'flex flex-col justify-center gap-2'
	}`}
>
	<button
		on:click={() => handleClickEvent()}
		class={`flex-shrink-0 flex-grow-0 border-primary font-bold dark:border-secondary ${
			isEventOpen
				? 'relative left-0 right-0 top-0 h-fit w-80 border-b-2 py-2'
				: 'h-32 w-24 border-2'
		}`}
		>{date}
		{#if !isEventOpen}
			<div class="flex flex-wrap justify-center gap-2">
				{#each Object.keys(filtersArrayWithCounter) as key}
					{#if filtersArrayWithCounter[key].counter > 0}
						<span class="flex items-center gap-1 text-sm font-light">
							{filtersArrayWithCounter[key].counter}
							<Circle
								class="flex-shrink-0"
								fill={filtersArrayWithCounter[key].color}
								size={10}
								stroke-opacity={0}
							/>
						</span>
					{/if}
				{/each}
			</div>
		{/if}
		{#if !isEventOpen}
			<div class="flex flex-wrap justify-center gap-1"></div>
		{/if}
		{#if isEventOpen}
			<br />
			<span class="text-sm dark:font-semibold">
				{#if event.locations}
					{#each event.locations as location}
						{#await getTitleLocation(location.location) then title}
							{title}
						{:catch error}
							<div>Error: {error.message}</div>
						{/await}
					{/each}
				{/if}
			</span>
		{/if}
	</button>
	{#if isEventOpen}
		<div class="p-2">
			{#if event.corporations}
				<div class="flex">
					<div class="w-full text-base font-bold dark:font-semibold">Corporations</div>
					{#each event.corporations as corporation}
						{#await getTitleCorporation(corporation.corporation) then title}
							<span class="text-sm">{title}</span>
						{:catch error}
							<div>Error: {error.message}</div>
						{/await}
					{/each}
				</div>
			{/if}
			<div class="w-80">
				<div class="w-full text-base font-bold dark:font-semibold">Performances</div>
				{#if event.performances}
					<div class="flex flex-col gap-1 divide-y-2 divide-primary dark:divide-secondary">
						<EventPerformances {event} />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
